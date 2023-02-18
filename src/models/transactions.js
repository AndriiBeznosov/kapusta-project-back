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

module.exports = {
  addTransaction,
};
