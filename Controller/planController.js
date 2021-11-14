//const plans = require("../Model/plansModel.json");
//const {v4: uuidv4} = require("uuid");
//const fs = require("fs");
//let //path = require("path");

//let plansPath = path.join(__dirname, '..', 'Model', 'PlansModel.json');

const planModel = require("../Model/plansModel");

async function getAllPlans (req, res){
    try{
        let plans = await planModel.find();
        res.status(200).json({
            message:"Got all plans",
            data: plans
        })

    }
    catch(error){
        res.status(501).json({
            message:"Failed to get all plans",
            error: error
        })
    }    
    
}
async function createPlan(req, res){

    try{
        let sentPlan = req.body;
        let plan = await planModel.create(sentPlan);
        res.status(200).json({
            message:"plan created successfully",
            data: plan
        })
    }
    catch(error){
        res.status(501).json({
            message:"Failed to create a plan",
            error: error.errors.discount.message
        })
    }

    // plan.id = uuidv4();
    // plans.push(plan);
    // console.log(plansPath);
    // fs.writeFileSync(plansPath, JSON.stringify(plans));

    // res.status(201).json({
    //     message: "successfully create a plan !",
    //     data: plans
    // })

}
async function getPlanById(req, res){

    try{
        let {id} = req.params;
        let plan = await planModel.findById(id);
        res.status(200).json({
            message: "successfully got plan by id",
            data : plan
        })
    }
    catch(error){
        res.status(404).json({
            message: "Plan not found",
            error: error
        })
    }
    
}
async function updatePlanById(req, res){
    try{
        let id = req.params.id;
        let {updateObj} = req.body;
        // let updatedplan = await planModel.findByIdAndUpdate(id, updateObj, {new:true});
        let plan = await planModel.findById(id);
        for(key in updateObj){
            plan[key] = updateObj[key];
        }

        let updatedplan = await plan.save();

        res.status(200).json({
            message:"successfully updated the plan",
            data: updatedplan
        })

    }
    catch(error){
        res.status(501).json({
            message: "failed to update the plan !!!",
            error: error.errors.discount.message
        })
    }
    
}
async function deletePlanById(req, res){
    try{
        let {id} = req.params;
        let deletetedplan = await planModel.findByIdAndDelete(id);
        res.status(200).json({
            message:"successfully deleted a plan",
            data: deletetedplan
        })
    }
    catch(error){
        res.status(501).json({
            message: "failed to delete plan",
            error: error
        })
    }
    
}

module.exports.getAllPlans = getAllPlans;
module.exports.createPlan = createPlan;
module.exports.getPlanById = getPlanById;
module.exports.updatePlanById = updatePlanById;
module.exports.deletePlanById = deletePlanById;