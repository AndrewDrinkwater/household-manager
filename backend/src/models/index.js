const Service = require('./Service');
const Attachment = require('./Attachment');
const Vendor = require('./vendor');
const Subcategory = require('./Subcategory');
const Frequency = require('./Frequency');
const User = require('./user');
const Car          = require('./Car');
const Mot          = require('./Mot');
const Insurance    = require('./Insurance');
const ServiceRecord= require('./ServiceRecord');
const CarTax       = require('./CarTax');
const MileageRecord= require('./MileageRecord');

// Associations:
Service.hasMany(Attachment, { foreignKey: 'ServiceId', onDelete: 'CASCADE' });
Attachment.belongsTo(Service, { foreignKey: 'ServiceId' });

Vendor.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Vendor,  { foreignKey: { allowNull: false } });

Subcategory.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Subcategory,  { foreignKey: { allowNull: false } });

Frequency.hasMany(Service,    { onDelete: 'RESTRICT' });
Service.belongsTo(Frequency,  { foreignKey: { allowNull: false } });

module.exports = {
  Service,
  Attachment,
  Vendor,
  Subcategory,
  Frequency,
  User,
  Car,
  Mot,
  Insurance,
  ServiceRecord,
  CarTax,
  MileageRecord,
};
