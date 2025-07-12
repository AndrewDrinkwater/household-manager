const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SpinSegment = sequelize.define('SpinSegment', {
  label:  { type: DataTypes.STRING, allowNull: false },
  type:   { type: DataTypes.STRING, allowNull: false },
  weight: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
});

module.exports = SpinSegment;
