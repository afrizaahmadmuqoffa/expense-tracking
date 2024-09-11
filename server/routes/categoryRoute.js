const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController.js")


router.get("/api/categories", categoryController.getCategories);

router.post("/api/categories", categoryController.createCategory);

router.patch("/api/categories/:id", categoryController.updateCategory);

router.delete("/api/categories/:id", categoryController.deleteCategory);

module.exports = router;
