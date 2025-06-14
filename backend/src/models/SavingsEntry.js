const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const SavingsPot = require('./SavingsPot');
const BudgetMonth = require('./BudgetMonth');

const SavingsEntry = sequelize.define('SavingsEntry', {
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
});

SavingsEntry.belongsTo(SavingsPot, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
SavingsPot.hasMany(SavingsEntry);

SavingsEntry.belongsTo(BudgetMonth, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
BudgetMonth.hasMany(SavingsEntry);

module.exports = SavingsEntry;
