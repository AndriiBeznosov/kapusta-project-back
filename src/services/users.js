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
  SendMailUpdatingPassword,
} = require('../helpers/createConfirmationMail');
const { nanoid } = require('nanoid');

const addUser = async (email, password) => {
  try {
    const emailCheck = email.toLowerCase();
    const checkUser = await User.findOne({ emailCheck });

    if (checkUser && !checkUser.verify) {
      await sendMailConfirmationMail(checkUser);
      throw new HttpError('Email is not verified, but already registered', 409);
    }
    if (checkUser && checkUser.verify) {
      throw new HttpError(`Email verified, and already registered`, 409);
    }
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const verificationToken = createVerificationToken();
    const name = createName(email);

    const user = await User.create({
      email: emailCheck,
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
    const emailCheck = email.toLowerCase();
    const user = await User.findOne({ email: emailCheck });

    if (!user) {
      throw new HttpError('Invalid email address or password', 401);
    }

    const isValidPass = await bcryptjs.compare(password, user.password);
    if (!isValidPass) {
      throw new HttpError('Invalid email address or password', 401);
    }

    if (!user.verify) {
      await sendMailConfirmationMail(user);
      throw new HttpError(`Please confirm the mail ${email}`, 401);
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
    const resultBalance = await User.findByIdAndUpdate(
      id,
      { balance },
      { new: true }
    );
    return resultBalance;
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

const updatePassword = async email => {
  try {
    const emailCheck = email.toLowerCase();
    const user = await User.findOne({ email: emailCheck });
    if (!user) {
      throw new HttpError(
        `User with this email '${email}' is not in the database. Please register`,
        409
      );
    }
    const password = nanoid();
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);
    const userUpdate = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!userUpdate.verify) {
      await sendMailConfirmationMail(userUpdate);
      throw new HttpError(`Please confirm the mail ${email} by verifying`, 401);
    }

    await SendMailUpdatingPassword(email, password);

    return userUpdate.token;
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
  updatePassword,
};
