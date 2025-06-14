const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BudgetMonth = require('./BudgetMonth');

const BudgetLine = sequelize.define('BudgetLine', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  planned: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  actual: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  is_paid: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_retired: { type: DataTypes.BOOLEAN, defaultValue: false },
  repeats_annually: { type: DataTypes.BOOLEAN, defaultValue: false },
});

BudgetLine.belongsTo(BudgetMonth, { foreignKey: { allowNull: false } });
BudgetMonth.hasMany(BudgetLine);

module.exports = BudgetLine;
