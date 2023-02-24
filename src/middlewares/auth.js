const jwt = require('jsonwebtoken');
// const { HttpError } = require('../httpError');

const { ACCESS_SECRET } = process.env;

const { User } = require('../schemas/users');

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [typeAuth, accessToken] = authorization.split(' ');

  if (typeAuth !== 'Bearer') {
    // throw new HttpError('Not authorized', 401);
    return res.status(401).json({
      message: 'Invalid type of authorization',
    });
  }

  try {
    const { id } = jwt.verify(accessToken, ACCESS_SECRET);

    const user = await User.findById(id);

    if (!user || !user.accessToken) {
      // throw new HttpError('Not authorized', 401);
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('From auth middleware ERROR: ', error);

    if (error.name === 'TokenExpiredError') {
      // return next(new HttpError(error.name, 401));
      res.status(401).json({ massage: 'jwt expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ massage: 'invalid token' });
    }

    // next(error);
  }
};

module.exports = { auth };
