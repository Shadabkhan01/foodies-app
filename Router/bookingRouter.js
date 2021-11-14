const express = require("express");
const { protectRoute } = require("../Controller/authController");
const { createPaymentSession, checkoutComplete } = require("../Controller/bookingController");


const bookingRouter = express.Router();

bookingRouter.post("/createPaymentSession", protectRoute, createPaymentSession );
boookingRouter.post("/checkoutComplete", checkoutComplete);
module.exports = bookingRouter;