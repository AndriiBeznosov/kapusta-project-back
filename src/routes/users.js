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
  firstVisit,
  passwordVerification,
} = require('../controllers/users');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');
const { auth } = require('../middlewares/auth');
const { validateUser } = require('../middlewares/joi');
const {
  loginSchema,
  balanceSchema,
  updateSchema,
  updatePasswordSchema,
  refreshTokenSchema,
  passwordVerifySchema,
} = require('../schemas/joi/userJoiSchema');

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  tryCatchWrapper(validateUser(loginSchema)),
  tryCatchWrapper(register)
);
usersRouter.post('/login', validateUser(loginSchema), tryCatchWrapper(login));
usersRouter.get('/get-user', auth, tryCatchWrapper(getMe));
usersRouter.patch('/logout', auth, tryCatchWrapper(logout));
usersRouter.patch(
  '/balance',
  auth,
  validateUser(balanceSchema),
  tryCatchWrapper(changeBalance)
);
usersRouter.patch(
  '/update-user',
  auth,
  validateUser(updateSchema),
  tryCatchWrapper(updateUser)
);
usersRouter.get('/verify/:verificationToken', tryCatchWrapper(verifyEmail));
usersRouter.post(
  '/refresh-password',
  validateUser(updatePasswordSchema),
  tryCatchWrapper(refreshPassword)
);

usersRouter.post(
  '/refresh',
  validateUser(refreshTokenSchema),
  tryCatchWrapper(refreshTokenController)
);
usersRouter.post('/first-visit', auth, tryCatchWrapper(firstVisit));
usersRouter.post(
  '/password-verification',
  auth,
  validateUser(passwordVerifySchema),
  tryCatchWrapper(passwordVerification)
);

module.exports = usersRouter;
