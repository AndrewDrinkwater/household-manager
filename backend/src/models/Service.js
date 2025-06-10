// backend/src/models/Service.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Service = sequelize.define('Service', {
  name:            { type: DataTypes.STRING, allowNull: false },
  contract_number: DataTypes.STRING,
  account_url:     DataTypes.STRING,
  username:        DataTypes.STRING,
  cost:            DataTypes.DECIMAL(10,2),
  start_date:      DataTypes.DATEONLY,
  next_due_date:   DataTypes.DATEONLY,
  notes:           DataTypes.TEXT
  // Foreign keys set via associations
});

module.exports = Service;
