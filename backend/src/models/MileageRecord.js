const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Car = require('./Car');

const MileageRecord = sequelize.define('MileageRecord', {
  recordDate: { type: DataTypes.DATE, allowNull: false },
  mileage:    { type: DataTypes.INTEGER, allowNull: false },
});

MileageRecord.belongsTo(Car, { foreignKey: { allowNull: false } });
Car.hasMany(MileageRecord);

module.exports = MileageRecord;
