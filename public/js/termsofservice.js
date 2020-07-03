/////////// mobileMenu

function mobileMenu() {
    var toggler = document.querySelector(".flex-ul");
    if (toggler.classList.contains('responsive')) {
        toggler.classList.remove('responsive');
        document.querySelector('.fa-close').style.display = 'none';
        document.querySelector('.fa-bars').style.display = 'block';
    } else {
        toggler.classList.add('responsive');
        document.querySelector('.fa-close').style.display = 'block';
        document.querySelector('.fa-bars').style.display = 'none';
    }
}
