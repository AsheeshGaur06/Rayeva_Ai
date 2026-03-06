const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/categoryController");

router.post("/", createProduct);

module.exports = router;