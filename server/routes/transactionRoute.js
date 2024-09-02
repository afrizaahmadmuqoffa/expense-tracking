const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel.js');
const Category = require('../models/categoryModel.js');

router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: {
                model: Category,
                attributes: ['id', 'name'],
            },
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req,res)=>{
    try {
        const {id} = req.params
        
        const transaction = await Transaction.findByPk(id,{
            include:{
                model: Category,
                attributes:["id","name"]
            }
        })
        res.status(200).json(transaction)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const { type, date, categoryId, amount, description } = req.body;
        
        if (!type || !date || !amount) {
            return res.status(400).json({ error: 'Type, date, and amount are required' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either income or expense' });
        }

        let category = null;
        if (categoryId) {
            category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ error: 'Invalid categoryId' });
            }
        }

        const transaction = await Transaction.create({
            type,
            date,
            categoryId : category.id,
            amount,
            description,
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, date, categoryId, amount, description } = req.body;
        
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ error: 'Type must be either income or expense' });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: 'Invalid categoryId' });
        }
        transaction.categoryId = category.id;        
        transaction.type = type || transaction.type;
        transaction.date = date || transaction.date;
        transaction.categoryId = categoryId
        transaction.amount = amount || transaction.amount;
        transaction.description = description || transaction.description;
 
        await transaction.save();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
