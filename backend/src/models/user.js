// backend/src/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },  // Added password field
  role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' }
});

module.exports = User;
