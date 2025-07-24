// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loanRoutes = require('./routes/loans');
const paymentRoutes = require('./routes/payments');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
