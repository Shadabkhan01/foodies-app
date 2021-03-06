const mongoose = require("mongoose");
//const {DB_LINK} = require("../config/secret");
const crypto = require("crypto");
const { timeStamp } = require("console");
const DB_LINK = process.env.DB_LINK;
mongoose
    .connect(DB_LINK,{ useNewUrlParser: true, useUnifiedTopology: true}
)
.then((db)=> {
    console.log("db connected  !!");
});

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email:{
        type : String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minlength:[6, "Password must be greater than 6 characters"],
        required: true
    },
    confirmPassword:{
        type:String,
        minlength:[6, "Password must be greater than 6 characters"],
        validate:{
            validator: function(){
                return this.password == this.confirmPassword;
            },
            message:"password didn't matched!!"
        }
    },
    role:{
        type:String,
        enum: ["admin", "user", "restaurant owner", "delivery boy"],
        default: "user"
    },
    pImage:{
        type:String,
        default:"/images/users/default.png"
    },
    pwToken:String,
    tokenTime:Number,
    bookedPlanId:{
        type:String
    }
    
})

//it will run before create is called on userModel
userSchema.pre("save", function(){
    this.confirmPassword = undefined;
})

//forget password pe click kiya to ispe call

userSchema.methods.createResetToken = function(){
    //token banado
    let token = crypto.randomBytes(32).toString("hex");
    let time = Date.now() * 60 * 10 * 1000;
    //token time banado

    this.pwToken = token;
    this.tokenTime = time;
    //and set in current document
    //save
    return token;
}

userSchema.methods.resetPasswordHandler = function(password, confirmPassword){
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.pwToken = undefined;
    this.tokenTime = undefined;
}
const usersModel = mongoose.model("userscollections", userSchema);
module.exports = usersModel;