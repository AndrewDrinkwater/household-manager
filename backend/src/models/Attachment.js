// backend/src/models/Attachment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Attachment = sequelize.define('Attachment', {
  filename: { type: DataTypes.STRING, allowNull: false },
  originalname: { type: DataTypes.STRING, allowNull: false },
  mimetype: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false }
  // ServiceId will be set via association
});

module.exports = Attachment;
