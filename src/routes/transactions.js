const express = require('express');
const {
  newTransaction,
  deleteTransaction,
  informationPeriod,
  summaryByMonth,
  getTransactions,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const userTransaction = express.Router();

userTransaction.get('/all', auth, tryCatchWrapper(getTransactions));
userTransaction.post('/new', auth, tryCatchWrapper(newTransaction));
userTransaction.delete('/delete/:id', auth, tryCatchWrapper(deleteTransaction));
userTransaction.post('/summary', auth, tryCatchWrapper(summaryByMonth));
userTransaction.get(
  '/information-period',
  auth,
  tryCatchWrapper(informationPeriod)
);

module.exports = userTransaction;
