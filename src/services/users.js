require('dotenv').config();
const { JWT_SECRET } = process.env;

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../httpError');
const { User } = require('../schemas/users');
const {
  createVerificationToken,
} = require('../helpers/createVerificationToken');
const { createName } = require('../helpers/createName');
const {
  sendMailConfirmationMail,
} = require('../helpers/createConfirmationMail');

const addUser = async (email, password) => {
  try {
    const checkUser = await User.findOne({ email });

    if (checkUser && !checkUser.verify) {
      await sendMailConfirmationMail(checkUser);
      throw new HttpError(
        `You are re-registering, a letter was sent to your email "${email}", please confirm your email`,
        409
      );
    }
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const verificationToken = createVerificationToken();
    const name = createName(email);

    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
      userName: name,
    });

    await sendMailConfirmationMail(user);

    return {
      message: `User registration was successful, a verification email ${user.email} was sent to you`,
    };
  } catch (error) {
    if (error.message.includes('E11000 duplicate key error')) {
      throw new HttpError('A user already exists under such a mail', 409);
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
      await sendMailConfirmationMail(user);
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
  } catch (error) {
    throw new HttpError(error.message, error.code);
  }
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
  } catch (error) {
    throw new HttpError(error.message, error.code);
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
};
