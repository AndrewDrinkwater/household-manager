const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SpinHistory = sequelize.define('SpinHistory', {
  ip:         { type: DataTypes.STRING, allowNull: false },
  resultLabel:{ type: DataTypes.STRING },
  resultType: { type: DataTypes.STRING },
});

module.exports = SpinHistory;
