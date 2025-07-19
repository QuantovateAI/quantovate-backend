const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/evaluate", async (req, res) => {
  const tradeText = req.body.trade;

  const prompt = `You are an AI trade evaluation engine. Based on the trade below, assess the quality on a scale of 1–100 across 5 categories: technical setup, catalyst strength, risk/reward, volatility profile, and conviction clarity. Provide a score and comment for each.\n\nTRADE:\n${tradeText}\n\nOutput format:\n1. Technical Setup: x/20 — comment\n2. Catalyst Strength: x/20 — comment\n3. Risk/Reward: x/20 — comment\n4. Volatility Profile: x/20 — comment\n5. Conviction Clarity: x/20 — comment\n✅ Overall Score: x/100\n✅ Recommendation: ...`;

  try {
    const gptResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = gptResponse.data.choices[0].message.content;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "GPT evaluation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
