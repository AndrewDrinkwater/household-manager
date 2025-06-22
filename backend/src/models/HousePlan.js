const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HousePlan = sequelize.define('HousePlan', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'planned' },
  budget: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  actualSpend: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  createdBy: { type: DataTypes.INTEGER },
}, { paranoid: true });

module.exports = HousePlan;
