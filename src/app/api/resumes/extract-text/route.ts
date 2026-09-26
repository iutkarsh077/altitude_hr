import "@/lib/pdf-polyfills";
import { randomUUID } from "node:crypto";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

import { getResumeCollection } from "@/lib/chroma";
import { getEmbeddings } from "@/lib/embeddings";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/prisma/db";
import { s3BucketName, s3Client } from "@/lib/s3";

export const runtime = "nodejs";

const CHUNK_SIZE = 50;
const CHUNK_OVERLAP = 10;

export async function POST(request: Request) {
    let parser: PDFParse | undefined;

    try {
        const body = (await request.json()) as {
            key?: unknown;
            fileName?: unknown;
            contentType?: unknown;
        };

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        if (
            typeof body.key !== "string" ||
            body.contentType !== "application/pdf"
        ) {
            return NextResponse.json({ error: "A valid uploaded PDF is required" }, { status: 400 });
        }

        const { key } = body;
        const fileName =
            typeof body.fileName === "string" ? body.fileName : key.split("/").pop() ?? key;

        const object = await s3Client.send(
            new GetObjectCommand({
                Bucket: s3BucketName,
                Key: key,
            }),
        );

        if (!object.Body) {
            return NextResponse.json({ error: "Uploaded PDF was not found" }, { status: 404 });
        }

        const pdfBytes = await object.Body.transformToByteArray();

        parser = new PDFParse({ data: pdfBytes });
        const extracted = await parser.getText();

        if (!extracted.text.trim()) {
            return NextResponse.json({ error: "No extractable text found in PDF" }, { status: 422 });
        }

        const baseDocument = new Document({
            pageContent: extracted.text,
            metadata: { key, fileName },
        });

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: CHUNK_SIZE,
            chunkOverlap: CHUNK_OVERLAP,
        });
        const chunks = await splitter.splitDocuments([baseDocument]);

        const documentId = randomUUID();
        const uploadedAt = new Date().toISOString();

        const enrichedChunks = chunks.map((chunk, index) => {
            const { loc, ...restMetadata } = chunk.metadata;
            chunk.metadata = {
                ...restMetadata,
                documentId,
                key,
                fileName,
                userId: String(currentUser._id),
                chunkIndex: index,
                totalChunks: chunks.length,
                uploadedAt,
                source: "resume-upload",
            };
            return chunk;
        });

        const ids = enrichedChunks.map((_, index) => `${documentId}:${index}`);
        const texts = enrichedChunks.map((chunk) => chunk.pageContent);
        const metadatas = enrichedChunks.map((chunk) => chunk.metadata);

        const embeddings = getEmbeddings();
        const vectors = await embeddings.embedDocuments(texts);

        const collection = await getResumeCollection();
        await collection.add({
            ids,
            embeddings: vectors,
            documents: texts,
            metadatas,
        });

        try {
            await db.orm.uploadedPdf.create({
                documentId,
                key,
                fileName,
                userId: currentUser._id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            await collection.delete({ ids });
            throw error;
        }

        return NextResponse.json({
            key,
            fileName,
            documentId,
            chunkCount: enrichedChunks.length,
            text: extracted.text,
            pages: extracted.total,
        });
    } catch (error) {
        console.error("Failed to extract, chunk, and embed resume text", error);
        return NextResponse.json({ error: "Unable to process resume" }, { status: 500 });
    } finally {
        await parser?.destroy();
    }
}