const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Car = sequelize.define('Car', {
  make:       { type: DataTypes.STRING, allowNull: false },
  model:      { type: DataTypes.STRING, allowNull: false },
  year:       { type: DataTypes.INTEGER },
  registration: { type: DataTypes.STRING, unique: true },
  value:      { type: DataTypes.DECIMAL(10, 2) },
  notes:      { type: DataTypes.TEXT },
  status:     {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Active'
  },
});

module.exports = Car;
