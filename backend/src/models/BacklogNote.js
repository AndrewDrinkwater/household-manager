const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BacklogNote = sequelize.define('BacklogNote', {
  text: { type: DataTypes.TEXT }
});

module.exports = BacklogNote;
