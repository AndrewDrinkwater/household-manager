const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HousePlanLineItem = sequelize.define('HousePlanLineItem', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  estimate: { type: DataTypes.DECIMAL(10,2) },
  actualSpend: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
}, { paranoid: true });

module.exports = HousePlanLineItem;
