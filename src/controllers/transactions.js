const {
  addTransaction,
  getSummary,
  getAllSummaryReports,
  getCategoryReports,
  getItemsCategoryReports,

  getAllTransactionsByOperation,
  transactionDelete,
  deleteServiceAllTransactions,
  deleteServiceAllTransactionsByOperation,
  infoTransaction,
  getAllReports,
} = require('../services/transactions');

const {
  updateUserBalance,
  updateUserBalanceAfterDelete,
  updateUserBalanceAfterAllDeleteTransactions,
  updateUserBalanceAfterAllDeleteTransactionsByOperation,
} = require('../services/transactionServices/updateUserBalance');

// Adding a new transaction
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
    res.status(error.code).json({ message: error.message });
  }
};
// Deleting a transaction by id
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await transactionDelete(id);

    // Getting parameters for updating user balance
    const { userId, operation: operationType, sum: operationSum } = transaction;
    // Update user balance in DB
    const updateBalance = await updateUserBalanceAfterDelete(
      userId,
      operationType,
      operationSum
    );

    res
      .status(200)
      .json({ data: transaction, user: { balance: updateBalance } });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
//  Get the sum of the transaction by income, expenses
const summaryByMonth = async (req, res) => {
  try {
    const { operation } = req.body;
    const { id } = req.user;
    const transaction = await getSummary(id, operation);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const allSummaryReports = async (req, res) => {
  try {
    const { month, year } = req.body;
    const { id } = req.user;
    const transaction = await getAllSummaryReports(id, month, year);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const categoryReports = async (req, res) => {
  try {
    const { month, year, operation } = req.body;
    const { id } = req.user;
    const transaction = await getCategoryReports(id, month, year, operation);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const itemsCategoryReports = async (req, res) => {
  try {
    const { month, year, operation, category } = req.body;
    const { id } = req.user;
    const transaction = await getItemsCategoryReports(
      id,
      month,
      year,
      operation,
      category
    );
    res.status(200).json(transaction);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
// Receive transactions by transactions
const getTransactions = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { operation } = req.body;
    const information = await getAllTransactionsByOperation(id, operation);
    res.status(200).json(information);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
// Discount transactions and balance
const reset = async (req, res, _) => {
  try {
    const { id } = req.user;
    const info = await deleteServiceAllTransactions(id);
    const userUpdated = await updateUserBalanceAfterAllDeleteTransactions(id);
    res.status(200).json({
      transactions: [],
      info,
      balance: userUpdated.balance,
      firstBalance: userUpdated.firstBalance,
    });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
// Clear transactions on transactions
const clearByOperation = async (req, res, _) => {
  try {
    const { operation } = req.body;
    const { id } = req.user;
    const userUpdated =
      await updateUserBalanceAfterAllDeleteTransactionsByOperation(
        id,
        operation
      );
    const info = await deleteServiceAllTransactionsByOperation(id, operation);

    res.status(200).json({
      transactions: [],
      info,
      balance: userUpdated.balance,
    });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
// Getting information on a transaction based on <operation, month, year, category>
const infoAllTransaction = async (req, res, _) => {
  try {
    const { operation, month, year, category } = req.body;
    const { id } = req.user;

    const data = await infoTransaction(id, operation, month, year, category);

    res.status(200).json(data);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const allReportsTransactions = async (req, res, _) => {
  try {
    const { month, year } = req.body;
    const { id } = req.user;

    const data = await getAllReports(id, month, year);

    res.status(200).json(data);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

module.exports = {
  newTransaction,
  deleteTransaction,
  summaryByMonth,
  allSummaryReports,
  categoryReports,
  itemsCategoryReports,
  getTransactions,
  reset,
  clearByOperation,
  infoAllTransaction,
  allReportsTransactions,
};
