const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Vendor = sequelize.define('Vendor', {
  name:         { type: DataTypes.STRING, allowNull: false, unique: true },
  website_url:  DataTypes.STRING,
  contact_info: DataTypes.TEXT,
  notes:        DataTypes.TEXT
});

module.exports = Vendor;
