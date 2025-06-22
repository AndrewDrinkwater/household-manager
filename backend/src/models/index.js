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
const HousePlan = require('./HousePlan');
const HousePlanLineItem = require('./HousePlanLineItem');
const HousePlanQuote = require('./HousePlanQuote');
const HousePlanInvoice = require('./HousePlanInvoice');
const HousePlanTask = require('./HousePlanTask');

// Associations:
Service.hasMany(Attachment, { foreignKey: 'ServiceId', onDelete: 'CASCADE' });
Attachment.belongsTo(Service, { foreignKey: 'ServiceId' });

Vendor.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Vendor,  { foreignKey: { allowNull: false } });

Subcategory.hasMany(Service,    { onDelete: 'CASCADE' });
Service.belongsTo(Subcategory,  { foreignKey: { allowNull: false } });

Frequency.hasMany(Service,    { onDelete: 'RESTRICT' });
// Frequency is optional so allow null
Service.belongsTo(Frequency,  { foreignKey: { allowNull: true } });

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

// House Plan associations
HousePlan.hasMany(HousePlanLineItem, { foreignKey: 'HousePlanId', onDelete: 'CASCADE' });
HousePlanLineItem.belongsTo(HousePlan, { foreignKey: 'HousePlanId' });
HousePlanLineItem.hasMany(HousePlanQuote, { foreignKey: 'HousePlanLineItemId', onDelete: 'CASCADE' });
HousePlanQuote.belongsTo(HousePlanLineItem, { foreignKey: 'HousePlanLineItemId' });
HousePlanLineItem.hasMany(HousePlanInvoice, { foreignKey: 'HousePlanLineItemId', onDelete: 'CASCADE' });
HousePlanInvoice.belongsTo(HousePlanLineItem, { foreignKey: 'HousePlanLineItemId' });
HousePlanLineItem.hasMany(HousePlanTask, { foreignKey: 'HousePlanLineItemId', onDelete: 'CASCADE' });
HousePlanTask.belongsTo(HousePlanLineItem, { foreignKey: 'HousePlanLineItemId' });
HousePlanTask.belongsTo(User, { as: 'assignedUser', foreignKey: 'assignedTo' });
User.hasMany(HousePlanTask, { foreignKey: 'assignedTo' });

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
  HousePlan,
  HousePlanLineItem,
  HousePlanQuote,
  HousePlanInvoice,
  HousePlanTask,
};
