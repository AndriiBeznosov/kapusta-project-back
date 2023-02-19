const { HttpError } = require('../httpError');
const { Transaction } = require('../schemas/transactions');

const addTransaction = async (data, id) => {
  try {
    data.userId = id;
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};
const getInformationPeriod = async (id, year, month, operation) => {
  try {
    const transactions = await Transaction.find({
      userId: id,
      year,
      month,
      operation,
    });
    if (!transactions.length) {
      return { message: 'There is no data for this request' };
    }

    return transactions;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  addTransaction,
  getInformationPeriod,
};
