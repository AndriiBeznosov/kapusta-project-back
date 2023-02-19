const express = require('express');
const {
  transaction,
  deleteTransaction,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const userTransaction = express.Router();

userTransaction.post('/', auth, tryCatchWrapper(transaction));
userTransaction.delete('/:id', auth, tryCatchWrapper(deleteTransaction));

module.exports = userTransaction;
