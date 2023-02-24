const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { REFRESH_SECRET } = process.env;

const { HttpError } = require('../httpError');
const { User } = require('../schemas/users');
const { tokensCreator } = require('../services/tokensCreator');
const {
  createVerificationToken,
} = require('../helpers/createVerificationToken');

const { createConfirmationMail } = require('../helpers/createMail');
const { sendMail } = require('../helpers/sendMail');

const addUser = async (email, password) => {
  try {
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const verificationToken = createVerificationToken();
    const indexEmail = email.indexOf('@');
    const name = email.slice(0, indexEmail).slice(0, 9);

    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
      userName: name,
    });

    const mail = createConfirmationMail(user.email, user.verificationToken);
    await sendMail(mail);

    return {
      message: `User registration was successful, a verification email ${user.email} was sent to you`,
    };
  } catch (error) {
    console.warn(error.message);
    if (error.message.includes('E11000 duplicate key error')) {
      throw new HttpError(
        'The email is already taken by another user, try logging in ',
        409
      );
    }

    throw new HttpError(error.message, 404);
  }
};
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new HttpError('Invalid email address or password', 401);
    }

    const isValidPass = await bcryptjs.compare(password, user.password);

    if (!isValidPass) {
      throw new HttpError('Invalid email address or password', 401);
    }

    if (!user.verify) {
      const mail = createConfirmationMail(user.email, user.verificationToken);
      await sendMail(mail);
      return { message: `Please confirm the email ${email}` };
    }

    // const payload = { id: user._id };
    // Creating accessToken & refreshToken
    // const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '2m' });
    // const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
    const { accessToken, refreshToken } = tokensCreator(user._id);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { accessToken, refreshToken },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    if (error.message.includes('Not valid email')) {
      throw new HttpError(error.message, error.code);
    }
    throw new HttpError(error.message, error.code);
  }
};

const logoutUser = async id => {
  try {
    await User.findByIdAndUpdate(
      id,
      { accessToken: null, refreshToken: null },
      { new: true }
    );
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const addBalance = async (id, balance) => {
  if (!balance) {
    throw new HttpError('Not valid balance', 400);
  }
  try {
    await User.findByIdAndUpdate(id, { balance }, { new: true });
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

const verifyUserEmail = async verificationToken => {
  try {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new HttpError('Not found', 404);
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    return { accessToken: user.accessToken, refreshToken: user.refreshToken };
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const getUser = async id => {
  try {
    const {
      accessToken,
      refreshToken,
      _id,
      email,
      userName,
      avatarUrl,
      balance,
      verificationToken,
      verify,
    } = await User.findById(id);
    if (!accessToken) {
      throw new HttpError('Invalid email address or password', 401);
    }

    return {
      accessToken,
      refreshToken,
      _id,
      email,
      userName,
      avatarUrl,
      balance,
      verificationToken,
      verify,
    };
  } catch (error) {}
};

const update = async (id, userName, avatarUrl) => {
  try {
    const user = await User.updateOne(
      { _id: id },
      { userName, avatarUrl },
      { new: true }
    );
    if (!user) {
      throw new HttpError('Invalid email address or password', 401);
    }
    const updatePost = await User.findById(id);

    return updatePost;
  } catch (error) {}
};

const refreshTokenService = async verifiableToken => {
  try {
    const { id } = jwt.verify(verifiableToken, REFRESH_SECRET);
    const checkTokenInDb = await User.findOne({
      refreshToken: verifiableToken,
    });

    if (!checkTokenInDb) {
      throw new HttpError('invalid token', 403);
    }

    const { accessToken, refreshToken } = tokensCreator(id);

    await User.findByIdAndUpdate(
      id,
      { accessToken, refreshToken },
      { new: true }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new HttpError(error.message, 403);
  }
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  addBalance,
  verifyUserEmail,
  getUser,
  update,
  refreshTokenService,
};
