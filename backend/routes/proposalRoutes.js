const express = require("express");
const router = express.Router();

const { createProposal } = require("../controllers/proposalController");

router.post("/", createProposal);

module.exports = router;