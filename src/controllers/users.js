const {
  addUser,
  loginUser,
  logoutUser,
  addBalance,
  verifyUserEmail,
  getUser,
  update,
  refreshTokenService,
  updatePassword,
} = require('../services/users');
const { visitUser } = require('../services/visitUser');

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
    const { email: userEmail, password } = req.body;
    const {
      email,
      accessToken,
      refreshToken,
      balance,
      avatarUrl,
      userName,
      firstVisit,
      firstBalance,
    } = await loginUser(userEmail, password);
    return res.json({
      email,
      accessToken,
      refreshToken,
      balance,
      avatarUrl,
      userName,
      firstVisit,
      firstBalance,
    });
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
    return res
      .status(201)
      .json({ balance: result.balance, firstBalance: result.firstBalance });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  try {
    const { accessToken, refreshToken } = await verifyUserEmail(
      verificationToken
    );

    res.redirect(
      `${process.env.FRONTEND_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
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

const refreshPassword = async (req, res, _) => {
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

const refreshTokenController = async (req, res, next) => {
  const { refreshToken: receivedToken } = req.body;

  try {
    const { accessToken, refreshToken } = await refreshTokenService(
      receivedToken
    );

    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(error.code).json({ message: error.message });
  }
};

const firstVisit = async (req, res, next) => {
  try {
    const newVisit = req.user.firstVisit;
    const { id } = req.user;

    if (!newVisit) {
      const newStatus = await visitUser(newVisit, id);

      res.status(201).json({ firstVisit: newStatus });
      return;
    }

    res.status(201).json({ firstVisit: newVisit });
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
  refreshTokenController,
  refreshPassword,
  firstVisit,
};
