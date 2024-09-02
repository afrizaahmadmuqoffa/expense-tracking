const express = require("express");
const router = express.Router();
const Category = require("../models/categoryModel.js");

router.get("/", async (req, res) => {
    const { type } = req.query; // 'type' diambil dari query parameter

    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const categories = await Category.findAll({
            where: { type }
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /categories - Menambahkan kategori baru
router.post("/", async (req, res) => {
    try {
        const { name,type } = req.body;
        if (!name && !type) {
            return res.status(400).json({ error: "Name and type is required" });
        }
        const category = await Category.create({ name,type });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /categories/:id - Memperbarui kategori berdasarkan ID
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        category.name = name || category.name;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /categories/:id - Menghapus kategori berdasarkan ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        await category.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
