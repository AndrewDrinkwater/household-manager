const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BudgetLine = sequelize.define('BudgetLine', {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // BILL | VARIABLE | ANNUAL
  is_retired: { type: DataTypes.BOOLEAN, defaultValue: false },
  repeats_annually: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = BudgetLine;
