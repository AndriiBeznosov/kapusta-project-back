require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../httpError");
const { User } = require("../schemas/users");

const { JWT_SECRET } = process.env;

const addUser = async (email, password) => {
  // hash паролю

  try {
    // hash паролю
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // створення користувача
    const user = await User.create({ email, password: hashedPassword });

    // створення токену для користувача
    // const { _id: userId } = user;
    // const payload = { id: userId };
    // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
    // const userUpdate = await User.findByIdAndUpdate(
    //   userId,
    //   { token },
    //   {
    //     new: true,
    //   },
    // );
    // return userUpdate;
    return user;
  } catch (error) {
    console.warn(error.message);

    throw new HttpError(error.message, 404);
  }
};
const loginUser = async (email, password) => {
  console.log(email, password);
  //   try {
  //     const user = await User.create({ email, password });

  //     return user;
  //   } catch (error) {
  //     console.warn(error.message);

  //     throw new HttpError(error.message, 404);
  //   }
};
const logoutUser = async (token) => {
  console.log(token);
  //   try {
  //     const user = await User.create({ email, password });

  //     return user;
  //   } catch (error) {
  //     console.warn(error.message);

  //     throw new HttpError(error.message, 404);
  //   }
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
};
