const sequelize = require('./models/db');
const User = require('./models/user');
const Vendor = require('./models/vendor');
const Contract = require('./models/contract');

async function syncDb() {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate, { alter: true } to update tables
    console.log('Database synced');
    process.exit();
  } catch (err) {
    console.error('Failed to sync db:', err);
    process.exit(1);
  }
}

syncDb();
