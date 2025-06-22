const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HousePlanQuote = sequelize.define('HousePlanQuote', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  vendor: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL(10,2) },
  dateReceived: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT },
}, { paranoid: true });

module.exports = HousePlanQuote;
