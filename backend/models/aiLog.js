const mongoose = require("mongoose");



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



aiLogSchema.index({ module: 1 });
aiLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("aiLog", aiLogSchema);