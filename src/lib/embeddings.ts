import { OpenAIEmbeddings } from "@langchain/openai";

let embeddings: OpenAIEmbeddings | undefined;

export function getEmbeddings(): OpenAIEmbeddings {
    if (!embeddings) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not set");
        }

        embeddings = new OpenAIEmbeddings({
            apiKey,
            model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
        });
    }

    return embeddings;
}