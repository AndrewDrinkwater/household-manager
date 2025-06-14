const express = require('express');
const router = express.Router();

const Car = require('../models/Car');
const Mot = require('../models/Mot');
const Insurance = require('../models/Insurance');
const ServiceRecord = require('../models/ServiceRecord');
const CarTax = require('../models/CarTax');
const MileageRecord = require('../models/MileageRecord');
const Vendor = require('../models/vendor');

// Fetch all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch single car simple (basic details)
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enriched car details endpoint
router.get('/:id/full', async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });

    // Fetch latest related records
    const latestTax = await CarTax.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] });
    const latestInsurance = await Insurance.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] });
    const latestService = await ServiceRecord.findOne({ where: { CarId: carId }, order: [['serviceDate', 'DESC']] });
    const latestMileage = await MileageRecord.findOne({ where: { CarId: carId }, order: [['recordDate', 'DESC']] });

    // Compute next due dates and values
    const nextTaxDueDate = latestTax ? new Date(new Date(latestTax.expiryDate).setFullYear(new Date(latestTax.expiryDate).getFullYear() + 1)) : null;
    const insuranceRenewalDate = latestInsurance ? new Date(new Date(latestInsurance.expiryDate).setFullYear(new Date(latestInsurance.expiryDate).getFullYear() + 1)) : null;
    let insuranceProviderName = null;
    if (latestInsurance && latestInsurance.provider) {
      const vendor = await Vendor.findByPk(latestInsurance.provider);
      insuranceProviderName = vendor ? vendor.name : null;
    }
    const serviceDueDate = latestService ? new Date(new Date(latestService.serviceDate).setFullYear(new Date(latestService.serviceDate).getFullYear() + 1)) : null;
    const serviceType = latestService ? (latestService.serviceType === 'Full' ? 'Partial' : 'Full') : null;
    const lastMileage = latestMileage ? latestMileage.mileage : null;

    // Add computed fields to car response
    const carData = car.toJSON();
    carData.nextTaxDueDate = nextTaxDueDate;
    carData.insuranceRenewalDate = insuranceRenewalDate;
    carData.insuranceProviderName = insuranceProviderName;
    carData.serviceDueDate = serviceDueDate;
    carData.serviceType = serviceType;
    carData.lastMileage = lastMileage;

    res.json(carData);
  } catch (err) {
    console.error('Error fetching full car details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create car
router.post('/', async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update car
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Car.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Car not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete car
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Car.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Car not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MOTs for a car
router.get('/:carId/mots', async (req, res) => {
  try {
    const mots = await Mot.findAll({ where: { CarId: req.params.carId } });
    res.json(mots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:carId/mots', async (req, res) => {
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

// Insurances for a car
router.get('/:carId/insurances', async (req, res) => {
  try {
    const insurances = await Insurance.findAll({ where: { CarId: req.params.carId } });
    res.json(insurances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:carId/insurances', async (req, res) => {
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

// Service records for a car
router.get('/:carId/service-records', async (req, res) => {
  try {
    const records = await ServiceRecord.findAll({ where: { CarId: req.params.carId } });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:carId/service-records', async (req, res) => {
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

// Car taxes for a car
router.get('/:carId/car-taxes', async (req, res) => {
  try {
    const taxes = await CarTax.findAll({ where: { CarId: req.params.carId } });
    res.json(taxes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:carId/car-taxes', async (req, res) => {
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

// Mileage records for a car
router.get('/:carId/mileage-records', async (req, res) => {
  try {
    const records = await MileageRecord.findAll({ where: { CarId: req.params.carId } });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:carId/mileage-records', async (req, res) => {
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

module.exports = router;
