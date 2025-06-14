const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const IncomeSource = sequelize.define('IncomeSource', {
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
});

module.exports = IncomeSource;
