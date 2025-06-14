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
const Attachment  = require('./models/Attachment.js');

// Import carRoutes and mount on '/cars'
const carRoutes = require('./routes/carRoutes.js');  // Adjust relative path if needed

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ----------------- LOGIN -----------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Login successful for user:', username);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------- USER REGISTRATION -------------
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }

  try {
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] }
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error('User registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ------------- USER UPDATE -------------
router.put('/users/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const [updated] = await User.update(updateData, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --------- MULTER FILE UPLOAD SETUP ---------
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = require('crypto').randomBytes(16).toString('hex');
    cb(null, base + ext);
  }
});

const upload = multer({ storage });

// --- Attachments ---
router.post('/services/:serviceId/attachments', upload.single('file'), async (req, res) => {
  try {
    const { serviceId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const attachment = await Attachment.create({
      ServiceId: serviceId,
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json(attachment);
  } catch (err) {
    console.error('Upload attachment error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/services/:serviceId/attachments', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const attachments = await Attachment.findAll({ where: { ServiceId: serviceId } });
    res.json(attachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/attachments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await Attachment.findByPk(id);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

    const absPath = path.join(UPLOAD_DIR, attachment.filename);
    if (fs.existsSync(absPath)) fs.unlinkSync(absPath);

    await attachment.destroy();
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/attachments/download/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });
    const absPath = path.join(UPLOAD_DIR, attachment.filename);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'File missing' });
    res.download(absPath, attachment.originalname);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- Frequencies CRUD (explicit handlers) ---------
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

// --------- Users GET & DELETE ---------
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------- GENERIC CRUD --------------
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

// --- GENERIC CRUD for other models ---
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

// ---- MOUNT CAR ROUTES ----
router.use('/cars', carRoutes);

module.exports = router;
