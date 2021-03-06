const express = require("express");
//const fs = require("fs");
//const plans = require("../BackEnd/Model/plansModel.json");
//const usersDb = require("./Model/usersModel.json")

//const {v4 : uuidv4} = require("uuid");
const planRouter = require("./Router/planRouter");
const userRouter = require("./Router/userRouter");
const viewRouter = require("./Router/viewRouter");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bookingRouter = require("./Router/bookingRouter");


// middlewares

//it tracks incoming request and see if there is data in the request => the data will be fed in req.body
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

//view engine set
app.set("view engine", "pug");

//view path set
app.set("views", path.join(__dirname,"View"));
app.use("/api/booking", bookingRouter);
app.use("/api/plans", planRouter);
app.use("/api/user", userRouter);
app.use("", viewRouter);


let port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("listening at port 3000");
})