const { addTransaction } = require("../services/transactions");

async function transaction(req, res, _) {
  try {
    const operation = await addTransaction(req.body, req.user._id);
    return res.status(201).json({ data: operation });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
}

module.exports = {
  transaction,
};
