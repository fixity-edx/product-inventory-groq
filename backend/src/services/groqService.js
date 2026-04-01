/**
 * Groq API integration (console.groq.com)
 * Uses fetch (native in Node 18+).
 */
export async function generateDescription({ name, keywords = [] }){
  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error("GROQ_API_KEY missing in .env");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const prompt = `Write a short e-commerce product description (2-3 lines).
Product: ${name}
Keywords: ${keywords.join(", ") || "N/A"}
Rules: professional, attractive, mention 2 benefits, plain text only.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You write crisp product descriptions." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 140
    })
  });

  const data = await response.json();

  if(!response.ok){
    const msg = data?.error?.message || "Groq API error";
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}
