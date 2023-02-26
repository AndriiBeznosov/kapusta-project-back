const axios = require('axios');

const { BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const getGoogleToken = async code => {
  return await axios({
    method: 'post',
    url: 'https://oauth2.googleapis.com/token',
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/auth`,
      grant_type: 'authorization_code',
      code,
    },
  });
};

module.exports = {
  getGoogleToken,
};
