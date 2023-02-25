const { HttpError } = require('../httpError');
const { User } = require('../schemas/users');

const visitUser = async (visit, id) => {
  try {
    const userStatusVisit = await User.findByIdAndUpdate(id, {
      firstVisit: !visit,
    });
    if (!userStatusVisit) {
      throw new HttpError('There is no user with this id in the database', 401);
    }

    return userStatusVisit.firstVisit;
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

module.exports = {
  visitUser,
};
