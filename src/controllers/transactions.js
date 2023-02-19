const {
  addTransaction,
  sumByMonth,
  getInformationPeriod,
} = require('../services/transactions');

const { Transaction } = require('../schemas/transactions');

const transaction = async (req, res, _) => {
  try {
    const operation = await addTransaction(req.body, req.user._id);
    return res.status(201).json({ data: operation });
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
        status: 'error',
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

const reportsByMonth = async (req, res) => {
  try {
    const { id } = req.user;
    const transaction = await sumByMonth(id);
    res.status(200).json({ transaction });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
const informationPeriod = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { year, month, operation } = req.body;
    const informations = await getInformationPeriod(
      _id,
      year,
      month,
      operation
    );
    res.status(200).json(informations);
  } catch (error) {}
};

module.exports = {
  transaction,
  deleteTransaction,
  reportsByMonth,
  informationPeriod,
};
