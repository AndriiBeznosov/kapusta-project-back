require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../httpError");
const { User } = require("../schemas/users");

const { JWT_SECRET } = process.env;

const addUser = async (email, password) => {
  try {
    // hash паролю
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);
    // створення користувача
    const user = await User.create({ email, password: hashedPassword });

    // створення токену для користувача
    const { _id: userId } = user;
    const payload = { id: userId };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { token },
      {
        new: true,
      },
    );
    return userUpdate;
  } catch (error) {
    console.warn(error.message);
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(
        "The email is already taken by another user, try logging in ",
        409,
      );
    }

    throw new HttpError(error.message, 404);
  }
};
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError("Not valid email or postal address", 401);
    }

    const isValidPass = await bcryptjs.compare(password, user.password);
    if (!isValidPass) {
      throw new HttpError("Not valid password", 401);
    }
    const { _id: userId } = user;
    const payload = { id: userId };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    const userUpdate = await User.findByIdAndUpdate(
      userId,
      { token },
      {
        new: true,
      },
    );

    return userUpdate;
  } catch (error) {
    console.warn(error.message);
    if (error.message.includes("Not valid email")) {
      throw new HttpError(error.message, error.code);
    }
    throw new HttpError(error.message, error.code);
  }
};

const logoutUser = async (id) => {
  try {
    await User.findByIdAndUpdate(
      id,
      { token: null },
      {
        new: true,
      },
    );
  } catch (error) {
    throw new HttpError(error.message, 404);
  }
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
};
