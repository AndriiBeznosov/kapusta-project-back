const express = require('express');
const { staticController } = require('../controllers/staticController');

const staticRouter = express.Router();
staticRouter.get('/link', staticController);

module.exports = staticRouter;
