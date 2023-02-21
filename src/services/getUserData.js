const axios = require('axios');

const getUserData = async accessGoogleToken => {
  return await axios({
    method: 'get',
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    headers: {
      Authorization: `Bearer ${accessGoogleToken}`,
    },
  });
};

// Response example
// userData.data: {
//   id: 'userID',
//   email: 'examle@gmail.com',
//   verified_email: true / false,
//   name: 'Name Surname',
//   given_name: 'Name',
//   family_name: 'Surname',
//   picture: 'https://lh3.googleusercontent.com/a/AEdFTp7kU-2HCtA77Qxa9FbjidEzoMRB58bJz_dW2HEl=s96-c',
//   locale: 'en'
// }

module.exports = {
  getUserData,
};
