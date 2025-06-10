// backend/src/routes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const Category    = require('./models/Category.js');
const Subcategory = require('./models/Subcategory.js');
const Vendor      = require('./models/vendor.js');
const Frequency   = require('./models/Frequency.js');
const Service     = require('./models/Service.js');
const User        = require('./models/user.js');
const Attachment  = require('./models/Attachment.js'); // <-- Add

// --- MULTER SETUP for file upload ---
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
const upload = multer({ dest: UPLOAD_DIR });

// --- ATTACHMENTS ---
// POST /api/services/:serviceId/attachments
router.post('/services/:serviceId/attachments', upload.single('file'), async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const attachment = await Attachment.create({
      ServiceId: serviceId,
      filename: req.file.originalname,
      filepath: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(attachment);
  } catch (err) {
    console.error('Upload attachment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services/:serviceId/attachments
router.get('/services/:serviceId/attachments', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const attachments = await Attachment.findAll({ where: { ServiceId: serviceId } });
    res.json(attachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/attachments/:id
router.delete('/attachments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await Attachment.findByPk(id);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

    // Delete file from disk
    const absPath = path.join(UPLOAD_DIR, attachment.filepath);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await attachment.destroy();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional: serve attachments (for download)
router.get('/attachments/download/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });
    const absPath = path.join(UPLOAD_DIR, attachment.filepath);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'File missing' });
    res.download(absPath, attachment.filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** --- FREQUENCIES (explicit handlers) --- **/
router.get('/frequencies', async (req, res) => {
  try { res.json(await Frequency.findAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/frequencies', async (req, res) => {
  const { name, interval_months } = req.body;
  if (!name || interval_months == null) {
    return res.status(400).json({ error: '`name` and `interval_months` are required.' });
  }
  try {
    const freq = await Frequency.create({ name, interval_months });
    res.status(201).json(freq);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: err.message });
  }
});

router.put('/frequencies/:id', async (req, res) => {
  const { name, interval_months } = req.body;
  if (!name || interval_months == null) {
    return res.status(400).json({ error: '`name` and `interval_months` are required.' });
  }
  try {
    const [updated] = await Frequency.update(
      { name, interval_months },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Frequency not found' });
    res.sendStatus(204);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: err.message });
  }
});

router.delete('/frequencies/:id', async (req, res) => {
  try {
    const deleted = await Frequency.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Frequency not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** --- GENERIC CRUD for other models --- **/
function crud(path, Model, include = []) {
  router.get(`/${path}`, async (req, res) => {
    try {
      const items = await Model.findAll({ include });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.post(`/${path}`, async (req, res) => {
    try {
      const inst = await Model.create(req.body);
      res.status(201).json(inst);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const [updated] = await Model.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.sendStatus(204);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

crud('categories',   Category,    [Subcategory]);
crud('subcategories',Subcategory, [Category]);
crud('vendors',      Vendor);
crud('services',     Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('contracts',    Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('users',        User);

module.exports = router;
