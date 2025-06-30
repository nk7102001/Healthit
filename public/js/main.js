function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}
 const images = [
      "/images/slide1.jpg",
      "/images/slide2.jpg",
      "/images/slide3.jpg",
      "/images/slide4.jpg"
    ];
    let index = 0;
    const sliderImg = document.getElementById("slider-image");
    const dots = document.querySelectorAll(".dot");

    setInterval(() => {
      index = (index + 1) % images.length;
      sliderImg.classList.remove("slide-image");
      void sliderImg.offsetWidth;
      sliderImg.src = images[index];
      sliderImg.classList.add("slide-image");

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }, 4000);
