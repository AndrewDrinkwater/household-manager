const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BudgetMonth = sequelize.define('BudgetMonth', {
  month: { type: DataTypes.STRING, allowNull: false, unique: true },
  notes: DataTypes.TEXT,
});

module.exports = BudgetMonth;
