const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const Mot = sequelize.define('Mot', {
  testDate:  { type: DataTypes.DATE, allowNull: false },
  expiryDate:{ type: DataTypes.DATE, allowNull: false },
  cost:      { type: DataTypes.DECIMAL(10, 2) },
  notes:     { type: DataTypes.TEXT },
});

Mot.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(Mot);

module.exports = Mot;
