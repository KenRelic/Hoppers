const landingTop = document.querySelector(".landingpage-top");
const subNav = document.querySelector(".sub-nav");


window.onscroll = () => {
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        landingTop.classList.add("hide");
        subNav.classList.remove("hide");
    } else if (document.body.scrollTop < 150 || document.documentElement.scrollTop < 150) {
        landingTop.classList.remove("hide");
        subNav.classList.add("hide");
    }
}