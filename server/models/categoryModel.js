const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type:{
        type:DataTypes.ENUM("expense", "income"),
        allowNull:false,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
})

module.exports = Category;