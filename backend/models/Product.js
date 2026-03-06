const mongoose = require("mongoose");



const productSchema = new mongoose.Schema(
  {

    name: {
      type: String,
      trim: true,
      default: "Unnamed Product"
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },

    ai_category_data: {

      primary_category: {
        type: String,
        required: true
      },

      sub_category: {
        type: String,
        required: true
      },

      seo_tags: {
        type: [String],
        default: []
      },

      sustainability_filters: {
        type: [String],
        default: []
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

  },
  {
    timestamps: true
  }
);



productSchema.index({ "ai_category_data.primary_category": 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);