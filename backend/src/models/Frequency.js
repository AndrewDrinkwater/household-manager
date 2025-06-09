const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Frequency = sequelize.define('Frequency', {
  name:            { type: DataTypes.STRING, allowNull: false, unique: true },
  interval_months: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Frequency;
