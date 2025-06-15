// backend/server.js
// This comment was added to test Codex automated testing.
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sequelize = require('./db');
const routes = require('./routes');

// Load all models (to register associations)
require('./models/Category');
require('./models/Subcategory');
require('./models/vendor');
require('./models/Frequency');
require('./models/Service');
require('./models/user');
require('./models/Attachment'); // Make sure to require this!
require('./models/BacklogItem');
require('./models/BacklogNote');
require('./models/BudgetMonth');
require('./models/BudgetLine');
require('./models/BudgetEntry');
require('./models/IncomeSource');
require('./models/SavingsPot');
require('./models/SavingsEntry');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Multer setup for file uploads ---
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Optionally: prepend timestamp for uniqueness
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));

// Middleware
app.use(cors());
app.use(express.json());

// Serve attachments
app.use('/uploads', express.static(uploadDir));

// Use your existing routes for regular API endpoints
app.use('/api', routes);

// --- Start the server as before ---
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
