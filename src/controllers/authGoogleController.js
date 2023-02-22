// Works only 7 version with commonJS !
const queryString = require('query-string');
const { nanoid } = require('nanoid');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../schemas/users');
const { loginUser } = require('../services/users');
const { createLoginInfoMail } = require('../helpers/createMail');
const { sendMail } = require('../helpers/sendMail');

// Get environment variable
const { BASE_URL, GOOGLE_CLIENT_ID, FRONTEND_URL, JWT_SECRET } = process.env;

const { getGoogleToken } = require('../services/getGoogleToken');
const { getUserData } = require('../services/getUserData');

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
  const { email, verified_email: verifiedGoogleEmail } = userData;
  // console.log('userData =>', userData);

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
    });

    // Save user
    await candidate.save();

    // Delate verificationToken
    await User.findOneAndUpdate({ email }, { verificationToken: null });

    // Send Greeting message, login and created password to new user
    const mail = createLoginInfoMail(email, createdPassword);
    await sendMail(mail);

    const user = await loginUser(email, createdPassword);

    return res.redirect(`${FRONTEND_URL}/google-redirect?token=${user.token}`);
  }

  // User already exists. Creating access and refresh tokens and redirecting on the front-end rout
  const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: '1h',
  });

  const { token } = await User.findByIdAndUpdate(
    user._id,
    { token: accessToken },
    { new: true }
  );

  return res.redirect(
    `${FRONTEND_URL}/google-redirect?accessToken=${token}&refreshToken=${'_none_'}`
  );

  // return res.redirect(
  //   `${FRONTEND_URL}?accessToken=${user.token}&refreshToken=${user.refreshToken}`
  // );
  // Cool to create on front-end gritting redirect page (user Please wait and spinner)
  // React router / google - redirect(page)
};

module.exports = {
  googleAuth,
  googleRedirect,
};
