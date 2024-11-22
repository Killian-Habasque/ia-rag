import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export const getPrompt = async (prompt) => {
    const ResponseSchema = z.object({
        response: z.string(),
        tone: z.string(),
    });

    const requestPayload = {
        model: "gpt-4o-2024-08-06",
        messages: [
            { role: "system", content: "You are a chatbot that adapts to the tone specified by the user. The result is in json format. The tone result in a emotion emoji." },
            { role: "user", content: prompt },
        ],
        max_tokens: 100,
        temperature: 1, 
        response_format: zodResponseFormat(ResponseSchema, "custom_response"),
    };

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: JSON.stringify(requestPayload),
        });

        if (!res.ok) {
            throw new Error(`Erreur API OpenAI: ${res.statusText}`);
        }

        const data = await res.json();
        const parsedContent = JSON.parse(data.choices[0]?.message?.content);

        return {
            message: parsedContent.response,
            tone: parsedContent.tone,
        };
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API OpenAI :", error);
        throw new Error("Impossible de récupérer la réponse d'OpenAI.");
    }
};
