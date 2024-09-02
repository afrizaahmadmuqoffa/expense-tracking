const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");
const Category = require("./categoryModel.js");

const Transaction = sequelize.define("Transaction", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false,
    },
    type: {
        type: DataTypes.ENUM("income", "expense"),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
    },
})

Category.hasMany(Transaction, { foreignKey: "categoryId", onDelete: "CASCADE" });
Transaction.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Transaction;
