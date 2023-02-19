const express = require('express');
const {
  register,
  login,
  logout,
  changeBalance,
  verifyEmail,
} = require('../controllers/users');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');

const usersRouter = express.Router();

usersRouter.post('/register', tryCatchWrapper(register));
usersRouter.post('/login', tryCatchWrapper(login));
usersRouter.patch('/logout', auth, tryCatchWrapper(logout));
usersRouter.patch('/balance', auth, tryCatchWrapper(changeBalance));

usersRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));

module.exports = usersRouter;
