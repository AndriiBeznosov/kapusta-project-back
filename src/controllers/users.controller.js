const { addUser, loginUser, logoutUser } = require("../models/users");

async function register(req, res, _) {
  try {
    const { email, password } = req.body;
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
    await loginUser(email, password);
    res.json({ message: "OK" });
  } catch (error) {
    console.warn(error);
    res.status(error.code).json({ message: error.message });
  }
}
async function logout(req, res, _) {
  const { token } = req.params;
  try {
    await logoutUser(token);
    res.json({ message: "OK" });
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
