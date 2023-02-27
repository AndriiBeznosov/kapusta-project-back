const { Transaction } = require('../../schemas/transactions');
const { User } = require('../../schemas/users');
const { HttpError } = require('../../httpError');

const updateUserBalance = async (userId, operationType, operationSum) => {
  try {
    const user = await User.findById(userId);
    let userBalance = user.balance;

    // if (operationType === 'expenses' && userBalance < operationType) {
    //   return { message: 'The balance is less than the amount spent' };
    // }

    switch (operationType) {
      case 'income':
        userBalance += operationSum;
        break;
      case 'expenses':
        userBalance -= operationSum;
        break;
      default:
        break;
    }

    const { balance: updatedUserBalance } = await User.findByIdAndUpdate(
      userId,
      { balance: userBalance },
      { new: true }
    );

    return updatedUserBalance;
  } catch (error) {
    return {
      message: 'Something went wrong in the user balance calculation',
      error,
    };
  }
};

// update user's balance after delete
const updateUserBalanceAfterDelete = async (
  userId,
  operationType,
  operationSum
) => {
  try {
    const user = await User.findById(userId);
    let userBalance = user.balance;

    switch (operationType) {
      case 'income':
        userBalance -= operationSum;
        break;
      case 'expenses':
        userBalance += operationSum;
        break;
      default:
        break;
    }

    const { balance: updatedUserBalance } = await User.findByIdAndUpdate(
      userId,
      { balance: userBalance },
      { new: true }
    );

    return updatedUserBalance;
  } catch (error) {
    return {
      message: 'Something went wrong in the user balance calculation',
      error,
    };
  }
};

const updateUserBalanceAfterAllDeleteTransactions = async userId => {
  try {
    const resultBalance = await User.findByIdAndUpdate(
      userId,
      { balance: 0, firstBalance: false },
      { new: true }
    );
    return resultBalance;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};
const updateUserBalanceAfterAllDeleteTransactionsByOperation = async (
  userId,
  operation
) => {
  try {
    const transactionsByOperation = await Transaction.find({
      userId,
      operation,
    });
    const sumByOperation = transactionsByOperation.reduce((acc, item) => {
      acc += item.sum;
      return acc;
    }, 0);
    const { balance } = await User.findById(userId);

    const newBalance =
      operation === 'expenses'
        ? balance + sumByOperation
        : balance - sumByOperation;
    const resultBalance = await User.findByIdAndUpdate(
      userId,
      { balance: newBalance },
      { new: true }
    );
    return resultBalance;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  updateUserBalance,
  updateUserBalanceAfterDelete,
  updateUserBalanceAfterAllDeleteTransactions,
  updateUserBalanceAfterAllDeleteTransactionsByOperation,
};
