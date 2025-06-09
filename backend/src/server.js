const express   = require('express');
const cors      = require('cors');
const sequelize = require('./db');

// Load all models (so associations are registered)
require('./models/Category');
require('./models/Subcategory');
require('./models/vendor');
require('./models/Frequency');
require('./models/Service');
require('./models/user');    // add this line


const apiRouter = require('./routes');

(async () => {
  await sequelize.sync({ alter: true });
  console.log('✅ Database synced');

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', apiRouter);
  app.listen(4000, () => console.log('Server listening on port 4000'));
})();
