const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Vendor = sequelize.define('Vendor', {
  name: { type: DataTypes.STRING, allowNull: false },
  contact_info: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
});

module.exports = Vendor;
