const { app, sequelize } = require('../src/app');
let server;
let baseUrl;

beforeAll(async () => {
  process.env.DB_STORAGE = ':memory:';
  await sequelize.sync({ force: true });
  server = app.listen(0);
  await new Promise(resolve => server.on('listening', resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
});

afterAll(async () => {
  await sequelize.close();
  server.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test('register and login user', async () => {
  let res = await fetch(baseUrl + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'bob', email: 'bob@e.com', password: 'secret' })
  });
  expect(res.status).toBe(201);

  res = await fetch(baseUrl + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'bob', password: 'secret' })
  });
  expect(res.status).toBe(200);
  const data = await res.json();
  expect(data.token).toBeDefined();
});

test('create and list cars', async () => {
  let res = await fetch(baseUrl + '/cars');
  expect(res.status).toBe(200);
  let list = await res.json();
  expect(Array.isArray(list)).toBe(true);
  expect(list.length).toBe(0);

  res = await fetch(baseUrl + '/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ make: 'Ford', model: 'Focus', year: 2020 })
  });
  expect(res.status).toBe(201);

  res = await fetch(baseUrl + '/cars');
  list = await res.json();
  expect(list.length).toBe(1);
  expect(list[0].make).toBe('Ford');
});

test('house plan endpoints require admin', async () => {
  let res = await fetch(baseUrl + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', email: 'a@a.com', password: 'pw', role: 'admin' })
  });
  expect(res.status).toBe(201);

  res = await fetch(baseUrl + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'pw' })
  });
  const adminToken = (await res.json()).token;

  res = await fetch(baseUrl + '/house-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + adminToken },
    body: JSON.stringify({ title: 'Renovation', status: 'planned', budget: 1000 })
  });
  expect(res.status).toBe(201);

  await fetch(baseUrl + '/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user', email: 'u@u.com', password: 'pw' })
  });
  res = await fetch(baseUrl + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user', password: 'pw' })
  });
  const userToken = (await res.json()).token;

  res = await fetch(baseUrl + '/house-plans', {
    headers: { Authorization: 'Bearer ' + userToken }
  });
  expect(res.status).toBe(403);
});
