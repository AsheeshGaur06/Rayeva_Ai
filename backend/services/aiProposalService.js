const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

/*
=====================================================
AI PROPOSAL GENERATOR
Production Safe + Business Logic Controlled
=====================================================
*/

async function generateProposal(budget, event, preference) {

  // ============================
  // INPUT VALIDATION
  // ============================
  if (!budget || !event || !preference) {
    throw new Error("Budget, event and preference are required");
  }

  budget = Number(budget);

  if (budget <= 0) {
    throw new Error("Budget must be greater than 0");
  }

  // ============================
  // PROMPT ENGINEERING
  // ============================
  const prompt = `
You are a procurement AI for sustainable B2B commerce.

Create a structured proposal.

Budget: ₹${budget}
Event: ${event}
Sustainability Preference: ${preference}

STRICT OUTPUT FORMAT (JSON ONLY):

{
  "recommended_products": [
    {
      "name": "",
      "quantity": 0,
      "unit_price": 0,
      "total_price": 0
    }
  ],
  "total_budget_used": 0,
  "remaining_budget": 0,
  "impact_positioning": ""
}

RULES:
- Generate between 3 and 5 sustainable products
- Use only INR pricing (no decimals)
- total_price = quantity * unit_price
- total_budget_used must NOT exceed budget
- Try to use at least 70% of budget
- remaining_budget = budget - total_budget_used
- Products must match event
- No database IDs
- No explanation text
`;

  try {

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    });

    let text = response.choices[0].message.content;

    // ============================
    // CLEAN AI OUTPUT
    // ============================
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (error) {

      console.warn("AI returned invalid JSON — attempting auto-fix");

      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("AI returned invalid JSON structure");
      }

      let cleaned = match[0];

      cleaned = cleaned
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]")
        .replace(/\n/g, "")
        .replace(/\t/g, "");

      parsed = JSON.parse(cleaned);
    }

    // ============================
    // STRUCTURE VALIDATION
    // ============================
    if (!Array.isArray(parsed.recommended_products)) {
      throw new Error("AI missing recommended_products array");
    }

    // ============================
    // BUSINESS LOGIC ENFORCEMENT
    // ============================

    let calculatedTotal = 0;

    parsed.recommended_products = parsed.recommended_products.map(product => {

      const quantity = Number(product.quantity) || 0;
      const unit_price = Math.round(Number(product.unit_price) || 0);

      const total_price = quantity * unit_price;

      calculatedTotal += total_price;

      return {
        name: product.name || "Sustainable Product",
        quantity,
        unit_price,
        total_price
      };
    });

    // ============================
    // BUDGET CONTROL (Strict)
    // ============================
    if (calculatedTotal > budget) {

      console.warn("AI exceeded budget — trimming products");

      let runningTotal = 0;

      parsed.recommended_products = parsed.recommended_products.filter(product => {

        if (runningTotal + product.total_price <= budget) {
          runningTotal += product.total_price;
          return true;
        }

        return false;
      });

      calculatedTotal = runningTotal;
    }

    // ============================
    // ENSURE MINIMUM 3 PRODUCTS
    // ============================
    if (parsed.recommended_products.length < 3) {

      const fallback = [
        { name: "Recycled Notebook", quantity: 50, unit_price: 150 },
        { name: "Bamboo Pen Set", quantity: 100, unit_price: 40 },
        { name: "Eco Cotton Tote Bag", quantity: 40, unit_price: 200 },
        { name: "Stainless Steel Bottle", quantity: 30, unit_price: 250 }
      ];

      fallback.forEach(item => {

        const total_price = item.quantity * item.unit_price;

        if (
          parsed.recommended_products.length < 3 &&
          calculatedTotal + total_price <= budget
        ) {

          parsed.recommended_products.push({
            name: item.name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price
          });

          calculatedTotal += total_price;
        }

      });

    }

    // ============================
    // FINAL CALCULATION
    // ============================

    parsed.total_budget_used = calculatedTotal;
    parsed.remaining_budget = budget - calculatedTotal;

    // ============================
    // FORCE CLEAN IMPACT SUMMARY
    // ============================

    parsed.impact_positioning =
      "This sustainable product mix supports eco-friendly corporate events using bamboo, recycled paper, and reusable materials. It helps reduce plastic waste while promoting environmentally responsible business practices.";

    return {
      parsed,
      raw: text,
      prompt
    };

  } catch (error) {

    console.error("Groq API Error:", error.message);

    throw new Error("AI Proposal generation failed");
  }
}

module.exports = generateProposal;