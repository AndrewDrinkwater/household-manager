const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const Insurance = sequelize.define('Insurance', {
  provider:     { type: DataTypes.STRING, allowNull: false },
  policyNumber: { type: DataTypes.STRING, allowNull: false },
  expiryDate:   { type: DataTypes.DATE, allowNull: false },
  cost:         { type: DataTypes.DECIMAL(10, 2) },
  notes:        { type: DataTypes.TEXT },
});

Insurance.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(Insurance);

module.exports = Insurance;
