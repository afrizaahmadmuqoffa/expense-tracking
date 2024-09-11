const Transaction = require('../models/transactionModel.js');
const Category = require('../models/categoryModel.js');
const APIFeatures = require("../utils/queryHelper.js")

exports.getTransactions = async (req, res) => {
    try {
        const query = new APIFeatures(req.query)

        const where = query.filtering()
        const order = query.sorting()
        const attributes = query.limitFields()
        const offset = query.pagination()
        const limit = query.limit

        const transactions = await Transaction.findAll({
            attributes,
            where,
            limit,
            offset,
            order,
            include: {
                model: Category,
                attributes: ['id', 'type', 'name'],
            },
        });
        const total = transactions.length
        res.status(200).json({
            status: 'success',
            result: total,
            data: {
                transactions
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getTransaction = async (req,res)=>{
    try {
        const {id} = req.params
        
        const transaction = await Transaction.findByPk(id,{
            include:{
                model: Category,
                attributes:["id","type","name"]
            }
        })
        res.status(200).json({
            status: 'success',
            data: {
                transaction
            }
        })
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createTransaction = async (req, res) => {
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
            type: category.type,
            date,
            categoryId : category.id,
            amount,
            description,
        });

        res.status(201).json({
            status: 'success',
            data: {
                transaction
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateTransaction = async (req, res) => {
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
        res.status(200).json({
            status: 'success',
            result: total,
            data: {
                categories
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(204).json({
            status: 'success',
            data: {
                transaction
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}