// Works only 7 version with commonJS !
const queryString = require('query-string');
const { nanoid } = require('nanoid');
const bcryptjs = require('bcryptjs');

const { User } = require('../schemas/users');
const { loginUser } = require('../services/users');
const { createLoginInfoMail } = require('../helpers/createMail');
const { sendMail } = require('../helpers/sendMail');

// Get environment variable
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
  } = userData;

  // TODO
  // Check is exists user email from google in DB
  const user = await User.findOne({ email });

  // NO USER in DB, create logic of register user, gen access token & create session id ???
  if (!user) {
    // Register user and generate JWT
    // Creating password 8 symbol, hashed and save in DB
    const createdPassword = nanoid(8);

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(createdPassword, salt);

    const candidate = await User({
      email,
      password: hashedPassword,
      verify: verifiedGoogleEmail,
      verificationToken: 'googleAuth2',
      avatarUrl,
    });

    // Save user
    await candidate.save();

    // Delate verificationToken
    await User.findOneAndUpdate({ email }, { verificationToken: null });

    // Send Greeting message, login and created password to new user
    const mail = createLoginInfoMail(email, createdPassword);
    await sendMail(mail);

    const { accessToken, refreshToken } = await loginUser(
      email,
      createdPassword
    );

    // Redirect on front-end vs tokens
    return res.redirect(
      `${FRONTEND_URL}/google-redirect?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }

  const { accessToken, refreshToken } = tokensCreator(user._id);

  // Update tokens
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken, refreshToken },
    { new: true }
  );

  // Redirecting on the front-end rout vs tokens
  return res.redirect(
    `${FRONTEND_URL}/google-redirect?accessToken=${updatedUser.accessToken}&refreshToken=${updatedUser.refreshToken}`
  );
};

module.exports = {
  googleAuth,
  googleRedirect,
};
