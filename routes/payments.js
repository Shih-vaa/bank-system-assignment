//payments.js
const express=require('express');
const router= express.Router();
const {makePayment} = require('../controllers/paymentController');

router.post('/:loan_id', makePayment);

module.exports=router;