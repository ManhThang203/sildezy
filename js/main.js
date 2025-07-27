function Slidezy(selector, options = {}) {
  this.container = document.querySelector(selector);
  if (!this.container) {
    console.error(`Slider: Container ${selector} not found!`);
    return;
  }

  this.opt = Object.assign({},options);

  this.slides = Array.from(this.container.children);
  this._init();
}

Slidezy.prototype._init = function(){
   this.container.className = "slidezy-wrapper";
   console.log(this.container);
   this._createTrack();
   this._createNavigation();
}

Slidezy.prototype._createTrack = function(){
   this.track = document.createElement("div");

   this.track.className = "slidezy-track";

   this.slides.forEach((slide) => {
      slide.className = "slidezy-slide";
      this.track.appendChild(slide);
   })
   this.container.appendChild(this.track);
}


Slidezy.prototype._createNavigation = function(){
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.className = "slidezy-prev";
    this.nextBtn.className = "slidezy-next";

    this.iconPrev = document.createElement("i")
    this.iconNext = document.createElement("i")

    this.iconPrev.className = "fa-solid fa-angle-left";
    this.iconNext.className = "fa-solid fa-angle-right";

    this.prevBtn.appendChild(this.iconPrev);
    this.nextBtn.appendChild(this.iconNext);

    this.container.append(this.prevBtn,this.nextBtn);

    this.prevBtn.onclick = () => this._moveSlide(-1);
    this.nextBtn.onclick = () => this._moveSlide(1);
}


Slidezy.prototype._moveSlide = function(step){
   console.log(step);
}

