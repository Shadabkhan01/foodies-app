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
            success_url: 'http://localhost:3000/',
            cancel_url: 'http://localhost:3000/',
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

module.exports.createPaymentSession = createPaymentSession;