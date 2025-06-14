const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BacklogItem = sequelize.define('BacklogItem', {
  title:      { type: DataTypes.STRING, allowNull: false },
  description:{ type: DataTypes.TEXT },
  category:   { type: DataTypes.STRING, allowNull: false }, // 'Defect' or 'Feature'
  priority:   { type: DataTypes.STRING, allowNull: false, defaultValue: 'Medium' },
  status:     { type: DataTypes.STRING, allowNull: false, defaultValue: 'To-do' },
  order:      { type: DataTypes.INTEGER }
});

module.exports = BacklogItem;
