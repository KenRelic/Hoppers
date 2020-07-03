const people = document.querySelector(".people");
const options = document.querySelector(".footer-mobile-options");
const plusBtn = document.querySelector(".plus-btn");

options.addEventListener("click",  (e) => {
    console.log(e.target);
    if (e.target.classList.contains("plus-btn")) {
        console.log(e.target.nextElementSibling);
        if (e.target.parentElement.nextElementSibling.classList.contains("hide")) {
            e.target.parentElement.nextElementSibling.classList.remove("hide");
            e.target.innerHTML = "-";
        }else {
            e.target.parentElement.nextElementSibling.classList.add("hide");
            e.target.innerHTML = "+";
        }
    } 
});

