const Service = require('./Service');
const Attachment = require('./Attachment');
const Vendor = require('./vendor');
const Subcategory = require('./Subcategory');
const Frequency = require('./Frequency');
const User = require('./user');  // <--- ADD THIS LINE

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
  User,    // <--- EXPORT USER HERE
};
