const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const CarTax = sequelize.define('CarTax', {
  expiryDate: { type: DataTypes.DATE, allowNull: false },
  cost:       { type: DataTypes.DECIMAL(10, 2) },
  notes:      { type: DataTypes.TEXT },
});

CarTax.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(CarTax);

module.exports = CarTax;
