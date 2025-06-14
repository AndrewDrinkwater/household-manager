// Script to add summary columns to Cars table and populate them
const Sequelize = require('sequelize');
const sequelize = require('./src/db');
const {
  Car,
  CarTax,
  Insurance,
  Mot,
  ServiceRecord,
  MileageRecord,
  Vendor,
} = require('./src/models');

const qi = sequelize.getQueryInterface();

async function ensureColumns() {
  const table = await qi.describeTable('Cars');
  const ops = [];
  if (!table.nextTaxDue) ops.push(qi.addColumn('Cars', 'nextTaxDue', { type: Sequelize.DATE }));
  if (!table.nextInsuranceDue) ops.push(qi.addColumn('Cars', 'nextInsuranceDue', { type: Sequelize.DATE }));
  if (!table.insuranceProviderName) ops.push(qi.addColumn('Cars', 'insuranceProviderName', { type: Sequelize.STRING }));
  if (!table.nextMotDue) ops.push(qi.addColumn('Cars', 'nextMotDue', { type: Sequelize.DATE }));
  if (!table.nextServiceDue) ops.push(qi.addColumn('Cars', 'nextServiceDue', { type: Sequelize.DATE }));
  if (!table.serviceType) ops.push(qi.addColumn('Cars', 'serviceType', { type: Sequelize.STRING }));
  if (!table.lastMileage) ops.push(qi.addColumn('Cars', 'lastMileage', { type: Sequelize.INTEGER }));
  await Promise.all(ops);
}

function addOneYear(date) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

async function computeSummary(carId) {
  const [tax, insurance, mot, service, mileage] = await Promise.all([
    CarTax.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] }),
    Insurance.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']], include: [Vendor] }),
    Mot.findOne({ where: { CarId: carId }, order: [['expiryDate', 'DESC']] }),
    ServiceRecord.findOne({ where: { CarId: carId }, order: [['serviceDate', 'DESC']] }),
    MileageRecord.findOne({ where: { CarId: carId }, order: [['recordDate', 'DESC']] }),
  ]);
  return {
    nextTaxDue: tax ? tax.expiryDate : null,
    nextInsuranceDue: insurance ? addOneYear(insurance.expiryDate) : null,
    insuranceProviderName: insurance && insurance.Vendor ? insurance.Vendor.name : null,
    nextMotDue: mot ? mot.expiryDate : null,
    nextServiceDue: service ? addOneYear(service.serviceDate) : null,
    serviceType: service ? service.serviceType : null,
    lastMileage: mileage ? mileage.mileage : null,
  };
}

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureColumns();
    const cars = await Car.findAll();
    for (const car of cars) {
      const summary = await computeSummary(car.id);
      await car.update(summary);
      console.log(`Updated car ${car.id}`);
    }
    console.log('Finished updating cars');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
