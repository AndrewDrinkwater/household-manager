const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sequelize = require('./db');
const routes = require('./routes');

// Load all models and associations
require('./models');
const { Service, Attachment } = require('./models');

const app = express();
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use('/api', routes);

app.post('/api/services/:serviceId/attachments', upload.single('file'), async (req, res) => {
  const { serviceId } = req.params;
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const attachment = await Attachment.create({
      ServiceId: serviceId,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { app, sequelize };
