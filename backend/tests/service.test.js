const sequelize = require('../src/db');
const Service = require('../src/models/Service');

beforeAll(() => sequelize.sync({ force: true }));
afterAll(() => sequelize.close());

test('creates a Service record', async () => {
  const svc = await Service.create({ name: 'Test Service' });
  expect(svc.id).toBeDefined();
});
