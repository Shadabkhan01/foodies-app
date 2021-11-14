let email = document.querySelector("#email");
let pw = document.querySelector("#pw");
let loginBtn = document.querySelector(".loginBtn");
let message = document.querySelector("#message");
let forgetPwd = document.querySelector(".forgetPassword");
let signupBtn = document.querySelector(".signupClick");

forgetPwd.addEventListener("click", async  function(e){
    try{
        e.preventDefault();
        if(email.value){
            console.log("inside forget password click");
            let obj = await axios.post("http://localhost:3000/api/user/forgetpassword", {email:email.value});
            console.log(obj);
        }
        else{
            alert("Please Enter your email !!");
        }
    }
    catch(error){
        console.log(error);
    }
})

loginBtn.addEventListener("click", async function(e){

    try{
        e.preventDefault();//prevent page refresh
        console.log("inside login.js");
        if(email.value && pw.value){
            let obj =await axios.post("http://localhost:3000/api/user/login", {email:email.value, password:pw.value});
            console.log(obj);
            if(obj.data.data){
                window.location.href = "/";
            }
            else{
                message.innerHTML = obj.data.message;
            }
            

        }
        
    }
    catch(error){
        console.log(error);
    }
    

})

signupBtn.addEventListener("click", function(e){
    e.preventDefault();
    window.location.href = "/signup";
})