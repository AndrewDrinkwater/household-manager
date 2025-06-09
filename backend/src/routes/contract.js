const express = require('express');
const router = express.Router();
const Contract = require('../models/contract');
const Vendor = require('../models/vendor');
const User = require('../models/user');

// Create Contract
router.post('/', async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Contracts (with Vendor and User info)
router.get('/', async (req, res) => {
  const contracts = await Contract.findAll({
    include: [Vendor, User]
  });
  res.json(contracts);
});

// Get Contract by ID
router.get('/:id', async (req, res) => {
  const contract = await Contract.findByPk(req.params.id, {
    include: [Vendor, User]
  });
  if (!contract) return res.status(404).json({ error: 'Not found' });
  res.json(contract);
});

// Update Contract
router.put('/:id', async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Not found' });
  await contract.update(req.body);
  res.json(contract);
});

// Delete Contract
router.delete('/:id', async (req, res) => {
  const contract = await Contract.findByPk(req.params.id);
  if (!contract) return res.status(404).json({ error: 'Not found' });
  await contract.destroy();
  res.status(204).end();
});

module.exports = router;
