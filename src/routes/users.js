const express = require("express");
const { register, login, logout } = require("../controllers/users.controller");
const { tryCatchWrapper } = require("../tryCatchWrapper/tryCatchWrapper");

const usersRouter = express.Router();

usersRouter.post("/register", tryCatchWrapper(register));
usersRouter.post("/login", tryCatchWrapper(login));
usersRouter.patch("/logout", tryCatchWrapper(logout));

module.exports = usersRouter;
