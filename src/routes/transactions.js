const express = require('express');
const {
  transaction,
  deleteTransaction,
  informationPeriod,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const userTransaction = express.Router();

userTransaction.post('/', auth, tryCatchWrapper(transaction));
userTransaction.delete('/delete/:id', auth, tryCatchWrapper(deleteTransaction));
userTransaction.get(
  '/information-period',
  auth,
  tryCatchWrapper(informationPeriod)
);

module.exports = userTransaction;
