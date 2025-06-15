const { Sequelize } = require('sequelize');
const path = require('path');

const storage = process.env.DB_STORAGE ||
  path.join(__dirname, '../database.sqlite');

module.exports = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
});

