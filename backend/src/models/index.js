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
const BacklogItem  = require('./BacklogItem');
const BacklogNote  = require('./BacklogNote');
const BudgetMonth  = require('./BudgetMonth');
const BudgetLine   = require('./BudgetLine');
const BudgetEntry  = require('./BudgetEntry');
const IncomeSource = require('./IncomeSource');
const SavingsPot   = require('./SavingsPot');
const SavingsEntry = require('./SavingsEntry');

// Associations:
Service.hasMany(Attachment, { foreignKey: 'ServiceId', onDelete: 'CASCADE' });
Attachment.belongsTo(Service, { foreignKey: 'ServiceId' });

Vendor.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Vendor,  { foreignKey: { allowNull: false } });

Subcategory.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Subcategory,  { foreignKey: { allowNull: false } });

Frequency.hasMany(Service,    { onDelete: 'RESTRICT' });
Service.belongsTo(Frequency,  { foreignKey: { allowNull: false } });

BacklogItem.hasMany(Attachment, { foreignKey: 'BacklogItemId', onDelete: 'CASCADE' });
Attachment.belongsTo(BacklogItem, { foreignKey: 'BacklogItemId' });
BacklogItem.hasMany(BacklogNote, { foreignKey: 'BacklogItemId', onDelete: 'CASCADE' });
BacklogNote.belongsTo(BacklogItem, { foreignKey: 'BacklogItemId' });

// Budget associations
BudgetMonth.hasMany(BudgetEntry, { foreignKey: 'BudgetMonthId', onDelete: 'CASCADE' });
BudgetEntry.belongsTo(BudgetMonth, { foreignKey: 'BudgetMonthId' });
BudgetLine.hasMany(BudgetEntry, { foreignKey: 'BudgetLineId', onDelete: 'CASCADE' });
BudgetEntry.belongsTo(BudgetLine, { foreignKey: 'BudgetLineId' });
BudgetMonth.hasMany(IncomeSource, { foreignKey: 'BudgetMonthId', onDelete: 'CASCADE' });
IncomeSource.belongsTo(BudgetMonth, { foreignKey: 'BudgetMonthId' });
SavingsPot.hasMany(SavingsEntry, { foreignKey: 'SavingsPotId', onDelete: 'CASCADE' });
SavingsEntry.belongsTo(SavingsPot, { foreignKey: 'SavingsPotId' });
BudgetMonth.hasMany(SavingsEntry, { foreignKey: 'BudgetMonthId', onDelete: 'CASCADE' });
SavingsEntry.belongsTo(BudgetMonth, { foreignKey: 'BudgetMonthId' });

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
  BacklogItem,
  BacklogNote,
  BudgetMonth,
  BudgetLine,
  BudgetEntry,
  IncomeSource,
  SavingsPot,
  SavingsEntry,
};
