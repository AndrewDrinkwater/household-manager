const sequelize  = require('./db');
const Category   = require('./models/Category');
const Subcategory= require('./models/Subcategory');
const Vendor     = require('./models/vendor');
const Frequency  = require('./models/Frequency');
const Activity = require('./models/Activity');
const Location = require('./models/Location');
const ActivityLocation = require('./models/ActivityLocation');

async function seed() {
  await sequelize.sync();
  // Categories & subcats
  const data = { Utility:['Gas','Water'], Streaming:['TV','Music'] };
  for (let [cat,subs] of Object.entries(data)) {
    const [c] = await Category.findOrCreate({ where:{name:cat} });
    for (let s of subs) await Subcategory.findOrCreate({ where:{ name:s, CategoryId:c.id } });
  }
  // Frequencies
  for (let [n,i] of [['Monthly',1],['Yearly',12]]) {
    await Frequency.findOrCreate({ where:{ name:n, interval_months:i } });
  }
  // Example vendor
  await Vendor.findOrCreate({ where:{ name:'Netflix' } });

  // Activities and locations example
  const [swimming] = await Activity.findOrCreate({
    where: { name: 'Swimming' },
    defaults: {
      description: 'Go for a swim',
      defaultPriceLevel: 2,
      defaultIndoorOutdoor: 'indoor',
      defaultEducationalValue: 'medium',
      isHomeBased: false,
      physicalDemand: 'medium',
    }
  });

  const [leisure] = await Location.findOrCreate({
    where: { name: 'Knutsford Leisure Centre' },
    defaults: {
      address: 'Knutsford',
      milesFromHome: 3.2,
      tags: JSON.stringify(['near Knutsford']),
      websiteUrl: 'https://example.com',
      isClosed: false,
    }
  });

  await ActivityLocation.findOrCreate({
    where: { ActivityId: swimming.id, LocationId: leisure.id },
    defaults: { isActive: true }
  });

  console.log('✅ Seed complete');
  process.exit();
}

seed();
