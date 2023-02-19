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
  const today = new Date();
  const year = today.getFullYear();

  try {
    const transactions = await Transaction.find({ userId: id, year });

    const result = transactions.reduce((acc, item) => {
      if (Object.keys(acc).includes(item.month)) {
        acc[item.month] = +acc[item.month] + +item.sum;
        return acc;
      }
      acc[item.month] = +item.sum;
      return acc;
    }, {});
    if (!Object.keys(result).length) {
      throw new HttpError("no result by this year", 400);
    }
    return result;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  sumByMonth,
  addTransaction,
};
