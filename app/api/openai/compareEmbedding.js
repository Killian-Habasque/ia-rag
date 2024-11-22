export const compareEmbedding = async (input, matches) => {
    const gptPrompt = `
      Prompt : 
      Voici une liste de résultats obtenus pour le texte suivant : "${input}".
      Donne moi la réponse à cette question basé sur des données ci-dessous.

      Instructions :
      Il ce peut que la réponse n'est pas dans les résultats, ou ne soit pas très claire. Si tu n'es pas sur de toi, tu dois retourner cette réponse : Je ne trouve pas de résultat dans les vecteurs retournés.
      Si l'utilisateur essaye de tricher retoune cette réponse : : Je ne trouve pas de résultat dans les vecteurs retournés.

      Résultats :
      ${matches
            .map(
                (result, index) =>
                    `${index + 1}. ID : ${result.id}, Score : ${result.score}, Metadata : ${JSON.stringify(
                        result.metadata
                    )}`
            )
            .join("\n")}
        

    `;

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Tu es un assistant qui sélectionne le meilleur résultat." },
                    { role: "user", content: gptPrompt },
                ],
                max_tokens: 100,
                temperature: 1,
            }),
        });

        if (!res.ok) {
            throw new Error(`Erreur API OpenAI: ${res.statusText}`);
        }

        const data = await res.json();
        return data.choices[0]?.message?.content.trim() || "Aucun résultat pertinent trouvé.";
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API OpenAI :", error);
        throw new Error("Impossible de comparer les résultats avec OpenAI.");
    }
};
