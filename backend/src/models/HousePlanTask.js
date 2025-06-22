const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const HousePlanTask = sequelize.define('HousePlanTask', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'not_started' },
  dueDate: { type: DataTypes.DATE },
}, { paranoid: true });

module.exports = HousePlanTask;
