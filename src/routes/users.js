const express = require("express");
const { register, login, logout } = require("../controllers/users");
const { tryCatchWrapper } = require("../tryCatchWrapper/tryCatchWrapper");
const { auth } = require("../middlewares/auth");

const usersRouter = express.Router();

usersRouter.post("/register", tryCatchWrapper(register));
usersRouter.post("/login", tryCatchWrapper(login));
usersRouter.patch("/logout", auth, tryCatchWrapper(logout));

module.exports = usersRouter;
