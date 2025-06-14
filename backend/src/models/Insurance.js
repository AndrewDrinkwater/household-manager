// backend/src/models/Insurance.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');
const Vendor = require('./vendor');

const Insurance = sequelize.define('Insurance', {
  provider: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { model: Vendor, key: 'id' }
  },
  policyNumber: { type: DataTypes.STRING, allowNull: false },
  expiryDate:   { type: DataTypes.DATE, allowNull: false },
  cost:         { type: DataTypes.DECIMAL(10, 2) },
  notes:        { type: DataTypes.TEXT },
});

Insurance.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(Insurance);

Insurance.belongsTo(Vendor, { foreignKey: 'provider' });
Vendor.hasMany(Insurance, { foreignKey: 'provider' });

module.exports = Insurance;
