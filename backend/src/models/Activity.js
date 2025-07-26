const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  defaultPriceLevel: DataTypes.INTEGER,
  defaultIndoorOutdoor: DataTypes.ENUM('indoor', 'outdoor', 'both'),
  defaultEducationalValue: DataTypes.ENUM('low', 'medium', 'high'),
  isHomeBased: { type: DataTypes.BOOLEAN, defaultValue: false },
  physicalDemand: DataTypes.ENUM('low', 'medium', 'high'),
  lastChosenDate: DataTypes.DATE,
});

module.exports = Activity;
