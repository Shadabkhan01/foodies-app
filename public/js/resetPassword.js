let pw = document.querySelector("#pword");
let cpw = document.querySelector("#cpword");
let message = document.querySelector("#messagePw");
let updateBtn = document.querySelector(".updateBtn");

updateBtn.addEventListener("click", async function(e){
    try{
        e.preventDefault();
        if(pw.value==cpw.value){
            let token = document.URL.split("/");
            token = token[token.length-1];
            console.log(token);
            let obj = await axios.patch(`https://foodies7.herokuapp.com/api/user/resetpassword/${token}`, {password:pw.value, confirmPAssword:cpw.value});
            console.log(obj);
            pw.value = "";
            cpw.value = "";
            if(obj.data.data){
                message.innerHTML = obj.data.message;
                window.location.href = "/";

            }else{
                message.innerHTML = obj.data.message;
            }
        }else{
            message.innerHTML = "Password didn't Matched";
            pw.value = "";
            cpw.value = "";
        }

    }
    catch(error){
        console.log(error);
    }
})