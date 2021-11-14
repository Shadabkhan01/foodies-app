const mongoose = require("mongoose");
//const {DB_LINK} = require("../config/secret");
const DB_LINK = process.env.DB_LINK;
mongoose
    .connect(DB_LINK,{ useNewUrlParser: true, useUnifiedTopology: true}
)
.then((db)=> {
    console.log("db connected  !!");
});

let planSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : [40, "Your plan name is more than 40 characters !!"]
    },
    duration : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true
    },
    ratings : Number,
    discount : {
        type : Number,
        validate : {
            validator : function(){
                return this.discount < this.price;
            },
            message : "Discount must be less than actual price",
        }
    }
})

const plansModel = mongoose.model("planscollections", planSchema);

module.exports = plansModel;