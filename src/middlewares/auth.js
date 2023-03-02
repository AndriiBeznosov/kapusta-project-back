const jwt = require('jsonwebtoken');
// const { HttpError } = require('../httpError');

const { ACCESS_SECRET } = process.env;

const { User } = require('../schemas/users');
const { checkInBlackList } = require('../services/userServices/tokenBlackList');

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [typeAuth, accessToken] = authorization.split(' ');

  if (typeAuth !== 'Bearer') {
    return res.status(401).json({
      message: 'Invalid type of authorization',
    });
  }

  try {
    const { id } = jwt.verify(accessToken, ACCESS_SECRET);

    const user = await User.findById(id);

    const isTokenInBlackList = await checkInBlackList(id, accessToken);

    if (!user || !user.accessToken || isTokenInBlackList) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('From auth middleware ERROR: ', error);

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ massage: 'jwt expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ massage: 'invalid token' });
    }

    // next(error);
  }
};

module.exports = { auth };
