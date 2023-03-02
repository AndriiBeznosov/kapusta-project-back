const jwt = require('jsonwebtoken');
const { HttpError } = require('../httpError');

const { ACCESS_SECRET } = process.env;

const { User } = require('../schemas/users');

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [typeAuth, accessToken] = authorization.split(' ');

  try {
    if (typeAuth !== 'Bearer') {
      return next(new HttpError('Invalid type of authorization', 401));
    }

    const { id } = jwt.verify(accessToken, ACCESS_SECRET);
    const user = await User.findById(id);

    if (!user || !user.accessToken) {
      return next(new HttpError('Not authorized', 401));
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new HttpError('jwt expired', 401));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new HttpError('invalid token', 401));
    }

    return next(error);
  }
};

module.exports = { auth };
