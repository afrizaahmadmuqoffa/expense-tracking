const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionController.js')

router.get("/api/transactions", transactionsController.getTransactions);

router.get("/api/transactions/:id", transactionsController.getTransaction)

router.post("/api/transactions", transactionsController.createTransaction);

router.patch("/api/transactions/:id", transactionsController.updateTransaction);

router.delete("/api/transactions/:id", transactionsController.deleteTransaction);

module.exports = router;
