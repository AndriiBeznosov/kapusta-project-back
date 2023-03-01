const { HttpError } = require('../httpError');

const validateUser = schema => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      throw new HttpError(error.message, 400);
    }
    return next();
  };
};

const validateTransaction = schema => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new HttpError(error.message, 400);
    }
    return next();
  };
};

module.exports = {
  validateUser,
  validateTransaction,
};
