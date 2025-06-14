const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const ServiceRecord = sequelize.define('ServiceRecord', {
  serviceDate: { type: DataTypes.DATE, allowNull: false },
  mileage:     { type: DataTypes.INTEGER },
  cost:        { type: DataTypes.DECIMAL(10, 2) },
  notes:       { type: DataTypes.TEXT },
});

ServiceRecord.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(ServiceRecord);

module.exports = ServiceRecord;
