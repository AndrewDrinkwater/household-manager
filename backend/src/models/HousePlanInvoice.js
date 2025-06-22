const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HousePlanInvoice = sequelize.define('HousePlanInvoice', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  vendor: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL(10,2) },
  dateIssued: { type: DataTypes.DATE },
  paid: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { paranoid: true });

module.exports = HousePlanInvoice;
