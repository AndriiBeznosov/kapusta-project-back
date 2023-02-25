const {
  getCurrentBalance,
} = require('../../services/usersServices/getCurrentBalance');

const currentBalanceController = async (req, res) => {
  const { id } = req.user;

  try {
    const { balance } = await getCurrentBalance(id);

    res.status(200).json({ balance });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

module.exports = {
  currentBalanceController,
};
