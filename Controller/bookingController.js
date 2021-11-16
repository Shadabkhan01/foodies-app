const plansModel = require("../Model/plansModel");
const usersModel = require("../Model/usersModel");
const bookingModel = require("../Model/bookingModel");
const stripe = require("stripe");
const stripeobj = stripe("sk_test_51JuMlzSIE9hLh2PJh86cNDrJmX1H1Ao1hBCiAbEC3e6mFSSYcGSYfWUEo1z28d4NOKcuJCIExwpWc4sfWZE97opp00Hu3QuliZ");

async function createPaymentSession(req, res){
    try{
        const userId = req.id;
        const {planId} = req.body;
        const plan = await plansModel.findById(planId);
        const user = await usersModel.findById(userId);
        //session object
        const session = await stripeobj.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email:user.email,
            client_reference_id: planId,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                    name: plan.name,
                    },
                    unit_amount: plan.price*100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://foodies7.herokuapp.com/',
            cancel_url: 'https://foodies7.herokuapp.com/',
        })
        res.json({
            session
        })

    }
    catch(error){
        res.json({
            message:"Failed to create a payment session",
            error
        })

    }
}

async function checkoutComplete(req, res){
    try{
        const END_POINT_KEY = process.env.END_POINT_KEY;
        const stripeSignature = req.headers['stripe-signature'];

        // console.log("checkout complete ran");
        // console.log(res); 

        console.log("endpoint key :", END_POINT_KEY);
        console.log("stripesign", stripeSignature);
        console.log("req.body=> ", req.body);

        if(req.body.data.type == "checkout.session.completed"){
            const userEmail = req.body.data.object.customer_email;
            const planId = req.body.data.object.client_reference_id;
            await createNewBooking(userEmail, planId);
        }
    }
    
    catch(error){
        res.json({
            error
        })
    }
}
async function createNewBooking(userEmail, planId){
    try{
        const user = await usersModel.findOne({email:userEmail});
        const plan = await plansModel.findById(planId);

        const userId = user["_id"];

        if(user.bookedPlanId == undefined){
            const bookingOrder = {
                userId:userId,
                bookedPlans:[{planId:planId, planName:plan.name, currentPrice:plan.price}]
            }
            const newBookingOrder = await bookingModel.create(bookingOrder);
            user.bookedPlanId = newBookingOrder["_id"];
            await user.save({validateBeforeSave:false});
        }
        else{
            //already bought some plans
            const newBookedPlan = {
                planId : planId,
                planName : plan.name,
                currentPrice: plan.price,

            }
            const userBookingObject = await bookingModel.findById(user.bookedPlanId);
            userBookingObject.bookedPlans.push(newBookedPlan);
            await userBookingObject.save();
        }

    }
    catch(error){
        res.json({
            error
        })
    }
    // console.log("inside create new booking !!!");
    // console.log(userEmail);
    // console.log(planId);
}
module.exports.createPaymentSession = createPaymentSession;
module.exports.checkoutComplete = checkoutComplete;