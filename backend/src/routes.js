const express = require('express');
const Category    = require('./models/Category.js');
const Subcategory = require('./models/Subcategory.js');
const Vendor      = require('./models/vendor.js');
const Frequency   = require('./models/Frequency.js');
const Service     = require('./models/Service.js');
const User = require('./models/user');


const router = express.Router();

function crud(path, Model, include = []) {
  router.get(`/${path}`,    async (req, res) => res.json(await Model.findAll({ include })));
  router.post(`/${path}`,   async (req, res) => res.status(201).json(await Model.create(req.body)));
  router.put(`/${path}/:id`,async (req, res) => { await Model.update(req.body, { where: { id: req.params.id } }); res.sendStatus(204); });
  router.delete(`/${path}/:id`, async (req, res) => { await Model.destroy({ where: { id: req.params.id } }); res.sendStatus(204); });
}

// wire up
crud('categories',   Category,    [Subcategory]);
crud('subcategories',Subcategory, [Category]);
crud('vendors',      Vendor);
crud('frequencies',  Frequency);
crud('services',     Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
// legacy alias
crud('contracts',    Service,     [Vendor, { model: Subcategory, include: Category }, Frequency]);
crud('users', User);

module.exports = router;
