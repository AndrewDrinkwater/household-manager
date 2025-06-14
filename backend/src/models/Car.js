const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Car = sequelize.define('Car', {
  make:       { type: DataTypes.STRING, allowNull: false },
  model:      { type: DataTypes.STRING, allowNull: false },
  year:       { type: DataTypes.INTEGER },
  registration: { type: DataTypes.STRING, unique: true },
  value:      { type: DataTypes.DECIMAL(10, 2) },
  notes:      { type: DataTypes.TEXT },

  // Summary fields populated from related records
  nextTaxDue:         { type: DataTypes.DATE },
  nextInsuranceDue:   { type: DataTypes.DATE },
  insuranceProviderName: { type: DataTypes.STRING },
  nextMotDue:         { type: DataTypes.DATE },
  nextServiceDue:     { type: DataTypes.DATE },
  serviceType:        { type: DataTypes.STRING },
  lastMileage:        { type: DataTypes.INTEGER },
});

module.exports = Car;
