// const HttpError = require('../httpError');

const tryCatchWrapper = endpointFn => {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      res.status(error.code).json({ message: error.message });
      // throw new HttpError(error.code, error.message);
    }
  };
};

module.exports = {
  tryCatchWrapper,
};
