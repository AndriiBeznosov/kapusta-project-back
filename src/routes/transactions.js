const express = require("express");
const {
  transaction,
  deleteTransaction,
  reportsByMonth,
} = require("../controllers/transactions");
const { tryCatchWrapper } = require("../tryCatchWrapper/tryCatchWrapper");
const { auth } = require("../middlewares/auth");

const userTransaction = express.Router();

userTransaction.post("/", auth, tryCatchWrapper(transaction));
userTransaction.delete("/delete/:id", auth, tryCatchWrapper(deleteTransaction));
userTransaction.get("/reportsByMonth", auth, tryCatchWrapper(reportsByMonth));

module.exports = userTransaction;
