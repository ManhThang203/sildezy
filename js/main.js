function Slidezy(select, option = {}) {
  this.container = document.querySelector(select);
  if (!this.container) {
    console.error(`Slider: ${this.container} dont next`);
    return;
  }

  this.opt = Object.assign(
    {
      items: 1,
      speed:300,
      loop: false,
    },
    option
  );
  this.slides = Array.from(this.container.children);

  this.currentIndex = this.opt.loop ? this.opt.items : 0;
  this._init();
  this._updatePosition();
}

Slidezy.prototype._init = function () {
  this.container.className = "slide-wrapper";

  this._creatTrack();
  this._createNavigation();
};

Slidezy.prototype._creatTrack = function () {
  this.track = document.createElement("div");
  this.track.className = "slide-track";

  if (this.opt.loop) {
    const cloneHead = this.slides
      .slice(-this.opt.items)
      .map((node) => node.cloneNode(true));
    const cloneTail = this.slides
      .slice(0, this.opt.items)
      .map((node) => node.cloneNode(true));

    this.slides = cloneHead.concat(this.slides.concat(cloneTail));
  }

  this.slides.forEach((slide) => {
    slide.className = "slide-item";
    slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
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
  // nếu là true thì return
  if (this._isAnimating) return;

  this._isAnimating = true;
  const maxIndex = this.slides.length - this.opt.items;
  this.currentIndex = Math.min(Math.max(this.currentIndex + step, 0), maxIndex);

  setTimeout(() => {
    if (this.opt.loop) {
      if (this.currentIndex <= 0) {
        this.currentIndex = maxIndex - this.opt.items;
      } else if (this.currentIndex >= maxIndex) {
        this.currentIndex = this.opt.items;
      }
      this._updatePosition(true);
    }
    this._isAnimating = false;
  }, this.opt.speed);

  this._updatePosition();
};

Slidezy.prototype._updatePosition = function (instant = false) {
  this.track.style.transition = instant ? "none" : `transform ${this.opt.speed}ms ease`;
  this.offset = `-${this.currentIndex * (100 / this.opt.items)}`;
  this.track.style.transform = `translateX(${this.offset}%)`;
};
// 4 5 6 1 2 3 4 5 6 1 2 3
// 0 1 2 3 4 5 6 7 8 9 10 11
