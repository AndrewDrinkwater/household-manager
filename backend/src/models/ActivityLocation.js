const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ActivityLocation = sequelize.define('ActivityLocation', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  priceLevelOverride: DataTypes.INTEGER,
  indoorOutdoorOverride: DataTypes.ENUM('indoor', 'outdoor', 'both'),
  educationalValueOverride: DataTypes.ENUM('low', 'medium', 'high'),
  notes: DataTypes.TEXT,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = ActivityLocation;
