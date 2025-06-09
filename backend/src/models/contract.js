const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Vendor = require('./vendor');
const User = require('./user');

const Contract = sequelize.define('Contract', {
  name: { type: DataTypes.STRING, allowNull: false },
  contract_number: { type: DataTypes.STRING },
  start_date: { type: DataTypes.DATEONLY },
  end_date: { type: DataTypes.DATEONLY },
  renewal_date: { type: DataTypes.DATEONLY },
  notes: { type: DataTypes.TEXT }
});

// Associations
Contract.belongsTo(Vendor, { foreignKey: { allowNull: false } });
Contract.belongsTo(User, { foreignKey: { allowNull: false } });

module.exports = Contract;
