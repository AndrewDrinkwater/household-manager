const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BudgetMonth = require('./BudgetMonth');

const IncomeSource = sequelize.define('IncomeSource', {
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
});

IncomeSource.belongsTo(BudgetMonth, { foreignKey: { allowNull: false } });
BudgetMonth.hasMany(IncomeSource);

module.exports = IncomeSource;
