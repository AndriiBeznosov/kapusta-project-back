const HttpError = require("../httpError");

const tryCatchWrapper = (enpointFn) => {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      // res.status(error.code).json({ message: error.message });
      throw new HttpError(error.code, error.message);
    }
  };
};

module.exports = {
  tryCatchWrapper,
};
