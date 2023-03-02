const express = require('express');
const {
  newTransaction,
  deleteTransaction,
  summaryByMonth,
  getTransactions,
  allSummaryReports,
  categoryReports,
  itemsCategoryReports,
  reset,
  infoAllTransaction,
  clearByOperation,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');
const { validateTransaction } = require('../middlewares/joi');
const {
  transactionSchema,
  operationSchema,
  summaryReportsSchema,
  categoryReportsSchema,
  itemsCategorySchema,
  infoTransactionSchema,
} = require('../schemas/joi/transactionJoiSchema');

const userTransaction = express.Router();

userTransaction.post('/operation', auth, tryCatchWrapper(getTransactions));
userTransaction.post(
  '/new',
  auth,
  validateTransaction(transactionSchema),
  tryCatchWrapper(newTransaction)
);
userTransaction.delete('/delete/:id', auth, tryCatchWrapper(deleteTransaction));
userTransaction.post(
  '/summary',
  auth,
  validateTransaction(operationSchema),
  tryCatchWrapper(summaryByMonth)
);
// reserv
userTransaction.post(
  '/all-summary-reports',
  auth,
  validateTransaction(summaryReportsSchema),
  tryCatchWrapper(allSummaryReports)
);
// reserv
userTransaction.post(
  '/category-reports',
  auth,
  validateTransaction(categoryReportsSchema),
  tryCatchWrapper(categoryReports)
);
// reserv
userTransaction.post(
  '/items-category-reports',
  auth,
  validateTransaction(itemsCategorySchema),
  tryCatchWrapper(itemsCategoryReports)
);

userTransaction.delete('/delete-all', auth, tryCatchWrapper(reset));

userTransaction.delete(
  '/delete-all-operation',
  auth,
  validateTransaction(operationSchema),
  tryCatchWrapper(clearByOperation)
);

userTransaction.post(
  '/all-operation',
  auth,
  validateTransaction(infoTransactionSchema),
  tryCatchWrapper(infoAllTransaction)
);

module.exports = userTransaction;
