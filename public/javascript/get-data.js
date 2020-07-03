// let data;

// let url = "http://localhost:5050/api/jobs";
// async function fetchData(url) {
//     data = await fetch(url).then(response => response.json()).then(jobs => console.log(jobs))
//     console.log(data);
// }

// fetchData(url);


// const navbar = document.getElementById('nav-bar');
// const menuIcon = document.getElementById('menu-icon');

// menuIcon.addEventListener('click', toggleNavbarBg)

// function toggleNavbarBg() {
//     const navbar = document.getElementById('nav-bar');
//     if (navbar.style.backgroundColor == '') return navbar.style.backgroundColor = '#fff';
//     return navbar.style.backgroundColor = '';
// }

// window.onscroll = function () { toggleNavbarBgColorOnScroll() };

// function toggleNavbarBgColorOnScroll() {
//     if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
//         document.querySelector('.navbar-toggler-icon').style.color = "#000";
//         document.querySelector('.navbar-brand').style.color = "#000 !important";
//         document.getElementById("nav-bar").style.color = "#000 !important"
//         return document.getElementById("nav-bar").className = "navbar navbar-expand-lg navbar-light shadow-lg bg-white fixed-top";


//     } else {
//         document.querySelector('.navbar-toggler-icon').style.color = "#fff";
//         document.querySelector('.navbar-brand').style.color = "#fff !important";
//         document.getElementById("nav-bar").style.color = "#fff"
//         return document.getElementById("nav-bar").className = "navbar navbar-expand-lg navbar-light fixed-top";
//     }
// }