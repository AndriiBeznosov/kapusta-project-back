const express = require('express');
const {
  newTransaction,
  deleteTransaction,
  informationPeriod,
  summaryByMonth,
  getTransactions,
  allSummaryReports,
  categoryReports,
  itemsCategoryReports,
} = require('../controllers/transactions');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const userTransaction = express.Router();

userTransaction.post('/operation', auth, tryCatchWrapper(getTransactions));
userTransaction.post('/new', auth, tryCatchWrapper(newTransaction));
userTransaction.delete('/delete/:id', auth, tryCatchWrapper(deleteTransaction));
userTransaction.post('/summary', auth, tryCatchWrapper(summaryByMonth));
userTransaction.post(
  '/all-summary-reports',
  auth,
  tryCatchWrapper(allSummaryReports)
);
userTransaction.post(
  '/category-reports',
  auth,
  tryCatchWrapper(categoryReports)
);
userTransaction.post(
  '/items-category-reports',
  auth,
  tryCatchWrapper(itemsCategoryReports)
);
userTransaction.get(
  '/information-period',
  auth,
  tryCatchWrapper(informationPeriod)
);

module.exports = userTransaction;
