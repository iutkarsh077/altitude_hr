import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth";
import { getResumeCollection } from "@/lib/chroma";
import { getEmbeddings } from "@/lib/embeddings";
import { db, client } from "@/prisma/db";

export const runtime = "nodejs";

const intentSchema = z.object({
    isCandidateSearch: z.boolean(),
});

const candidateMatchSchema = z.object({
    matches: z.array(z.object({
        documentId: z.string(),
        candidateName: z.string(),
        headline: z.string(),
        matchScore: z.number().min(0).max(100),
        summary: z.string(),
        skills: z.array(z.string()),
        relevantExperience: z.array(z.string()),
    })),
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await req.json() as { prompt?: unknown, query?: unknown };
        if (typeof body.prompt !== "string" || !body.prompt.trim()) {
            return NextResponse.json({ error: "A search prompt is required" }, { status: 400 });
        }

        const prompt = body.prompt.trim();


        const requestedSessionId =
            typeof body.query === "object" &&
                body.query !== null &&
                "_id" in body.query &&
                typeof body.query._id === "string"
                ? body.query._id
                : null;
        let chatSessionDetail = requestedSessionId
            ? await db.orm.chatSession.where({ _id: requestedSessionId, userId: user._id }).first()
            : null;

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: process.env.OPENAI_CHAT_MODEL ?? "gpt-5.4-mini",
            temperature: 0,
        });
        const intent = await model.withStructuredOutput(intentSchema).invoke(`
Decide whether this request is specifically about finding, comparing, or evaluating candidates from resumes.
Return false for general knowledge, coding help, jokes, weather, casual conversation, or any unrelated request.

User request:
${prompt}
        `);

        if (!intent.isCandidateSearch) {
            return NextResponse.json({ matches: [], chatSessionDetail: null });
        }

        if (!chatSessionDetail) {
            const now = new Date();
            chatSessionDetail = await db.orm.chatSession.create({
                name: prompt.substring(0, 20),
                userId: user._id,
                createdAt: now,
                updatedAt: now,
            });
        }
        const sessionResponse = {
            _id: String(chatSessionDetail._id),
            name: chatSessionDetail.name,
            createdAt: chatSessionDetail.createdAt.toISOString(),
            updatedAt: chatSessionDetail.updatedAt.toISOString(),
        };

        const queryEmbedding = await getEmbeddings().embedQuery(prompt);
        const collection = await getResumeCollection();
        const search = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 12,
            // where: { userId: String(user._id) },
            include: ["documents", "metadatas", "distances"],
        });

        const documents = search.documents?.[0] ?? [];
        const metadatas = search.metadatas?.[0] ?? [];
        const contexts = documents.flatMap((document, index) => {
            const metadata = metadatas[index];
            if (!document || !metadata || typeof metadata.documentId !== "string") {
                return [];
            }

            return [{
                documentId: metadata.documentId,
                fileName: String(metadata.fileName ?? "Resume"),
                key: String(metadata.key ?? ""),
                text: document,
            }];
        });

        if (contexts.length === 0) {
            return NextResponse.json({ matches: [], chatSessionDetail: sessionResponse });
        }


        const result = await model.withStructuredOutput(candidateMatchSchema).invoke(`
    You are a careful recruiting search assistant. Match the user's request against the supplied resume excerpts.
Return only candidates supported by the excerpts. Use the exact documentId values provided; never invent IDs.
Keep the response concise and useful for a candidate card. Score each match from 0 to 100.
Do not return a candidate if the candidate name is missing or unsupported by the excerpts.

User request:
${prompt}

Resume excerpts:
${JSON.stringify(contexts)}
        `);

        const sourceByDocumentId = new Map(contexts.map((context) => [context.documentId, context]));
        const matches = result.matches.flatMap((match) => {
            const source = sourceByDocumentId.get(match.documentId);
            if (!source || !source.key || !match.candidateName.trim()) {
                return [];
            }

            return [{
                ...match,
                fileName: source.fileName,
                downloadUrl: `/api/resumes/download?key=${encodeURIComponent(source.key)}`,
            }];
        });

        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                await db.orm.chats.create({
                    chatSessionId: sessionResponse._id,
                    role: "user",
                    content: prompt,
                    candidates: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                await db.orm.chats.create({
                    chatSessionId: sessionResponse._id,
                    role: "ai",
                    content: "",
                    candidates: matches,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
            })
        } finally {
            await session.endSession();
        }

        return NextResponse.json({ matches, chatSessionDetail: sessionResponse });
    } catch (error) {
        console.error("Candidate search failed", error);
        return NextResponse.json({ error: "Unable to search candidates" }, { status: 500 });
    }
}