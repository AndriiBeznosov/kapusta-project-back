const express = require('express');
const {
  transaction,
  deleteTransaction,
  informationPeriod,
  summaryByMonth,
  posts,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const userTransaction = express.Router();

userTransaction.get('/posts', tryCatchWrapper(posts));
userTransaction.post('/', auth, tryCatchWrapper(transaction));
userTransaction.delete('/delete/:id', auth, tryCatchWrapper(deleteTransaction));
userTransaction.post('/summary', auth, tryCatchWrapper(summaryByMonth));
userTransaction.get(
  '/information-period',
  auth,
  tryCatchWrapper(informationPeriod)
);

module.exports = userTransaction;
