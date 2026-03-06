const mongoose = require("mongoose");

/*
====================================================
PROPOSAL MODEL
Production Ready + Validation Enabled
====================================================
*/

const proposalSchema = new mongoose.Schema({

  budget: {
    type: Number,
    required: true,
    min: 1
  },

  event: {
    type: String,
    required: true,
    trim: true
  },

  preference: {
    type: String,
    required: true
  },

  proposal_data: {

    recommended_products: [
      {
        name: {
          type: String,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        unit_price: {
          type: Number,
          required: true,
          min: 0
        },

        total_price: {
          type: Number,
          required: true
        }
      }
    ],

    total_budget_used: {
      type: Number,
      default: 0
    },

    remaining_budget: {
      type: Number,
      default: 0
    },

    impact_positioning: {
      type: String,
      default: ""
    }

  },

  prompt_used: {
    type: String,
    required: true
  },

  ai_response_raw: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

/*
====================================================
Indexing for Performance
====================================================
*/
proposalSchema.index({ event: 1 });
proposalSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Proposal", proposalSchema);