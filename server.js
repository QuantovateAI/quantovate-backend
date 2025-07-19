// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// 🔐 OpenAI API Setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 🎯 Trade Evaluation Endpoint
app.post("/api/evaluate", async (req, res) => {
  const { trade } = req.body;

  if (!trade || typeof trade !== "string") {
    return res.status(400).json({ result: "❌ Invalid trade input." });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You're a professional market strategist. Evaluate this trade idea and return a short analysis covering risk, potential reward, and strategic soundness.",
        },
        {
          role: "user",
          content: trade,
        },
      ],
    });

    const result = completion.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (error) {
    console.error("OpenAI error:", error.message);
    res.status(500).json({ result: "⚠️ Failed to evaluate trade." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
