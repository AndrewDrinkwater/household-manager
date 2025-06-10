const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Load all models (to register associations)
require('./models/Category');
require('./models/Subcategory');
require('./models/vendor');
require('./models/Frequency');
require('./models/Service');
require('./models/user');

const routes = require('./routes');  // routes.js should export a router instance

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Use routes at /api
app.use('/api', require('./routes'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync();
    console.log('✅ Database synced');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
})();
