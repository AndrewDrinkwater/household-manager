const express = require('express');
const router = express.Router();
const Vendor = require('../models/vendor');

// Create Vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Vendors
router.get('/', async (req, res) => {
  const vendors = await Vendor.findAll();
  res.json(vendors);
});

// Get Vendor by ID
router.get('/:id', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Not found' });
  res.json(vendor);
});

// Update Vendor
router.put('/:id', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Not found' });
  await vendor.update(req.body);
  res.json(vendor);
});

// Delete Vendor
router.delete('/:id', async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Not found' });
  await vendor.destroy();
  res.status(204).end();
});

module.exports = router;
