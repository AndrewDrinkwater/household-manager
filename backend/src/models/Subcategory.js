const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');

const Subcategory = sequelize.define('Subcategory', {
  name: { type: DataTypes.STRING, allowNull: false }
});

Category.hasMany(Subcategory, { onDelete: 'CASCADE' });
Subcategory.belongsTo(Category, { foreignKey: { allowNull: false } });

module.exports = Subcategory;
