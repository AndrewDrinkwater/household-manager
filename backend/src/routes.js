const express = require('express');
const router = express.Router();

const Category    = require('./models/Category.js');
const Subcategory = require('./models/Subcategory.js');
const Vendor      = require('./models/vendor.js');
const Frequency   = require('./models/Frequency.js');
const Service     = require('./models/Service.js');
const User        = require('./models/user.js');

function crud(path, Model, include = []) {
  router.get(`/${path}`, async (req, res) => {
    try {
      const results = await Model.findAll({ include });
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post(`/${path}`, async (req, res) => {
    try {
      const instance = await Model.create(req.body);
      res.status(201).json(instance);
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        res.status(400).json({ errors: err.errors.map(e => e.message) });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const [updated] = await Model.update(req.body, { where: { id: req.params.id } });
      if (updated) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        res.status(400).json({ errors: err.errors.map(e => e.message) });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.destroy({ where: { id: req.params.id } });
      if (deleted) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

// Wire up routes
crud('categories',   Category,    [Subcategory]);
crud('subcategories',Subcategory, [Category]);
crud('vendors',      Vendor);
crud('frequencies',  Frequency);
crud('services',     Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
// Legacy alias for backward compatibility
crud('contracts',    Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('users',        User);

module.exports = router;
