const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const Tax = sequelize.define('Tax', {
  expiryDate: { type: DataTypes.DATE, allowNull: false },
  cost:       { type: DataTypes.DECIMAL(10, 2) },
  notes:      { type: DataTypes.TEXT },
});

Tax.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(Tax);

module.exports = Tax;
