const {
  addUser,
  loginUser,
  logoutUser,
  addBalance,
  verifyUserEmail,
  getUser,
  update,
  updatePassword,
} = require('../services/users');

const register = async (req, res, _) => {
  try {
    const { email, password } = req.body;

    if (password.length < 6) {
      return res
        .status(404)
        .json('password should be at least 6 characters long');
    }
    const user = await addUser(email, password);
    return res.status(201).json(user);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const login = async (req, res, _) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    return res.json(user);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};
const logout = async (req, res, _) => {
  const { id } = req.user;

  try {
    await logoutUser(id);
    return res.status(201).json({ message: 'The exit was successful' });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const changeBalance = async (req, res, _) => {
  const { id } = req.user;
  const { balance } = req.body;

  try {
    const result = await addBalance(id, balance);
    return res.status(201).json({ balance: result.balance });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const verifyEmail = async (req, res, _) => {
  const { verificationToken } = req.params;

  try {
    await verifyUserEmail(verificationToken);

    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const getMe = async (req, res, _) => {
  const { id } = req.user;
  try {
    const userInfo = await getUser(id);
    return res.status(201).json(userInfo);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const updateUser = async (req, res, _) => {
  const { id } = req.user;
  const { userName, avatarUrl } = req.body;
  try {
    const updateUser = await update(id, userName, avatarUrl);
    return res.status(201).json(updateUser);
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const refreshPessword = async (req, res, _) => {
  const { email } = req.body;
  try {
    await updatePassword(email);
    return res
      .status(201)
      .json({ message: 'Password recovery email was successful !' });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  changeBalance,
  verifyEmail,
  getMe,
  updateUser,
  refreshPessword,
};
