require('dotenv').config();
const { JWT_SECRET } = process.env;

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../httpError');
const { User } = require('../schemas/users');

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

    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
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
      return { message: `Please confirm the mail ${email}` };
    }
    const { _id: userId } = user;
    const payload = { id: userId };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { token },
      {
        new: true,
      }
    );

    return userUpdate;
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
      { token: null },
      {
        new: true,
      }
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

    return user.token;
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
};

const getUser = async id => {
  try {
    const {
      token,
      _id,
      email,
      userName,
      avatarUrl,
      balance,
      verificationToken,
      verify,
    } = await User.findById(id);
    if (!token) {
      throw new HttpError('Invalid email address or password', 401);
    }

    return {
      token,
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

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  addBalance,
  verifyUserEmail,
  getUser,
  update,
};
