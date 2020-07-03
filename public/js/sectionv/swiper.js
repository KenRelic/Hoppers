

const swiperClass = document.querySelector(".swiper-container");

const swipperWrapper = document.querySelector(".swiper-wrapper");
const notMobile = screen.width >= 1024;
     
//  Chandes The Image Slider's Display 
const changeClass = () => {
    if (notMobile && swiperClass.classList.contains("swiper-container")) {
        console.log(screen.width);
        swiperClass.classList.remove("swiper-container");
        swipperWrapper.classList.add("laptop");
        swipperWrapper.classList.remove("swiper-wrapper");

    }
    else if (!notMobile && !(swiperClass.classList.contains("swiper-container"))) {
        console.log(screen.width);
        swiperClass.classList.add("swiper-container");
        swipperWrapper.classList.add("swiper-wrapper");
       swipperWrapper.classList.remove("laptop");   
    }
}

changeClass();

// controls the image slider
var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows : true,
    },
    loop: true,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
});
  
