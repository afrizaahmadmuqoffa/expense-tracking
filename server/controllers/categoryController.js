const Category = require("../models/categoryModel.js");


exports.getCategories = async (req, res) => {
    const { type } = req.query;
    if(!type){
        const categories = await Category.findAll()
        const total = categories.length

        return res.status(200).json({
            status:'success',
            result:total,
            data:{
                categories
            }
        })
    }


    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const categories = await Category.findAll({
            where: { type }
        });
        const total = categories.length
        res.status(200).json({
            status: 'success',
            result: total,
            data: {
                categories
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { name,type } = req.body;
        if (!name && !type) {
            return res.status(400).json({ error: "Name and type is required" });
        }
        const category = await Category.create({ name,type });
        res.status(201).json({
            status: 'success',
            data: {
                category
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        category.name = name || category.name;
        await category.save();
        res.json({
            status:'success',
            data:{
                category
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        await category.destroy();
        res.status(204).json({
            status: 'success',
            data: {
                category
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}