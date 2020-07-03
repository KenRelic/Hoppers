let closeIcon = document.querySelector('.fa-cross');
let menuIcon = document.querySelector('.fa-bars');
let modal = document.querySelector('#modal');

menuIcon.addEventListener('click', function(){
	modal.style.top = '0';
});

closeIcon.addEventListener('click', function(){
	modal.style.top = '-110vh';
});

// First Slider
$('.slides')
	.not('slick-initialized')
	.slick({
	autoplay: true,
	autoplaySpeed: 3000,
	dots: true,
	prevArrow: ".prev",
	nextArrow: ".next"
});


// expand footer menu items

// Get the plus icons
var expandButtons = document.querySelectorAll('.open-close');
var plusIcons = document.querySelectorAll('.fa-plus');

// Get the close icons
var closeButtons = document.querySelectorAll('.fa-window-close');


// Get the footer menu
 var footerMenu = document.querySelectorAll('.footer-menu');
 console.log(footerMenu);

 var footerMenuList = document.getElementById('footer').getElementsByTagName('li');
 console.log(footerMenuList);

// hide footer menu list

function hideFooterMenuList() {
	for (footerMenuItem of footerMenuList) {
 	footerMenuItem.classList.add('hide');
 	footerMenuItem.classList.remove('show');
 }
}

hideFooterMenuList();

// Show footer menu list

function showFooterMenuList() {
	for (footerMenuItem of footerMenuList) {
 	footerMenuItem.classList.add('show');
 	footerMenuItem.classList.remove('hide');
 }
}

// Hide plus icon

function hidePlusIcons() {
	for (plusIcon of plusIcons){
			plusIcon.classList.add('hide');
			plusIcon.classList.remove('show');
		}
}

// Show plus icon

function showPlusIcons() {
	for (plusIcon of plusIcons){
			plusIcon.classList.add('show');
			plusIcon.classList.remove('hide');
		}
}
// Hide close icons
function hideCloseButton() {
	for (closeButton of closeButtons) {
	closeButton.classList.add('hide');
	closeButton.classList.remove('show');
}
}

hideCloseButton()

// Loop through all the plus icons and add event listeners
for (plusIcon of plusIcons) {
	plusIcon.addEventListener('click', function() {
		// hide all the expand buttons
		hidePlusIcons();

		
		//get the hidden menu items of the clicked portion
		var menuList = this.parentNode.parentNode.parentNode.childNodes[3].children;
		
		// Get current close icon
		var currentClose = this.parentNode.children[1];
		
		currentClose.classList.add('show');
		currentClose.classList.remove('hide');

		// Loop through the hidden items and display them
		for (menuItem of menuList) {
			menuItem.classList.remove('hide');
			menuItem.classList.add('show');
		}	
	})
}


// add event listener to close icons

for (closeButton of closeButtons) {
	closeButton.addEventListener('click', function() {
		for (plusIcon of plusIcons){
			plusIcon.classList.remove('hide');
			hideCloseButton();
			showPlusIcons();

			//get the hidden menu items
		var menuList = this.parentNode.parentNode.parentNode.childNodes[3].children;
		}
		hideFooterMenuList();
	})
}