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

const Car           = require('./models/Car');
const Mot           = require('./models/Mot');
const Insurance     = require('./models/Insurance');
const ServiceRecord = require('./models/ServiceRecord');
const CarTax        = require('./models/CarTax');
const MileageRecord = require('./models/MileageRecord');
const BacklogItem   = require('./models/BacklogItem');
const BacklogNote   = require('./models/BacklogNote');
const BudgetMonth   = require('./models/BudgetMonth');
const BudgetLine    = require('./models/BudgetLine');
const BudgetEntry   = require('./models/BudgetEntry');
const IncomeSource  = require('./models/IncomeSource');
const SavingsPot    = require('./models/SavingsPot');
const SavingsEntry  = require('./models/SavingsEntry');

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

// --------- Backlog Items ---------
router.get('/backlog-items', async (req, res) => {
  try {
    const items = await BacklogItem.findAll({ order: [['order', 'ASC']] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/backlog-items', async (req, res) => {
  try {
    const max = await BacklogItem.max('order');
    const item = await BacklogItem.create({
      ...req.body,
      order: (max || 0) + 1,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/backlog-items/:id', async (req, res) => {
  try {
    const [updated] = await BacklogItem.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/backlog-items/:id', async (req, res) => {
  try {
    const deleted = await BacklogItem.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/backlog-items/:id/move', async (req, res) => {
  try {
    const { direction } = req.body;
    const item = await BacklogItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    const targetOrder = direction === 'up' ? item.order - 1 : item.order + 1;
    const swap = await BacklogItem.findOne({ where: { order: targetOrder } });
    if (swap) await swap.update({ order: item.order });
    await item.update({ order: targetOrder });
    const items = await BacklogItem.findAll({ order: [['order', 'ASC']] });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/backlog-items/:itemId/notes', async (req, res) => {
  try {
    const notes = await BacklogNote.findAll({
      where: { BacklogItemId: req.params.itemId },
      order: [['createdAt', 'ASC']],
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/backlog-items/:itemId/notes', async (req, res) => {
  try {
    const note = await BacklogNote.create({
      BacklogItemId: req.params.itemId,
      text: req.body.text || '',
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/backlog-items/:itemId/attachments', upload.single('file'), async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const attachment = await Attachment.create({
      BacklogItemId: itemId,
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

router.get('/backlog-items/:itemId/attachments', async (req, res) => {
  try {
    const attachments = await Attachment.findAll({ where: { BacklogItemId: req.params.itemId } });
    res.json(attachments);
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

async function addCarSummaryData(car) {
  const carId = car.id;
  const result = car.toJSON();
  try {
    const [tax, insurance, mot, service, mileage] = await Promise.all([
      CarTax.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] }),
      Insurance.findOne({
        where: { CarId: carId },
        order: [['expiryDate', 'DESC']],
        include: [{ model: Vendor, attributes: ['name'] }],
      }),
      Mot.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] }),
      ServiceRecord.findOne({
        where: { CarId: carId },
        order: [['serviceDate', 'DESC']],
      }),
      MileageRecord.findOne({
        where: { CarId: carId },
        order: [['recordDate', 'DESC']],
      }),
    ]);

    const addOneYear = (date) => {
      const d = new Date(date);
      d.setFullYear(d.getFullYear() + 1);
      return d;
    };

    const nextServiceType = service
      ? service.serviceType === 'Full'
        ? 'Partial'
        : 'Full'
      : null;

    Object.assign(result, {
      nextTaxDue: tax ? tax.expiryDate : null,
      nextInsuranceDue: insurance ? insurance.expiryDate : null,
      insuranceProviderName:
        insurance && insurance.Vendor ? insurance.Vendor.name : null,
      nextMotDue: mot ? mot.expiryDate : null,
      nextServiceDue: service ? addOneYear(service.serviceDate) : null,
      serviceType: nextServiceType,
      lastMileage: mileage ? mileage.mileage : null,
    });
  } catch (err) {
    console.error('addCarSummaryData error:', err);
  }

  return result;
}

// ----------------- CAR MANAGEMENT API -----------------

// Cars CRUD
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.findAll();
    const enriched = await Promise.all(cars.map(addCarSummaryData));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    const enriched = await addCarSummaryData(car);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars', async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/cars/:id', async (req, res) => {
  try {
    const [updated] = await Car.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Car not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/cars/:id', async (req, res) => {
  try {
    const deleted = await Car.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Car not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MOTs for a Car
router.get('/cars/:carId/mots', async (req, res) => {
  try {
    const mots = await Mot.findAll({ where: { CarId: req.params.carId } });
    res.json(mots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars/:carId/mots', async (req, res) => {
  try {
    const mot = await Mot.create({ ...req.body, CarId: req.params.carId });
    res.status(201).json(mot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/mots/:id', async (req, res) => {
  try {
    const [updated] = await Mot.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'MOT record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/mots/:id', async (req, res) => {
  try {
    const deleted = await Mot.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'MOT record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insurances for a Car
router.get('/cars/:carId/insurances', async (req, res) => {
  try {
    const insurances = await Insurance.findAll({ where: { CarId: req.params.carId } });
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars/:carId/insurances', async (req, res) => {
  try {
    const insurance = await Insurance.create({ ...req.body, CarId: req.params.carId });
    res.status(201).json(insurance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/insurances/:id', async (req, res) => {
  try {
    const [updated] = await Insurance.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Insurance record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/insurances/:id', async (req, res) => {
  try {
    const deleted = await Insurance.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Insurance record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ServiceRecords for a Car
router.get('/cars/:carId/service-records', async (req, res) => {
  try {
    const records = await ServiceRecord.findAll({ where: { CarId: req.params.carId } });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars/:carId/service-records', async (req, res) => {
  try {
    const record = await ServiceRecord.create({ ...req.body, CarId: req.params.carId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/service-records/:id', async (req, res) => {
  try {
    const [updated] = await ServiceRecord.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Service record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/service-records/:id', async (req, res) => {
  try {
    const deleted = await ServiceRecord.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Service record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CarTax for a Car
router.get('/cars/:carId/car-taxes', async (req, res) => {
  try {
    const taxes = await CarTax.findAll({ where: { CarId: req.params.carId } });
    res.json(taxes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars/:carId/car-taxes', async (req, res) => {
  try {
    const tax = await CarTax.create({ ...req.body, CarId: req.params.carId });
    res.status(201).json(tax);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/car-taxes/:id', async (req, res) => {
  try {
    const [updated] = await CarTax.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'CarTax record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/car-taxes/:id', async (req, res) => {
  try {
    const deleted = await CarTax.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'CarTax record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MileageRecords for a Car
router.get('/cars/:carId/mileage-records', async (req, res) => {
  try {
    const records = await MileageRecord.findAll({ where: { CarId: req.params.carId } });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cars/:carId/mileage-records', async (req, res) => {
  try {
    const record = await MileageRecord.create({ ...req.body, CarId: req.params.carId });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/mileage-records/:id', async (req, res) => {
  try {
    const [updated] = await MileageRecord.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Mileage record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/mileage-records/:id', async (req, res) => {
  try {
    const deleted = await MileageRecord.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Mileage record not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------- GENERIC CRUD for other models ---------
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

// Register generic CRUD routes
crud('categories',   Category,    [Subcategory]);
crud('subcategories',Subcategory, [Category]);
crud('vendors',      Vendor);
crud('services',     Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('contracts',    Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);

// ----- Budget Months -----
router.get('/budget-months', async (req, res) => {
  try {
    const months = await BudgetMonth.findAll({
      order: [['month', 'ASC']],
      include: [
        { model: BudgetEntry, include: [BudgetLine] },
        IncomeSource,
        { model: SavingsEntry, include: [SavingsPot] },
      ],
    });
    res.json(months);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/budget-months', async (req, res) => {
  try {
    const last = await BudgetMonth.findOne({ order: [['month', 'DESC']] });
    let nextDate;
    if (last) {
      // Parse last.month in UTC to avoid timezone issues
      const [y, m] = last.month.split('-').map(Number);
      nextDate = new Date(Date.UTC(y, m - 1, 1));
      nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
    } else {
      nextDate = new Date();
    }
    const monthStr = nextDate.toISOString().slice(0,7);
    const month = await BudgetMonth.create({ month: monthStr });

    if (last) {
      const lines = await BudgetLine.findAll({ where: { is_retired: false, type: { [Op.ne]: 'ANNUAL' } } });
      for (const line of lines) {
        const prev = await BudgetEntry.findOne({ where: { BudgetMonthId: last.id, BudgetLineId: line.id } });
        await BudgetEntry.create({
          BudgetMonthId: month.id,
          BudgetLineId: line.id,
          planned_amount: prev ? prev.planned_amount : 0,
        });
      }
    }

    const created = await BudgetMonth.findByPk(month.id, {
      include: [
        { model: BudgetEntry, include: [BudgetLine] },
        IncomeSource,
        { model: SavingsEntry, include: [SavingsPot] },
      ],
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

crud('budget-lines', BudgetLine);
crud('budget-entries', BudgetEntry);
crud('income-sources', IncomeSource);
crud('savings-pots', SavingsPot);
crud('savings-entries', SavingsEntry);

module.exports = router;
