/* ============================================================
   mustafa.design — Coming Soon  —  main.js
   Cursor image trail + outlined kinetic marquee.
   ============================================================ */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Hide the loader reveal ---------- */
  function boot() {
    var reveal = document.querySelector(".reveal");
    if (reveal) gsap.to(reveal, { opacity: 0, duration: 0.8, ease: "power2.out", onComplete: function () { reveal.style.display = "none"; } });
  }

  /* ---------- Cursor image trail ---------- */
  function initTrail() {
    var content = document.querySelector(".content");
    if (!content) return;

    // The centred main image is part of the trail cluster: it sits still behind
    // the heading at load, then becomes interactive once the trail activates.
    var main = document.querySelector(".main-img");
    var trailImgs = Array.prototype.slice.call(content.querySelectorAll(".content__img"));
    var images = main ? [main].concat(trailImgs) : trailImgs;

    // On touch / reduced motion the trail is pointless — hide it and show the
    // main centred image instead (the graceful fallback for those devices).
    if (prefersReduced || !finePointer) return;

    var MathUtils = {
      lerp: function (a, b, n) { return (1 - n) * a + n * b; },
      distance: function (x1, y1, x2, y2) { return Math.hypot(x2 - x1, y2 - y1); }
    };

    var getMousePos = function (ev) {
      var posx = 0, posy = 0;
      if (ev.pageX || ev.pageY) { posx = ev.pageX; posy = ev.pageY; }
      else if (ev.clientX || ev.clientY) { posx = ev.clientX; posy = ev.clientY; }
      return { x: posx, y: posy };
    };

    var mousePos = { x: innerWidth / 2, y: innerHeight / 3 };
    // Start last/cache at the same spot as the cursor so nothing fires at load —
    // the centered main image stays still until genuine mouse movement.
    var lastMousePos = { x: mousePos.x, y: mousePos.y };
    var cacheMousePos = { x: mousePos.x, y: mousePos.y };

    window.addEventListener("mousemove", function (ev) { mousePos = getMousePos(ev); }, { passive: true });

    var getMouseDistance = function () {
      return MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
    };

    function Image(el) {
      this.DOM = { el: el };
      this.isMain = el.classList.contains("main-img");
      this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
      this.getRect();
      this.initEvents();
    }
    Image.prototype.initEvents = function () {
      window.addEventListener("resize", this.resize.bind(this));
    };
    Image.prototype.resize = function () {
      // The main image keeps its centered/visible state on resize (it's shown at
      // load and never hidden by the trail logic). Occupy it towards the end of
      // rotation so it isn't the first frame to depart the center.
      if (this.isMain) {
        gsap.set(this.DOM.el, { x: 0, y: 0, scale: 1 });
        this.getRect();
        return;
      }
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    Image.prototype.getRect = function () {
      this.rect = this.DOM.el.getBoundingClientRect();
    };
    Image.prototype.isActive = function () {
      return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
    };

    var trailImages = images.map(function (img) { return new Image(img); });
    var imagesTotal = trailImages.length;
    var imgPosition = 0;
    var zIndexVal = 1;
    var threshold = 100;

    function showNextImage() {
      var img = trailImages[imgPosition];
      gsap.killTweensOf(img.DOM.el);

      gsap.timeline()
        .set(img.DOM.el, {
          startAt: { opacity: 0, scale: 1 },
          opacity: 1,
          scale: 1,
          zIndex: zIndexVal,
          x: cacheMousePos.x - img.rect.width / 2,
          y: cacheMousePos.y - img.rect.height / 2
        }, 0)
        .to(img.DOM.el, 0.9, { ease: "expo", x: mousePos.x - img.rect.width / 2, y: mousePos.y - img.rect.height / 2 }, 0)
        .to(img.DOM.el, 1, { ease: "power1", opacity: 0 }, 0.4)
        .to(img.DOM.el, 1, { ease: "quint", scale: 0.2 }, 0.4);
    }

    function render() {
      var distance = getMouseDistance();
      cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

      if (distance > threshold) {
        showNextImage();
        ++zIndexVal;
        imgPosition = imgPosition < imagesTotal - 1 ? imgPosition + 1 : 0;
        lastMousePos = mousePos;
      }

      var isIdle = true;
      for (var i = 0; i < trailImages.length; i++) {
        if (trailImages[i].isActive()) { isIdle = false; break; }
      }
      if (isIdle && zIndexVal !== 1) { zIndexVal = 1; }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* ---------- Outlined kinetic marquee (right → left) ---------- */
  function initMarquee() {
    var track = document.querySelector(".track");
    if (!track) return;
    if (prefersReduced) return;

    // Duplicate once so the -50% loop is seamless.
    track.innerHTML += track.innerHTML;

    gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 26,
      repeat: -1
    });
  }

  /* ---------- Boot ---------- */
  function start() {
    boot();
    initTrail();
    initMarquee();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
