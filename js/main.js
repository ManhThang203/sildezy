function Slidezy(select, option = {}) {
  this.container = document.querySelector(select);
  if (!this.container) {
    console.error(`Slider: ${this.container} dont next`);
    return;
  }

  this.opt = Object.assign(
    {
      items: 1,
      speed: 300,
      loop: false,
      nav: true,
      control: true,
      controlText: ["fa-solid fa-angle-left", "fa-solid fa-angle-right"],
      prevButton: null,
      nextButton: null,
      slideBy:1
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

  this._createContent();
  this._creatTrack();
  if (this.opt.control) {
    this._createControl();
  }

  if (this.opt.nav) {
    this._creatNav();
  }
};

Slidezy.prototype._createContent = function () {
  this.content = document.createElement("div");
  this.content.className = "slidezy-content";
  this.container.appendChild(this.content);
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
  this.content.appendChild(this.track);
};

Slidezy.prototype._createControl = function () {
  // Nút Prev Button
  this.preBtn = this.opt.prevButton
    ? document.querySelector(this.opt.prevButton)
    : document.createElement("button");
   // Nút Next Button
  this.nextBtn = this.opt.nextButton
    ? document.querySelector(this.opt.nextButton)
    : document.createElement("button");

  if (!this.opt.prevButton) {
    this.preBtn.className = "pre-slide";
    this.iconPre = document.createElement("i");
    this.iconPre.className = this.opt.controlText[0];
    this.preBtn.appendChild(this.iconPre);
    this.content.append(this.preBtn);
  }
  if (!this.opt.nextButton) {
    this.nextBtn.className = "next-slide";
    this.iconNext = document.createElement("i");
    this.iconNext.className = this.opt.controlText[1];
    this.nextBtn.appendChild(this.iconNext);
    this.content.append(this.nextBtn);
  }
 
  const stepSize = this.opt.slideBy === "page" ? this.opt.items : this.opt.slideBy;
  this.preBtn.onclick = () => this._moveSlide(-stepSize);
  this.nextBtn.onclick = () => this._moveSlide(stepSize);
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
        this._updatePosition(true);
      } else if (this.currentIndex >= maxIndex) {
        this.currentIndex = this.opt.items;
        this._updatePosition(true);
      }
    }
    this._isAnimating = false;
  }, this.opt.speed);

  this._updatePosition();
};

Slidezy.prototype._creatNav = function () {
  this.navWrapper = document.createElement("div");
  this.navWrapper.className = "slidezy-nav";
  // Nếu mà loop thì là số item * 2 mà khi loop (this.slides.length = 12)
  // lên trong đoạn này khi loop hay không loop thì đều là 6
  const slideCouter =
    this.slides.length - (this.opt.loop ? this.opt.items * 2 : 0);
  // số trang sẽ bằng số slide chia số item hiển thị thì ra số page
  // làm tròn trên
  const pageCount = Math.ceil(slideCouter / this.opt.items);

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement("button");
    dot.className = "slidezy-dot";

    if (i === 0) {
      dot.classList.add("active");
    }

    dot.onclick = () => {
      this.currentIndex = this.opt.loop
        ? i * this.opt.items + this.opt.items
        : i * this.opt.items;
      this._updatePosition();
    };

    this.navWrapper.appendChild(dot);
  }

  this.container.appendChild(this.navWrapper);
};

Slidezy.prototype._updateNav = function () {
  let realIndex = this.currentIndex;

  if (this.opt.loop) {
    const slideCount = this.slides.length - this.opt.items * 2;
    realIndex = (this.currentIndex - this.opt.items + slideCount) % slideCount;
  }

  const pageIndex = Math.floor(realIndex / this.opt.items);
  const dots = Array.from(this.navWrapper.children);
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === pageIndex);
  });
};

Slidezy.prototype._updatePosition = function (instant = false) {
  this.track.style.transition = instant
    ? "none"
    : `transform ${this.opt.speed}ms ease`;
  this.offset = `-${this.currentIndex * (100 / this.opt.items)}`;
  this.track.style.transform = `translateX(${this.offset}%)`;

  if (this.opt.nav && !instant) {
    this._updateNav();
  }
};
// 4 5 6 1 2 3 4 5 6 1 2 3
// 0 1 2 3 4 5 6 7 8 9 10 11
