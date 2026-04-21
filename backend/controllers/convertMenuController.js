const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.convertMenu = async (req, res) => {
  try {
    const { client } = req.params;
    const { text } = req.body;

    console.log("🍽️ convertMenu HIT for:", client);

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
          You are a menu parser.

Convert raw restaurant menu text into JSON that EXACTLY matches this structure:

{
  "restaurantName": "string",
  "sections": [
    {
      "id": "string",
      "section": "string",
      "groups": [
        {
          "id": "string",
          "groupName": "string",
          "items": [Item]
        }
      ],
      "items": [Item]
    }
  ]
}

Each Item must have:

{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": number,
  "image": "",
  "available": true,
  "visible": true,
  "remaining": null,
  "modifiers": [],
  "customProperties": [],
  "tags": []
}

Rules:

- ALWAYS include "restaurantName"
- ALWAYS include "sections"
- ALWAYS include "groups" (empty array if none)
- ALWAYS include "items" (empty array if none)
- DO NOT invent images → use empty string ""
- DO NOT invent modifiers → use []
- DO NOT invent tags → use []
- If no price found → use 0
- If no description → use ""

- Section names should come from the text (e.g. APPETIZERS → "Appetizers")

- If the menu clearly has subcategories (like sizes or drink types), use "groups"
- Otherwise, keep everything in "items"

- IDs can be simple unique strings (e.g. "sec1", "item1", etc.)

Return ONLY valid JSON. No explanation.

`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    const raw = completion.choices[0].message.content;
// 🔥 CLEAN AI RESPONSE (remove ```json wrappers if present)
const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseErr) {
      console.error("❌ JSON parse failed:", raw);
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    return res.json(parsed);
  } catch (err) {
    console.error("❌ Convert error:", err);
    return res.status(500).json({ error: "Failed to convert menu" });
  }
};