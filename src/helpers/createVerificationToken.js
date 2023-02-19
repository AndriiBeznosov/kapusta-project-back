const { nanoid } = require("nanoid");

const createVerificationToken = () => {
  const verificationEmailToken = nanoid();
  return verificationEmailToken;
};
module.exports = {
  createVerificationToken,
};
