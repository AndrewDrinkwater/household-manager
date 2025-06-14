const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BudgetMonth = require('./BudgetMonth');
const BudgetLine = require('./BudgetLine');

const BudgetEntry = sequelize.define('BudgetEntry', {
  planned_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  actual_amount: { type: DataTypes.DECIMAL(10,2) },
  is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_changed_after_start: { type: DataTypes.BOOLEAN, defaultValue: false },
});

BudgetEntry.belongsTo(BudgetMonth, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
BudgetMonth.hasMany(BudgetEntry);

BudgetEntry.belongsTo(BudgetLine, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
BudgetLine.hasMany(BudgetEntry);

module.exports = BudgetEntry;
