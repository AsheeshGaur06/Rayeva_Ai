const OpenAI = require("openai");


if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


const ALLOWED_CATEGORIES = [
  "Packaging",
  "Corporate Gifts",
  "Stationery",
  "Food & Beverage",
  "Personal Care"
];

async function generateCategory(description) {

  if (!description || description.trim().length < 10) {
    throw new Error("Product description must be at least 10 characters");
  }



  const prompt = `
You are an AI assistant for a sustainable B2B ecommerce platform.

Strictly return valid JSON only.

Required Format:
{
  "primary_category": "",
  "sub_category": "",
  "seo_tags": [],
  "sustainability_filters": []
}

Rules:
- Primary category must be one of:
${JSON.stringify(ALLOWED_CATEGORIES)}

- Generate 5 to 10 SEO tags
- Suggest sustainability filters like:
  bamboo, recycled, compostable, biodegradable, plastic-free

- DO NOT add explanations.
- DO NOT add markdown.
- Return ONLY JSON.

Product Description:
${description}
`;

  try {

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert AI system for product categorization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    });

    let text = response?.choices?.[0]?.message?.content || "";



    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (error) {

      
      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("AI returned invalid JSON structure");
      }

      parsed = JSON.parse(match[0]);
    }


    if (!ALLOWED_CATEGORIES.includes(parsed.primary_category)) {
      parsed.primary_category = "Corporate Gifts";
    }

    
    if (!Array.isArray(parsed.seo_tags)) {
      parsed.seo_tags = [];
    }

    
    if (parsed.seo_tags.length < 5) {
      parsed.seo_tags.push(
        "sustainable product",
        "eco friendly",
        "green product",
        "recycled materials",
        "environment friendly"
      );
    }

    parsed.seo_tags = [...new Set(parsed.seo_tags)].slice(0, 10);

    
    if (!Array.isArray(parsed.sustainability_filters) || parsed.sustainability_filters.length === 0) {
      parsed.sustainability_filters = [
        "Recycled",
        "Biodegradable",
        "Plastic-Free"
      ];
    }

    return {
      parsed,
      raw: text,
      prompt
    };

  } catch (error) {

    console.error("Groq Category Error:", error.message);

    throw new Error("AI Category generation failed");
  }
}

module.exports = generateCategory;