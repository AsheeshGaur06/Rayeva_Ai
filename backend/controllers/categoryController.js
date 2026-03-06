const Product = require("../models/Product");
const generateCategory = require("../services/aiCategoryService");
const AILog = require("../models/aiLog");

/*
  =====================================================
  AI AUTO CATEGORY CONTROLLER
  Production Safe + Validation + Logging
  =====================================================
*/

exports.createProduct = async (req, res) => {

  try {

    const { name, description } = req.body;

    // ===============================
    // INPUT VALIDATION
    // ===============================
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters"
      });
    }

    // ===============================
    // CALL AI SERVICE
    // ===============================
    const aiResult = await generateCategory(description);

    const parsed = aiResult.parsed;

    // ===============================
    // SAFETY CHECK – AI RESPONSE
    // Prevent crash if AI returns invalid structure
    // ===============================
    if (
      !parsed ||
      !parsed.primary_category ||
      !parsed.sub_category ||
      !Array.isArray(parsed.seo_tags) ||
      !Array.isArray(parsed.sustainability_filters)
    ) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid structured data"
      });
    }

    // ===============================
    // SAVE TO DATABASE
    // ===============================
    const product = await Product.create({
      name: name || "Unnamed Product",
      description,

      ai_category_data: {
        primary_category: parsed.primary_category,
        sub_category: parsed.sub_category,
        seo_tags: parsed.seo_tags.slice(0, 10), // limit to 10
        sustainability_filters: parsed.sustainability_filters
      },

      prompt_used: aiResult.prompt,
      ai_response_raw: aiResult.raw
    });

    // ===============================
    // LOG PROMPT + RESPONSE
    // (Mandatory for Assignment)
    // ===============================
    await AILog.create({
      module: "AI Category Generator",
      prompt: aiResult.prompt,
      response: aiResult.raw
    });

    // ===============================
    // SUCCESS RESPONSE
    // ===============================
    return res.status(201).json({
      success: true,
      message: "Category generated successfully",
      data: product
    });

  } catch (error) {

    console.error("Category Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Category generation failed",
      error: error.message
    });
  }
};