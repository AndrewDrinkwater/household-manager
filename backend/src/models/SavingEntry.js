const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BudgetMonth = require('./BudgetMonth');
const SavingPot = require('./SavingPot');

const SavingEntry = sequelize.define('SavingEntry', {
  value: { type: DataTypes.DECIMAL(10,2), allowNull: false },
});

SavingEntry.belongsTo(BudgetMonth, { foreignKey: { allowNull: false } });
BudgetMonth.hasMany(SavingEntry);
SavingEntry.belongsTo(SavingPot, { foreignKey: { allowNull: false } });
SavingPot.hasMany(SavingEntry);

module.exports = SavingEntry;
