const { HttpError } = require("../httpError");
const { Transaction } = require("../schemas/transactions");

const addTransaction = async (data, id) => {
  try {
    data.userId = id;
    const transaction = await Transaction.create(data);
    return transaction;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const sumByMonth = async (id) => {
  try {
    const transactions = await Transaction.find({ userId: id });

    const result = transactions.reduce((acc, item) => {
      // const monthSum = {};
      if (Object.keys(acc).includes(item.month)) {
        return (acc[item.month] = acc.month + item.sum);
      }
      acc[item.month] = item.sum;

      // acc.push(monthSum);
      return acc;
    }, {});
    return result;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  sumByMonth,
  addTransaction,
};
