import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
});

export const queryPinecone = async (embeddingVector, topK = 10) => {
    try {
        const index = pc.index("ecv");
        const queryResponse = await index.query({
            vector: embeddingVector,
            topK: topK,
            includeMetadata: true,
        });

        return queryResponse.matches;
    } catch (error) {
        throw new Error(`Erreur lors de la requête Pinecone: ${error.message}`);
    }
};
