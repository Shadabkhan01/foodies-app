// const usersDb = require("../Model/usersModel.json");
// const {v4: uuidv4} = require("uuid");
// const fs = require("fs");
// let path = require("path");

// let plansPath = path.join(__dirname, '..', 'Model', 'usersModel.json');

const userModel = require("../Model/usersModel");

async function getAllUser(req, res){
    try{
        let plans = await userModel.find();
        res.status(200).json({
            message:"successfully got all the users",
            data:plans
        })
    }
    catch(error){
        res.status(501).json({
            message:"failed to get all users",
            error
        })
    }
}
async function createUser(req, res){

    try{
        let userInfo = req.body;
        let user = await userModel.create(userInfo);
        res.status(200).json({
            message:"user created successfully",
            data: user
        })
    }
    catch(error){
        res.status(501).json({
            message:"failed to create a user",
            error:error.errors
        })
    }
    
}
async function getUserById(req, res){

    try{
        //let {id} = req.params;
        let id = req.id;
        let plan = await userModel.findById(id);
        res.status(200).json({
            message:"successfully got user by ID",
            data: plan
        })
    }
    catch(error){
        res.status(501).json({
            message:"Failed to get user by ID",
            error:error
        })
    }
}
async function updateUserById(req, res){
    try{
        //let {id} = req.params;
        let id = req.id;
        let updateObj = req.body.updateObj;
        let user = await userModel.findById(id);
        for(key in updateObj){
            user[key] = updateObj[key];
        }

        let updatedUser = await user.save();
        res.status(200).json({
            message:"successfully updated the user",
            data: updatedUser
        })

    }
    catch(error){
        res.status(501).json({
            message: "failed to update the user !!!",
            error: error
        })
    
    }
}
async function deleteUserById(req, res){
    
    try{
        //let {id} = req.params;
        let id = req.id;
        let deleteduser = await userModel.findByIdAndDelete(id);
        if(deleteduser){
            res.status(200).json({
                message:"successfuly deleted user by id",
                data: deleteduser
            }) 
        }
        else{
            res.status(200).json({
                message:"user not found"
            }) 
        }
        
    }
    catch(error){
        res.status(501).json({
            message:"failed to delete a plan by id",
            error:error
        }) 
    }
}
async function updateProfilePhoto(req, res){
    try{
        let file = req.file;
        console.log(file);
        let imagePath = file.destination+"/"+file.filename;
        imagePath = imagePath.substring(6);

        let id = req.id;
        let user = await userModel.findById(id);
        user.pImage = imagePath;
        await user.save({validateBeforeSave:false});
        res.json({
            message:"Profile photo updated !!",
            error
        })
    }
    catch(error){
        res.status(200).json({
            message:"Failed to update photo !!",
            error
        })
    }
}
module.exports.getAllUser = getAllUser;
module.exports.createUser = createUser;
module.exports.getUserById = getUserById;
module.exports.updateUserById = updateUserById;
module.exports.deleteUserById = deleteUserById;
module.exports.updateProfilePhoto = updateProfilePhoto;