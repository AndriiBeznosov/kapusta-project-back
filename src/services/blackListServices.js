const { HttpError } = require('../httpError/index');
const { BlackList } = require('../schemas/blackList');

const addTokenToBlackList = async (userId, accessToken) => {
  try {
    const { blackList, _id: docId } = await BlackList.findOne({ userId });

    blackList.push(accessToken);

    await BlackList.findByIdAndUpdate(docId, { blackList });
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const checkInBlackList = async (userId, accessToken) => {
  try {
    const { blackList } = await BlackList.findOne({ userId });
    const isExists = blackList.includes(accessToken);

    return isExists;
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const checkAndCreateBlacklist = async userId => {
  try {
    const blackList = await BlackList.findOne({ userId });

    if (!blackList) {
      await BlackList.create({ userId });
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  addTokenToBlackList,
  checkInBlackList,
  checkAndCreateBlacklist,
};
