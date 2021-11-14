let buyPlanButtons = document.querySelectorAll(".signup-button a");
let allLis = document.querySelectorAll(".showcase-ul li");
const stripe = Stripe("pk_test_51JuMlzSIE9hLh2PJ1tdjN3esQa6SKGOVHOeFb4larq1sZ1dmWpow9uJeiqdyHfI5QUuNCZ68KCsI4rsjn7LX8h3Z00BPseHFlm");

for(let i=0; i < buyPlanButtons.length; i++){
    buyPlanButtons[i].addEventListener("click", async function(){
        
        try{
            
            if(allLis.length < 6){
                window.location.href = "/login";
            }
            else{
                let planId = buyPlanButtons[i].getAttribute("planId");
                let session = await axios.post("http://localhost:3000/api/booking/createPaymentSession", {planId:planId});
                let sessId = session.data.session.id;
                let result = await stripe.redirectToCheckout({sessionId : sessId});
                console.log(result);
            }
        }
        catch(error){
            alert(error.message);
        }
    })
}