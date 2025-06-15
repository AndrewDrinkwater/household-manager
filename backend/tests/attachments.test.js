const express = require('express');
const fs = require('fs');
const path = require('path');
let sqliteAvailable = true;
try {
  require('sqlite3');
} catch (err) {
  sqliteAvailable = false;
}

let sequelize, routes, Service, Vendor, Category, Subcategory;
if (sqliteAvailable) {
  sequelize = require('../src/db');
  routes = require('../src/routes');
  ({ Service, Vendor, Category, Subcategory } = require('../src/models'));
}

let server;
let port;
let service;

beforeAll(async () => {
  if (!sqliteAvailable) return;
  await sequelize.sync({ force: true });

  const category = await Category.create({ name: 'TestCat' });
  const sub = await Subcategory.create({ name: 'TestSub', CategoryId: category.id });
  const vendor = await Vendor.create({ name: 'TestVendor' });
  service = await Service.create({ name: 'TestService', VendorId: vendor.id, SubcategoryId: sub.id });

  const app = express();
  app.use(express.json());
  app.use('/api', routes);

  server = app.listen(0);
  port = server.address().port;
});

afterAll(async () => {
  if (!sqliteAvailable) return;
  if (server) server.close();
  await sequelize.close();
  const uploadDir = path.join(__dirname, '../uploads');
  if (fs.existsSync(uploadDir)) {
    fs.rmSync(uploadDir, { recursive: true, force: true });
  }
});

const maybeTest = sqliteAvailable ? test : test.skip;

maybeTest('upload and retrieve service attachment', async () => {
  const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`http://localhost:${port}/api/services/${service.id}/attachments`, {
    method: 'POST',
    body: form,
  });
  expect(res.status).toBe(201);
  const created = await res.json();
  expect(created.ServiceId).toBe(service.id);

  const listRes = await fetch(`http://localhost:${port}/api/services/${service.id}/attachments`);
  expect(listRes.status).toBe(200);
  const list = await listRes.json();
  expect(list.length).toBe(1);
  expect(list[0].id).toBe(created.id);

  const downloadRes = await fetch(`http://localhost:${port}/api/attachments/download/${created.id}`);
  expect(downloadRes.status).toBe(200);
  const text = await downloadRes.text();
  expect(text).toBe('hello');
});
