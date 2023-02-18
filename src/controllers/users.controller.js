const { addUser, loginUser, logoutUser } = require("../models/users");

async function register(req, res, _) {
  try {
    const { email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(404)
        .json("password should be at least 6 characters long");
    }
    const user = await addUser(email, password);
    return res.status(201).json({ user: user });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
}
async function login(req, res, _) {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    return res.json(user);
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
}
async function logout(req, res, _) {
  const { id } = req.user;
  try {
    await logoutUser(id);
    return res.status(201).json({ message: "The exit was successful" });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
};
