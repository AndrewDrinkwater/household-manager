// backend/src/routes.js
const express    = require('express');
const router     = express.Router();

const Category    = require('./models/Category.js');
const Subcategory = require('./models/Subcategory.js');
const Vendor      = require('./models/vendor.js');
const Frequency   = require('./models/Frequency.js');
const Service     = require('./models/Service.js');
const User        = require('./models/user.js');

/** --- FREQUENCIES (explicit handlers) --- **/

// GET /api/frequencies
router.get('/frequencies', async (req, res) => {
  console.log('GET /frequencies');
  try {
    const freqs = await Frequency.findAll();
    res.json(freqs);
  } catch (err) {
    console.error('GET /frequencies error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/frequencies
router.post('/frequencies', async (req, res) => {
  console.log('POST /frequencies body:', req.body);
  const { name, interval_months } = req.body;
  if (!name || interval_months == null) {
    console.log('POST /frequencies missing fields');
    return res.status(400).json({ error: '`name` and `interval_months` are required.' });
  }
  try {
    const freq = await Frequency.create({ name, interval_months });
    console.log('Created frequency:', freq.toJSON());
    res.status(201).json(freq);
  } catch (err) {
    console.error('POST /frequencies error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/frequencies/:id
router.put('/frequencies/:id', async (req, res) => {
  console.log(`PUT /frequencies/${req.params.id} body:`, req.body);
  const { name, interval_months } = req.body;
  if (!name || interval_months == null) {
    return res.status(400).json({ error: '`name` and `interval_months` are required.' });
  }
  try {
    const [updated] = await Frequency.update(
      { name, interval_months },
      { where: { id: req.params.id } }
    );
    if (!updated) {
      console.log(`Frequency ${req.params.id} not found`);
      return res.status(404).json({ error: 'Frequency not found' });
    }
    console.log(`Frequency ${req.params.id} updated`);
    res.sendStatus(204);
  } catch (err) {
    console.error('PUT /frequencies error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ errors: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/frequencies/:id
router.delete('/frequencies/:id', async (req, res) => {
  console.log(`DELETE /frequencies/${req.params.id}`);
  try {
    const deleted = await Frequency.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      console.log(`Frequency ${req.params.id} not found`);
      return res.status(404).json({ error: 'Frequency not found' });
    }
    console.log(`Frequency ${req.params.id} deleted`);
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /frequencies error:', err);
    res.status(500).json({ error: err.message });
  }
});

/** --- GENERIC CRUD for other models --- **/
function crud(path, Model, include = []) {
  // LIST
  router.get(`/${path}`, async (req, res) => {
    try {
      const items = await Model.findAll({ include });
      res.json(items);
    } catch (err) {
      console.error(`GET /${path} error:`, err);
      res.status(500).json({ error: err.message });
    }
  });
  // CREATE
  router.post(`/${path}`, async (req, res) => {
    try {
      const inst = await Model.create(req.body);
      res.status(201).json(inst);
    } catch (err) {
      console.error(`POST /${path} error:`, err);
      res.status(400).json({ error: err.message });
    }
  });
  // UPDATE
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const [updated] = await Model.update(req.body, { where: { id: req.params.id } });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.sendStatus(204);
    } catch (err) {
      console.error(`PUT /${path}/:id error:`, err);
      res.status(400).json({ error: err.message });
    }
  });
  // DELETE
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.destroy({ where: { id: req.params.id } });
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.sendStatus(204);
    } catch (err) {
      console.error(`DELETE /${path}/:id error:`, err);
      res.status(500).json({ error: err.message });
    }
  });
}

// Register generic CRUD
crud('categories',   Category,    [Subcategory]);
crud('subcategories',Subcategory, [Category]);
crud('vendors',      Vendor);
crud('services',     Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('contracts',    Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]); // alias
crud('users',        User);

module.exports = router;
