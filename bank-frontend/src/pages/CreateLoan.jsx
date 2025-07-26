import React, { useState } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function CreateLoan() {
  const [form, setForm] = useState({
    customer_id: '',
    loan_amount: '',
    loan_period_years: '',
    interest_rate_yearly: ''
  });

  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await api.post('/loans', form);
      setResult(res.data);
      toast.success('Loan created successfully', {
        position: "top-right",
        className: 'finance-toast'
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create loan', {
        position: "top-right"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div variants={item} className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Loan Application</h1>
          <p className="text-gray-500">Complete your loan request</p>
        </motion.div>

        <motion.div 
          variants={item}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(form).map(([name, value]) => (
              <motion.div key={name} variants={item}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {name.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                </label>
                <input
                  name={name}
                  type={name.includes('amount') || name.includes('rate') || name.includes('period') ? 'number' : 'text'}
                  value={value}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </motion.div>
            ))}

            <motion.div variants={item}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
                  isSubmitting ? 'opacity-80' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                    Processing
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </motion.div>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring' }}
                className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100"
              >
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="font-medium text-green-800">Loan Approved</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="text-gray-600">ID:</span> {result.loan_id}</p>
                      <p><span className="text-gray-600">Total:</span> ₹{result.total_amount_payable}</p>
                      <p><span className="text-gray-600">EMI:</span> ₹{result.monthly_emi}/mo</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CreateLoan;