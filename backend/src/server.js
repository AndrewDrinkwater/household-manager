const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

// Load all models (so associations are registered)
require('./models/Category');
require('./models/Subcategory');
require('./models/vendor');
require('./models/Frequency');
require('./models/Service');
require('./models/user'); // add this line

const apiRouter = require('./routes');

const app = express();               // <--- Define app BEFORE using it
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

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
