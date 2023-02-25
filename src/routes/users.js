const express = require('express');
const {
  register,
  login,
  logout,
  changeBalance,
  verifyEmail,
  getMe,
  updateUser,
  refreshTokenController,
  refreshPassword,
} = require('../controllers/users');

const {
  currentBalanceController,
} = require('../controllers/users/currentBalanceController');

const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const usersRouter = express.Router();

usersRouter.post('/register', tryCatchWrapper(register));
usersRouter.post('/login', tryCatchWrapper(login));
usersRouter.get('/get-user', auth, tryCatchWrapper(getMe));
usersRouter.patch('/logout', auth, tryCatchWrapper(logout));
usersRouter.patch('/balance', auth, tryCatchWrapper(changeBalance));
usersRouter.patch('/update-user', auth, tryCatchWrapper(updateUser));
usersRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
usersRouter.post('/refresh-password', tryCatchWrapper(refreshPassword));

usersRouter.get(
  '/current-balance',
  auth,
  tryCatchWrapper(currentBalanceController)
);

usersRouter.post('/refresh', tryCatchWrapper(refreshTokenController));

module.exports = usersRouter;
