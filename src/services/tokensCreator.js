const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

const jwt = require('jsonwebtoken');

const tokensCreator = userID => {
  // Creating payload for jwt
  const payload = { id: userID };
  // Generate tokens
  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  // Use { accessToken, refreshToken } = tokensCreator(userId) to get tokens
  return { accessToken, refreshToken };
};

module.exports = {
  tokensCreator,
};
