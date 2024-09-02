const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
const sequelize = require("./config/db.js")

const Category = require("./models/categoryModel.js")
const Transaction = require("./models/transactionModel.js")

const categoryRoute = require("./routes/categoryRoute.js")
const transactionRoute = require("./routes/transactionRoute.js")


sequelize.sync({ force: false }).then(() => {
    console.log('Database and tables synced')
})
    .catch(e => {
        console.error(`Error syncing database : ${e}`)
    })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/categories', categoryRoute);
app.use('/transactions', transactionRoute);


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})

const server = app.listen(port, () => {
    console.log(`Run in http://localhost:${port}/`);
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})