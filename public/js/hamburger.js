let closeIcon = document.querySelector('.fa-cross');
let menuIcon = document.querySelector('.fa-bars');
let modal = document.querySelector('#modal');

menuIcon.addEventListener('click', function(){
	modal.style.top = '0';
});

closeIcon.addEventListener('click', function(){
	modal.style.top = '-110vh';
});
