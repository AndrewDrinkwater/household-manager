const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Location = sequelize.define('Location', {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  address: DataTypes.STRING,
  milesFromHome: DataTypes.DECIMAL(10,2),
  tags: {
    type: DataTypes.TEXT,
    get() {
      const raw = this.getDataValue('tags');
      return raw ? JSON.parse(raw) : [];
    },
    set(val) {
      this.setDataValue('tags', JSON.stringify(val || []));
    }
  },
  websiteUrl: DataTypes.STRING,
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = Location;
