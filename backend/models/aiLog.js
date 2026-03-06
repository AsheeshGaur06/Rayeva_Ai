const mongoose = require("mongoose");

/*
====================================================
AI LOG MODEL
Mandatory for Assignment:
Prompt + Response Logging
====================================================
*/

const aiLogSchema = new mongoose.Schema({

  module: {
    type: String,
    required: true,
    trim: true
  },

  prompt: {
    type: String,
    required: true
  },

  response: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

/*
====================================================
Indexing for Faster Debug / Audit Search
====================================================
*/

aiLogSchema.index({ module: 1 });
aiLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("aiLog", aiLogSchema);