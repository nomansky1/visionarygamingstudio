// visionarygamingstudio.com: three small jobs, none of which the page needs in order to be read.
//   1. a slow field of voxel stars behind the page (the emblem's violet, teal and silver)
//   2. the hero phone plays only while it is on screen
//   3. after the LEVIATHAN sign-up posts and comes back, say so instead of showing the form again
(function () {
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. voxel sky ---------------------------------------------------------------------------------
  var c = document.getElementById('sky');
  if (c && c.getContext) {
    var g = c.getContext('2d');
    var COLORS = ['165,127,255', '65,217,200', '230,226,240'];
    var W = 0, H = 0, dpr = 1, stars = [];
    var seed = function () {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = c.width = Math.round(innerWidth * dpr);
      H = c.height = Math.round(innerHeight * dpr);
      c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
      var n = Math.round(innerWidth * innerHeight / 6500);
      stars = [];
      for (var i = 0; i < n; i++) {
        var r = Math.random();
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          s: Math.round((r < .8 ? 1.5 : r < .96 ? 2.5 : 3.5) * dpr),   // square: these are voxels, not dots
          c: COLORS[r < .45 ? 2 : r < .75 ? 0 : 1],
          a: .12 + Math.random() * .45, p: Math.random() * 6.283, v: .15 + Math.random() * .35
        });
      }
    };
    var draw = function (t) {
      g.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = still ? 1 : .55 + .45 * Math.sin(t * .0012 * s.v + s.p);
        var y = still ? s.y : (s.y - t * .006 * s.v * dpr) % H;
        if (y < 0) y += H;
        g.fillStyle = 'rgba(' + s.c + ',' + (s.a * tw).toFixed(3) + ')';
        g.fillRect(Math.round(s.x), Math.round(y), s.s, s.s);
      }
    };
    seed();
    window.addEventListener('resize', function () { seed(); if (still) draw(0); });
    if (still) draw(0);
    else {
      var last = 0;
      var loop = function (t) {
        // ~30 fps is plenty for a drift this slow, and it halves the cost on a phone
        if (!document.hidden && t - last > 32) { draw(t); last = t; }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  // 2. the hero phone ------------------------------------------------------------------------------
  var v = document.querySelector('.handset video');
  if (v) {
    if (still) { v.removeAttribute('autoplay'); v.pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }).observe(v);
    }
  }

  // 3. back from the sign-up -------------------------------------------------------------------------
  if (/[?&]list=joined\b/.test(location.search)) {
    var f = document.querySelector('.notify'), j = document.getElementById('joined');
    if (f && j) { f.hidden = true; j.hidden = false; }
  }
})();
