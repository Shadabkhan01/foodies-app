const express = require("express");
const { isLoggedIn, logout } = require("../Controller/authController");
const { getHomepage, getloginPage, getSignupPage, getPlansPage, getProfilePage, getResetPasswordPage} = require("../Controller/viewController");

const viewRouter = express.Router();

viewRouter.use(isLoggedIn);
viewRouter.route("").get(getHomepage);
viewRouter.route("/login").get(getloginPage);
viewRouter.route("/logout").get(logout);
viewRouter.route("/resetpassword/:token").get(getResetPasswordPage);
viewRouter.route("/signup").get(getSignupPage);
viewRouter.route("/plans").get(getPlansPage);
viewRouter.route("/profile").get(getProfilePage);


module.exports = viewRouter;
