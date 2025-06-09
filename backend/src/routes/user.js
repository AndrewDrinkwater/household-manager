const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Create User (simple, not secure for production)
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Users (do NOT do this in production)
router.get('/', async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
  res.json(users);
});

// Get User by ID
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password_hash'] } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update User (not for passwords here)
router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  await user.update(req.body);
  res.json(user);
});

// Delete User
router.delete('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  await user.destroy();
  res.status(204).end();
});

module.exports = router;
