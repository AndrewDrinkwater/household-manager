const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SavingPot = sequelize.define('SavingPot', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  current_value: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
});

module.exports = SavingPot;
