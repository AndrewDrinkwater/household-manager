// backend/server.js
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

// Middleware
app.use(cors());
app.use(express.json());

// Serve attachments
app.use('/uploads', express.static(uploadDir));

// Use your existing routes for regular API endpoints
app.use('/api', routes);

// ---- Attachment upload route (add after app.use('/api', routes)) ----
require('./models'); // Loads all, registers associations


app.post('/api/services/:serviceId/attachments', upload.single('file'), async (req, res) => {
  const { serviceId } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    // Optionally, validate that the Service exists first
    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const attachment = await Attachment.create({
      ServiceId: serviceId,
      filename: req.file.originalname,
      stored_filename: req.file.filename, // To use the unique file on disk
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
