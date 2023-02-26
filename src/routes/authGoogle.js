const express = require('express');
const {
  googleAuth,
  googleRedirect,
} = require('../controllers/authGoogleController');
const { tryCatchWrapper } = require('../tryCatchWrapper/tryCatchWrapper');

const authGoogleRouter = express.Router();

authGoogleRouter.get('/auth/google', tryCatchWrapper(googleAuth));
authGoogleRouter.get('/auth/google-redirect', tryCatchWrapper(googleRedirect));

module.exports = authGoogleRouter;
