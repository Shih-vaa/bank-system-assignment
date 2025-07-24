// controllers/loanController.js
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

exports.createLoan = (req, res) => {
  const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

  if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const P = loan_amount;
  const N = loan_period_years;
  const R = interest_rate_yearly;

  const I = P * N * (R / 100);
  const A = P + I;
  const EMI = A / (N * 12);

  const loan_id = uuidv4();
  const status = 'ACTIVE';

  const query = `
    INSERT INTO loans (
      loan_id, customer_id, principal_amount, interest_rate, loan_period_years,
      total_amount, monthly_emi, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [loan_id, customer_id, P, R, N, A, EMI, status],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Failed to create loan' });
      }

      return res.status(201).json({
        loan_id,
        customer_id,
        total_amount_payable: A,
        monthly_emi: EMI.toFixed(2),
      });
    }
  );
};

exports.getLedger = (req, res) => {
  const loan_id = req.params.loan_id;

  db.get('SELECT * FROM loans WHERE loan_id = ?', [loan_id], (err, loan) => {
    if (err || !loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    db.all(
      'SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date ASC',
      [loan_id],
      (err, transactions) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch payments' });
        }

        const amount_paid = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const balance_amount = loan.total_amount - amount_paid;
        const emis_left = balance_amount <= 0 ? 0 : Math.ceil(balance_amount / loan.monthly_emi);

        res.status(200).json({
          loan_id: loan.loan_id,
          customer_id: loan.customer_id,
          principal: loan.principal_amount,
          total_amount: loan.total_amount,
          monthly_emi: loan.monthly_emi,
          amount_paid: amount_paid.toFixed(2),
          balance_amount: balance_amount.toFixed(2),
          emis_left,
          transactions: transactions.map((tx) => ({
            transaction_id: tx.payment_id,
            date: tx.payment_date,
            amount: tx.amount,
            type: tx.payment_type
          }))
        });
      }
    );
  });
};

exports.getAccountOverview = (req, res) => {
  const customer_id = req.params.customer_id;

  db.all(
    'SELECT * FROM loans WHERE customer_id = ?',
    [customer_id],
    (err, loans) => {
      if (err || !loans || loans.length === 0) {
        return res.status(404).json({ error: 'No loans found for this customer' });
      }

      const loanSummaries = [];

      let loansProcessed = 0;

      loans.forEach((loan) => {
        db.get(
          'SELECT SUM(amount) AS total_paid FROM payments WHERE loan_id = ?',
          [loan.loan_id],
          (err, result) => {
            const total_paid = result?.total_paid || 0;
            const interest = loan.total_amount - loan.principal_amount;
            const emis_left = Math.ceil((loan.total_amount - total_paid) / loan.monthly_emi);

            loanSummaries.push({
              loan_id: loan.loan_id,
              principal: loan.principal_amount,
              total_amount: loan.total_amount,
              total_interest: interest.toFixed(2),
              emi_amount: loan.monthly_emi,
              amount_paid: total_paid.toFixed(2),
              emis_left: Math.max(0, emis_left),
            });

            loansProcessed++;

            if (loansProcessed === loans.length) {
              res.json({
                customer_id,
                total_loans: loans.length,
                loans: loanSummaries,
              });
            }
          }
        );
      });
    }
  );
};
