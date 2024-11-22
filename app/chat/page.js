"use client";
import { useState } from "react";
import { getPrompt } from "../api/openai/getPromptObject";


export default function Page() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [finalResult, setFinalResult] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setFinalResult("");

    try {
      if (!input.trim()) {
        setStatus("Veuillez entrer un texte valide.");
        return;
      }

      const finalResult = await getPrompt(input);
      setFinalResult(finalResult);
      console.log(finalResult)
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

      {status && <p className="mt-4 text-green-600">{status}</p>}


      {finalResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow text-black w-full max-w-2xl">
          <p className="mb-2 font-semibold">Résultat final :</p>
          <div className="text-xs bg-white p-2 rounded overflow-auto whitespace-pre-wrap break-words">
            Réponse : {finalResult.message} <br></br>
            Ton : <span className="text-2xl">{finalResult.tone}</span>
          </div>
        </div>
      )}
    </div>
  );
}