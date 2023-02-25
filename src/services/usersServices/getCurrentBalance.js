const { HttpError } = require('../../httpError');
const { User } = require('../../schemas/users');

const getCurrentBalance = async id => {
  try {
    const { balance } = await User.findById(id);

    return { balance };
  } catch (err) {
    throw new HttpError(err.massage, err.code);
  }
};

module.exports = {
  getCurrentBalance,
};
