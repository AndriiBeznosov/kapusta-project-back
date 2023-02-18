const express = require("express");
const { transaction } = require("../controllers/transactions");
const { tryCatchWrapper } = require("../tryCatchWrapper/tryCatchWrapper");
const { auth } = require("../middlewares/auth");

const userTransaction = express.Router();

userTransaction.post("/", auth, tryCatchWrapper(transaction));

module.exports = userTransaction;
