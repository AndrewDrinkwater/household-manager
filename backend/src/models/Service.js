const { DataTypes } = require('sequelize');
const sequelize    = require('../db.js');
const Vendor       = require('./vendor.js');
const Subcategory  = require('./Subcategory.js');
const Frequency    = require('./Frequency.js');

const Service = sequelize.define('Service', {
  name:            { type: DataTypes.STRING, allowNull: false },
  contract_number: DataTypes.STRING,
  account_url:     DataTypes.STRING,
  username:        DataTypes.STRING,
  cost:            DataTypes.DECIMAL(10,2),
  start_date:      DataTypes.DATEONLY,
  next_due_date:   DataTypes.DATEONLY,
  notes:           DataTypes.TEXT
});

Vendor.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Vendor,  { foreignKey: { allowNull: false } });

Subcategory.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Subcategory,  { foreignKey: { allowNull: false } });

Frequency.hasMany(Service,    { onDelete: 'RESTRICT' });
Service.belongsTo(Frequency,  { foreignKey: { allowNull: false } });

module.exports = Service;
