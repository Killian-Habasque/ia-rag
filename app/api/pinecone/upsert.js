import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

export const upsertEmbeddingToPinecone = async (embeddingVector, input) => {
    const index = pc.index("test");
    await index.upsert([
        {
            id: `text-${Date.now()}`,
            values: embeddingVector,
            metadata: { text: input },
        },
    ]);
};