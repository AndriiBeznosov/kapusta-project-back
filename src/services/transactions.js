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

const sumByMonth = async (id, operation) => {
  const today = new Date();
  const year = today.getFullYear();

  try {
    const transactions = await Transaction.find({
      userId: id,
      year,
      operation,
    });

    const result = transactions.reduce((acc, item) => {
      if (Object.keys(acc).includes(item.month)) {
        acc[item.month] = +acc[item.month] + +item.sum;
        return acc;
      }
      acc[item.month] = +item.sum;
      return acc;
    }, {});
    if (!Object.keys(result).length) {
      throw new HttpError('no result by this year', 400);
    }
    return result;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const getPosts = async () => {
  try {
    const posts = await Transaction.find();
    // if (!posts.length) {
    //   return { message: 'There is no data for this request' };
    // }

    return posts;
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  sumByMonth,
  addTransaction,
  getInformationPeriod,
  getPosts,
};
