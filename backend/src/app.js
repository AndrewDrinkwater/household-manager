const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/vendors', require('./routes/vendor'));
app.use('/api/users', require('./routes/user'));
app.use('/api/contracts', require('./routes/contract'));

app.get('/', (req, res) => res.send('API running'));

module.exports = app;

