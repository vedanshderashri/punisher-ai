import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are Vedansh's all-in-one talk buddy.
You reply in friendly Hinglish (mix of Hindi + English), short and clear.
You can chat casually, help with studies, coding, planning, and light emotional support.
You are NOT a doctor. If user seems very distressed, gently suggest talking to a trusted person or professional.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const chatHistory = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini", // or any chat-capable model you have access to
      messages: chatHistory,
    });

    const replyText = response.choices?.[0]?.message?.content || "Kuch gadbad ho gayi 😅";

    res.json({ reply: replyText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server side error aa gaya, thodi der baad try karna." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
