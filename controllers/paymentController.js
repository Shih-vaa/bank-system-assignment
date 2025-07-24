// controllers/paymentController.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.makePayment = (req, res) => {
  const loan_id = req.params.loan_id;
  const { amount, payment_type } = req.body;

  if (!amount || !payment_type) {
    return res.status(400).json({ error: 'Missing amount or payment_type' });
  }

  db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, loan) => {
    if (err || !loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Fetch total paid so far
    db.get(
      'SELECT SUM(amount) as total_paid FROM payments WHERE loan_id = ?',
      [loan_id],
      (err, result) => {
        const paid = result?.total_paid || 0;
        const new_paid = paid + amount;
        const balance = loan.total_amount - new_paid;

        // Record the payment
        const payment_id = uuidv4();
        db.run(
          'INSERT INTO payments (payment_id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)',
          [payment_id, loan_id, amount, payment_type],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to record payment' });
            }

            // Calculate EMIs left
            const emis_left = Math.ceil(balance / loan.monthly_emi);

            res.status(200).json({
              payment_id,
              loan_id,
              message: 'Payment recorded successfully.',
              remaining_balance: balance.toFixed(2),
              emis_left: balance <= 0 ? 0 : emis_left,
            });
          }
        );
      }
    );
  });
};
