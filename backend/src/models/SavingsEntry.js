const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SavingsEntry = sequelize.define('SavingsEntry', {
  amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 }
});

module.exports = SavingsEntry;
