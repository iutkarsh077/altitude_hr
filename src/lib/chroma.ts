import { ChromaClient, CloudClient, type Collection, type EmbeddingFunction } from "chromadb";

const COLLECTION_NAME = process.env.CHROMA_COLLECTION_NAME!;

let client: ChromaClient | CloudClient | undefined;
let collectionPromise: Promise<Collection> | undefined;

const manualEmbeddingFunction: EmbeddingFunction = {
    name: "manual",
    generate: async (): Promise<number[][]> => {
        throw new Error(
            "manualEmbeddingFunction.generate() was called — embeddings should always be supplied explicitly to add()/query().",
        );
    },
};

function getClient(): ChromaClient | CloudClient {
    client = new CloudClient({
        apiKey: process.env.CHROMA_API_KEY,
        tenant: process.env.CHROMA_TENANT,
        database: process.env.CHROMA_DATABASE,
    });
    return client;
}

export function getResumeCollection(): Promise<Collection> {
    if (!collectionPromise) {
        collectionPromise = getClient().getOrCreateCollection({
            name: COLLECTION_NAME,
            metadata: { "hnsw:space": "cosine" },
            embeddingFunction: manualEmbeddingFunction,
        });
    }
    return collectionPromise;
}