// routes/loans.js
const express = require('express');
const router = express.Router();
const { createLoan, getLedger, getAccountOverview } = require('../controllers/loanController');

router.post('/', createLoan);
router.get('/:loan_id/ledger', getLedger);
router.get('/customer/:customer_id/overview', getAccountOverview); // ✅ move this up

module.exports = router;
