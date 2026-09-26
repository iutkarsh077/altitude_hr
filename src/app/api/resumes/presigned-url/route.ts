import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3BucketName, s3Client } from "@/lib/s3";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        const body = await request.json() as {
            fileName?: unknown;
            contentType?: unknown;
            fileSize?: unknown;
        };

        if (
            typeof body.fileName !== "string" ||
            typeof body.contentType !== "string" ||
            typeof body.fileSize !== "number" ||
            body.contentType !== "application/pdf" ||
            body.fileSize <= 0 ||
            body.fileSize > MAX_FILE_SIZE
        ) {
            return NextResponse.json({ error: "A valid PDF smaller than 10 MB is required" }, { status: 400 });
        }

        const safeFileName = body.fileName
            .replace(/[^a-zA-Z0-9._-]/g, "-")
            .replace(/-+/g, "-")
            .slice(-120);
        const key = `resumes/${crypto.randomUUID()}-${safeFileName || "resume.pdf"}`;
        const command = new PutObjectCommand({
            Bucket: s3BucketName,
            Key: key,
            ContentType: body.contentType,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

        return NextResponse.json({
            url,
            key,
            headers: { "Content-Type": body.contentType },
        });
    } catch (error) {
        console.error("Failed to create S3 presigned URL", error);
        return NextResponse.json({ error: "Unable to prepare resume upload" }, { status: 500 });
    }
}