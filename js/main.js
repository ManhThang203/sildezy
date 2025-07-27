function Slidezy(select, option = {}) {
  this.container = document.querySelector(select);
  if (!this.container) {
    console.error(`Slider: ${this.container} dont next`);
    return;
  }

  this.opt = Object.assign({}, option);
  this.slides = Array.from(this.container.children);

  this.currentIndex = 0;
  this._init();
}

Slidezy.prototype._init = function () {
  this.container.className = "slide-wrapper";
  console.log(this.container);

  this._creatTrack();
  this._createNavigation();
};

Slidezy.prototype._creatTrack = function () {
  this.track = document.createElement("div");
  this.track.className = "slide-track";

  this.slides.forEach((slide) => {
    slide.className = "slide-item";
    this.track.appendChild(slide);
  });
  this.container.appendChild(this.track);
};

Slidezy.prototype._createNavigation = function () {
  this.preBtn = document.createElement("button");
  this.nextBtn = document.createElement("button");

  this.preBtn.className = "pre-slide";
  this.nextBtn.className = "next-slide";

  this.iconPre = document.createElement("i");
  this.iconNext = document.createElement("i");

  this.iconPre.className = "fa-solid fa-angle-left";
  this.iconNext.className = "fa-solid fa-angle-right";

  this.preBtn.appendChild(this.iconPre);
  this.nextBtn.appendChild(this.iconNext);

  this.container.append(this.preBtn, this.nextBtn);

  this.preBtn.onclick = () => this._moveSlide(-1);
  this.nextBtn.onclick = () => this._moveSlide(1);
};

Slidezy.prototype._moveSlide = function (step) {
  this.currentIndex = Math.min(
    Math.max(this.currentIndex + step, 0),
    this.slides.length - 3
  );
   this.offset = `-${this.currentIndex * (100 / 3)}`;
   this.track.style.transform = `translateX(${this.offset}%)`;
};
