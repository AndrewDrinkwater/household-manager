const { app, sequelize } = require('../src/app');
const { Activity, Location, ActivityLocation } = require('../src/models');
let server;
let baseUrl;

beforeAll(async () => {
  process.env.DB_STORAGE = ':memory:';
  await sequelize.sync({ force: true });
  server = app.listen(0);
  await new Promise(resolve => server.on('listening', resolve));
  baseUrl = `http://localhost:${server.address().port}/api`;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test('filter endpoint returns activity-location combos', async () => {
  const act = await Activity.create({
    name: 'Swimming',
    defaultPriceLevel: 2,
    defaultIndoorOutdoor: 'indoor',
    defaultEducationalValue: 'medium',
    isHomeBased: false,
    physicalDemand: 'medium'
  });
  const loc = await Location.create({ name: 'Pool', milesFromHome: 5, tags: JSON.stringify(['family']) });
  await ActivityLocation.create({ ActivityId: act.id, LocationId: loc.id, isActive: true });

  const res = await fetch(`${baseUrl}/activities/filter?distanceMax=10`);
  const data = await res.json();
  expect(res.status).toBe(200);
  expect(data.length).toBe(1);
  expect(data[0].activityName).toBe('Swimming');
});

test('patch last chosen date', async () => {
  const act = await Activity.create({
    name: 'Painting',
    defaultPriceLevel: 1,
    defaultIndoorOutdoor: 'indoor',
    defaultEducationalValue: 'high',
    isHomeBased: true,
    physicalDemand: 'low'
  });
  const res = await fetch(`${baseUrl}/activities/${act.id}/last-chosen`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lastChosenDate: '2025-01-01' })
  });
  expect(res.status).toBe(200);
  const updated = await Activity.findByPk(act.id);
  expect(updated.lastChosenDate).toBe('2025-01-01T00:00:00.000Z');
});
