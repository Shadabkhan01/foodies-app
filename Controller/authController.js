const usersModel = require("../Model/usersModel");
const jwt = require("jsonwebtoken");
//const { SECRET_KEY, GMAIL_ID, GMAIL_PW } = require("../config/secret");
const nodemailer = require("nodemailer");

const SECRET_KEY = process.env.SECRET_KEY;
const GMAIL_ID = process.env.GMAIL_ID;
const GMAIL_PW = process.env.GMAIL_PW;


async function sendEmail(message){
    try{
        const transporter = nodemailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.com",
            auth: {
              user: GMAIL_ID,
              pass: GMAIL_PW
            }
          });

        let response = await transporter.sendMail({
            from: message.from, // sender address
            to: message.to, // list of receivers
            subject: message.subject, // Subject line
            text: message.text, // plain text body

          }

        );
        return response;
        console.log("email sent");
    }
    catch(error){
        return error;
    }
}


async function signup(req, res){

    try{
        let user = req.body;
        let newUser = await usersModel.create({
            name: user.name,
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword,
            role: user.role
        })
        //console.log(newUser);
        res.status(201).json({
            message: "Successfully signed up !!",
            data: newUser
        })
    }
    catch(error){
        res.status(501).json({
            message:"Failed to sign up !!!",
            error:error
        })
    }
}

async function login(req, res){
    try{
        let {email, password} = req.body;
        //console.log(email,password);
        let loggedInUser = await usersModel.find({email:email});
        //console.log(loggedInUser);
        if(loggedInUser.length){
            let user = loggedInUser[0];
            if(user.password== password){
                const token = jwt.sign({id:user["_id"]}, SECRET_KEY);
                res.cookie("jwt", token, {httpOnly:true});
                res.status(200).json({
                    message:"Logged in sucessfully !!!",
                    data:loggedInUser[0],
                })
            }
            else{
                res.status(200).json({
                    message:"Email and password didn't matched"
                })
            }
            
        }
        else{
            res.status(200).json({
                message:"No user found, Signup first"
            })
        }
    }
    catch(error){
        res.status(200).json({
            message:"login failed !!!",
            error
        })
    }
}

async function isLoggedIn(req, res, next){
    try{
        let token = req.cookies.jwt;
        const payload = jwt.verify(token, SECRET_KEY);
        if(payload){
            //logged in hai
            let user = await usersModel.findById(payload.id);
            req.name = (user.name).toUpperCase();
            req.user = user;
            next();

        }
        else{
            //logged in nahi hai
            next();
        }
    }
    catch(error){
        /* res.status(200).json({
            message:'error while loggin',
            error
        }) */
        next();
    }
}

async function logout(req, res){
    try{
        res.clearCookie("jwt");
        res.redirect("/");
    }
    catch(error){
        res.status(501).json({
            error
        })
    }
}
async function protectRoute(req, res, next){
    try{
        // const token = req.headers.authorization.split(" ").pop();
        // console.log(token);
        const token = req.cookies.jwt;
        console.log("Inside protectRoute function");
        const payload = jwt.verify(token, SECRET_KEY);
        console.log(payload);
        if(payload){
            req.id = payload.id;
            next();
        }
        else{
            res.status(501).json({
                message:"please log in !!!"
            })
        }
    }
    catch(error){
        res.status(501).json({
            message:"please log in !!",
            error
        })
    }
}

async function isAuthorized(req, res, next){
    try{
        let id = req.id;
        let user = await usersModel.findById(id);
        console.log(user);
        if(user.role=="admin"){
            next();
        }
        else{
            res.status(200).json({
                message:"You don't have admin rights"
            })
        }
    }
    catch(error){
        res.status(501).json({
            message:"You are not authorized !!!",
            error
        })
    }
}
async function forgetPassword(req, res){
    try{
        //email nikaldo
        let {email} = req.body;
        console.log(email);
        let user = await usersModel.findOne({email:email});
        console.log(user);
        if(user){
            //pwtoken
            //timeset
            let token = user.createResetToken();
            console.log(token);
            let updatedUser = await user.save({validateBeforeSave:false});
            //console.log(updatedUser);
            let resetLink = `https://foodies7.herokuapp.com/resetpassword/${token}`;
            let message = {
                from:"sksksksksk01@gmail.com",
                to:email,
                subject:"Reset Password",
                text:resetLink
            }
            let response=await sendEmail(message);
            res.json({
                message:"Reset link is sent to mail",
                resetLink
            })
        }
        else{
            res.status(200).json()({
                message:"User not found!! Please Sign Up first "
            })
        }
    }
    catch(error){
        res.status(501).json({
            message:"failed",
            error
        })
    }
}

async function resetPassword(req, res){
    try{
        console.log("inside rsetpswd")
        const token = req.params.token;
        const{password, confirmPassword} = req.body;
        const user = await usersModel.findOne({
            pwToken:token,
            tokenTime:{ $gt: Date.now()}
        })
        console.log(user);
        console.log(password, confirmPassword);
        if(user){
            user.resetPasswordHandler(password, confirmPassword);
            await user.save();
            res.status(200).json({
                message:"Password Reset successful !"
            })
        }
        else{
            res.status(200).json({
                message:"Password Reset Link Expired !"
            })
        }

    }
    catch(error){
        res.status(200).json({
            message:"Failed to reset password"
        })
    }
}


module.exports.signup = signup;
module.exports.login = login;
module.exports.logout = logout;
module.exports.protectRoute = protectRoute;
module.exports.isAuthorized = isAuthorized;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;
module.exports.isLoggedIn=isLoggedIn;