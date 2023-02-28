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
} = require('../services/transactions');

const {
  updateUserBalance,
  updateUserBalanceAfterDelete,
  updateUserBalanceAfterAllDeleteTransactions,
  updateUserBalanceAfterAllDeleteTransactionsByOperation,
} = require('../services/transactionServices/updateUserBalance');

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

const deleteAllTransactionsAndBalance = async (req, res, _) => {
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

const deleteAllTransactionsByOperation = async (req, res, _) => {
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

module.exports = {
  newTransaction,
  deleteTransaction,
  summaryByMonth,
  allSummaryReports,
  categoryReports,
  itemsCategoryReports,
  getTransactions,
  deleteAllTransactionsAndBalance,
  deleteAllTransactionsByOperation,
};
