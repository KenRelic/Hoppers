const preloader = document.querySelector(".preloader");
const largeScreenNav = document.querySelector(".landingpage-top");
const mobileNav = document.querySelector(".sub-nav");

window.addEventListener("load", () => {
    preloader.style.display = "none";
    largeScreenNav.style.position = "fixed";
    mobileNav.style.position = "fixed";
})