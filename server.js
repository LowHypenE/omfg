import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = "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"; // <- put your key here
const MODEL_ID = "openai/gpt-oss-20b:free";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: "No message provided" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [{ role: "user", content: message }],
        stream: true, // enables streaming
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).send({ error: text });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      res.write(`data: ${chunk}\n\n`);
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
