let names = ["EVERYONE", "DEVELOPERS", "FITNESS FREAKS", "VEGANS"];

let changingText = document.querySelector("#changing-text");
let idx = 0;
let word = names[idx];
let text = "";
let isDeleting = false;

let showcase = document.querySelector(".showcase");
let navlinks = document.querySelector(".navlinks");
let details = document.querySelector(".detailshead");
let reviews = document.querySelector(".reviews");

details.addEventListener("click", function(){
    window.scrollTo(0, 2700);  
})

reviews.addEventListener("click", function(){
    window.scrollTo(0, 1950);  
})



window.addEventListener("load", function(){

    typeWords();
    window.addEventListener("scroll", function(){
        let {bottom} = showcase.getBoundingClientRect();
        if(bottom <= 0){
            navlinks.classList.add("headerposition");
        }
        else{
            if(navlinks.classList.contains("headerposition")){
                navlinks.classList.remove("headerposition");
            }
        }
    })
})





function typeWords(){
    if(isDeleting && text.length == 0){
        idx = (idx+1) % names.length;
        word = names[idx];
        isDeleting = false;
    }

    if(text.length == word.length){
        isDeleting = true;
    }

    text = isDeleting ? word.substring(0, text.length-1) : word.substring(0, text.length+1);
    changingText.innerHTML = text;
    setTimeout(typeWords, text.length == word.length ? 1000:100);
}