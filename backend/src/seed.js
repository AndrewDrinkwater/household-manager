const sequelize  = require('./db');
const Category   = require('./models/Category');
const Subcategory= require('./models/Subcategory');
const Vendor     = require('./models/vendor');
const Frequency  = require('./models/Frequency');

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
  console.info('✅ Seed complete');
  process.exit();
}

seed();
