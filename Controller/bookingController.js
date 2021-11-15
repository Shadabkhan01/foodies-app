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
    const END_POINT_KEY = process.env.END_POINT_KEY;
    // console.log("checkout complete ran");
    // console.log(res);
    const stripeSignature = req.headers['stripe-signature'];
    let event;
    try{
        event = stripeobj.webhooks.constructEvent(req.body, stripeSignature, END_POINT_KEY);
    }
    catch(err){
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log("event obect !!!");
    console.log(event);
}
module.exports.createPaymentSession = createPaymentSession;
module.exports.checkoutComplete = checkoutComplete;