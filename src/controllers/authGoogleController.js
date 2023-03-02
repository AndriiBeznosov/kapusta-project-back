// Works only 7 version with commonJS !
const queryString = require('query-string');
const { nanoid } = require('nanoid');
const bcryptjs = require('bcryptjs');

const { User } = require('../schemas/users');
const { createLoginInfoMail } = require('../helpers/createMail');
const { sendMail } = require('../helpers/sendMail');

const { BASE_URL, GOOGLE_CLIENT_ID, FRONTEND_URL } = process.env;

const { getGoogleToken } = require('../services/getGoogleToken');
const { getUserData } = require('../services/getUserData');
const { tokensCreator } = require('../services/tokensCreator');
const googleAuth = async (req, res) => {
  // Created a query parameter string from an Object
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirect = async (req, res) => {
  //  Create full URL after google redirect from request Obj
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  // Create Object from URL string
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  // Get access token from google
  const tokenData = await getGoogleToken(code);
  // Get user data from google
  const { data: userData } = await getUserData(tokenData.data.access_token);
  const {
    email,
    verified_email: verifiedGoogleEmail,
    picture: avatarUrl,
    given_name: userName,
  } = userData;

  let user = await User.findOne({ email });

  if (!user) {
    const createdPassword = nanoid(8);

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(createdPassword, salt);

    user = await User.create({
      email,
      password: hashedPassword,
      verify: verifiedGoogleEmail,
      verificationToken: 'null',
      avatarUrl,
      userName,
    });

    const mail = createLoginInfoMail(email, createdPassword);
    await sendMail(mail);
  }

  const { accessToken, refreshToken } = tokensCreator(user._id);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken, refreshToken },
    { new: true }
  );

  return res.redirect(
    `${FRONTEND_URL}?accessToken=${updatedUser.accessToken}&refreshToken=${updatedUser.refreshToken}`
  );
};

module.exports = {
  googleAuth,
  googleRedirect,
};
