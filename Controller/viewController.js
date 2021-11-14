const plansModel = require("../Model/plansModel");

// function getDemoPage(req, res){
//     //send Demo  page to client
//     res.render("base.pug");

// }

async function getHomepage(req, res){
    try{
        let plan = await plansModel.find();
        plan = plan.splice(0, 3);
        res.render("homepage.pug", {name:req.name, plans:plan});
    }
    catch(error){
        console.log(error);
    }
    
}
function getloginPage(req, res){
    res.render("login.pug", {name:req.name});
}
function getResetPasswordPage(req, res){
    res.render("resetPassword.pug");
}
function getSignupPage(req, res){
    res.render("signup.pug", {name:req.name});
}

async function getPlansPage(req, res){
    try{
        let plan = await plansModel.find();
        
        res.render("plans.pug", {name:req.name, plans:plan});
    }
    catch(error){
        console.log(error);
    }
    
}

async function getProfilePage(req, res){
    res.render("profile.pug", {name:req.name, user:req.user});
}

//module.exports.getDemoPage=getDemoPage;
module.exports.getHomepage=getHomepage;
module.exports.getloginPage=getloginPage;
module.exports.getSignupPage=getSignupPage;
module.exports.getPlansPage=getPlansPage;
module.exports.getProfilePage=getProfilePage;
module.exports.getResetPasswordPage=getResetPasswordPage;
