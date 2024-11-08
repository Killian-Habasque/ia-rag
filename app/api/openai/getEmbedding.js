export const getEmbedding = async (input) => {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "text-embedding-ada-002",
            input: input,
        }),
    });

    if (!res.ok) {
        throw new Error(`Erreur API OpenAI: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data[0].embedding;
};