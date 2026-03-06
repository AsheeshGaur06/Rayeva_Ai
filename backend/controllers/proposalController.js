const Proposal = require("../models/Proposal");
const generateProposal = require("../services/aiProposalService");
const AILog = require("../models/aiLog");

/*
====================================================
AI Proposal Controller
Production Ready + Assignment Optimized
====================================================
*/

exports.createProposal = async (req, res) => {

  try {

    const { budget, event, preference } = req.body;

    /*
    ----------------------------------------
    INPUT VALIDATION
    ----------------------------------------
    */

    if (!budget || !event || !preference) {
      return res.status(400).json({
        success: false,
        message: "Budget, event and preference are required"
      });
    }

    const numericBudget = Number(budget);

    if (isNaN(numericBudget) || numericBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid positive number"
      });
    }

    /*
    ----------------------------------------
    CALL AI SERVICE
    ----------------------------------------
    */

    const { parsed, raw, prompt } =
      await generateProposal(numericBudget, event, preference);

    /*
    ----------------------------------------
    SAFETY CHECK
    Ensure AI returned valid structured data
    ----------------------------------------
    */

    if (!parsed || !parsed.recommended_products) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response structure"
      });
    }

    /*
    ----------------------------------------
    SAVE TO DATABASE
    ----------------------------------------
    */

    const proposal = await Proposal.create({
      budget: numericBudget,
      event,
      preference,
      proposal_data: parsed,
      prompt_used: prompt,
      ai_response_raw: raw
    });

    /*
    ----------------------------------------
    LOG PROMPT + RESPONSE
    (Required for Assignment)
    ----------------------------------------
    */

    await AILog.create({
      module: "AI Proposal Generator",
      prompt,
      response: raw
    });

    /*
    ----------------------------------------
    SUCCESS RESPONSE
    ----------------------------------------
    */

    return res.status(201).json({
      success: true,
      message: "Proposal generated successfully",
      proposal
    });

  } catch (error) {

    console.error("Proposal Controller Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI Proposal generation failed",
      error: error.message
    });

  }
};