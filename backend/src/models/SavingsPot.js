const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SavingsPot = sequelize.define('SavingsPot', {
  name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = SavingsPot;
