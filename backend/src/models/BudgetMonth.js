const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BudgetMonth = sequelize.define('BudgetMonth', {
  month: { type: DataTypes.STRING, unique: true }, // YYYY-MM
});

module.exports = BudgetMonth;
