const {
  addTransaction,
  getSummary,
  getInformationPeriod,
  getAllTransactionsByOperation,
} = require('../services/transactions');

const {
  updateUserBalance,
} = require('../services/transactionServices/updateUserBalance');
const { Transaction } = require('../schemas/transactions');

const newTransaction = async (req, res, _) => {
  try {
    const transaction = await addTransaction(req.body, req.user._id);

    // Getting parameters for updating user balance
    const { userId, operation: operationType, sum: operationSum } = transaction;
    // Update user balance in DB
    const updatedUserBalance = await updateUserBalance(
      userId,
      operationType,
      operationSum
    );

    return res
      .status(201)
      .json({ data: transaction, user: { balance: updatedUserBalance } });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Transaction.findByIdAndRemove({ _id: id });

    if (!result) {
      return res.status(404).json({
        message: 'Id of transaction not found',
      });
    }
    res.status(200).json({
      message: 'Your transaction was deleted!',
    });
  } catch (error) {
    next();
  }
};

const summaryByMonth = async (req, res) => {
  try {
    const { operation } = req.body;
    const { id } = req.user;
    const transaction = await getSummary(id, operation);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const informationPeriod = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { year, month } = req.body;
    const information = await getInformationPeriod(_id, year, month);
    res.status(200).json(information);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { operation } = req.body;
    const information = await getAllTransactionsByOperation(id, operation);
    res.status(201).json(information);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

module.exports = {
  newTransaction,
  deleteTransaction,
  summaryByMonth,
  informationPeriod,
  getTransactions,
};
