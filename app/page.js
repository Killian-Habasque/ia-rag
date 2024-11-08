"use client";

import { useState } from "react";
import { getEmbedding } from "./api/openai/getEmbedding";
import { upsertEmbeddingToPinecone } from "./api/pinecone/upsert";
import { queryPinecone } from "./api/pinecone/query";


export default function Page() {
  const [input, setInput] = useState("");
  const [embedding, setEmbedding] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setResults([]);

    try {
      const embeddingVector = await getEmbedding(input);
      setEmbedding(embeddingVector);

      // await upsertEmbeddingToPinecone(embeddingVector, input);
      // setStatus("Embedding inséré avec succès dans Pinecone !");

      const similarItems = await queryPinecone(embeddingVector);
      setResults(similarItems);
    } catch (error) {
      console.error("Erreur :", error);
      setStatus("Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Entrez un texte"
          className="border border-gray-300 p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
      {embedding && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow text-black w-full max-w-2xl">
          <p className="mb-2 font-semibold">Embedding :</p>
          <pre className="text-xs bg-white p-2 rounded max-h-64 overflow-auto whitespace-pre-wrap break-words">
            {JSON.stringify(embedding, null, 2)}
          </pre>
        </div>
      )}
      {status && <p className="mt-4 text-green-600">{status}</p>}
      {results.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow text-black w-full max-w-2xl">
          <p className="mb-2 font-semibold">Résultats similaires :</p>
          <ul className="list-disc pl-5">
            {results.map((result, index) => (
              <li key={index}>
                <p><strong>ID:</strong> {result.id}</p>
                <p><strong>Score:</strong> {result.score.toFixed(2)}</p>
                {result.metadata?.text && (
                  <p><strong>Texte:</strong> {result.metadata.text}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
