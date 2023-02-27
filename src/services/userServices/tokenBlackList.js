const { HttpError } = require('../../httpError');
const { BlackList } = require('../../schemas/blackList');

const createBlackListDocument = async userId => {
  try {
    await BlackList.create({ userId });
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const addTokenToBlackList = async (userId, accessToken) => {
  try {
    const { blackList, _id: docId } = await BlackList.findOne({ userId });

    blackList.push(accessToken);

    await BlackList.findByIdAndUpdate(docId, { blackList });
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const checkTokenInBlackList = async (userId, accessToken) => {
  try {
    const { blackList } = await BlackList.findOne({ userId });
    const isExists = blackList.includes(accessToken);

    return { isExists };
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

module.exports = {
  createBlackListDocument,
  addTokenToBlackList,
  checkTokenInBlackList,
};
