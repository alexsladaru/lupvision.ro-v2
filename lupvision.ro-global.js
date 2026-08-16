/* ══════════════════════════════════════════════════════════════
   lupvision.ro — global JS (comportament partajat pe toate paginile)
   Nav mobil · header pe scroll · reveal · spotlight bento (o funcție
   parametrizată) · FAQ accordion · tech-strip marquee · smooth scroll.
   Toate handlerele sunt ghidate de existența elementului, deci fiecare
   pagină rulează doar ce i se aplică.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── rAF-throttled mousemove — max 1 paint/frame (evită layout thrashing) ── */
  function rafMove(el, fn) {
    let x = 0, y = 0, pending = false;
    el.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; fn(x, y); });
    }, { passive: true });
  }

  /* ── Mobile nav ── */
  const mb = document.getElementById('mb');
  const nav = document.getElementById('nav');
  if (mb && nav) {
    mb.addEventListener('click', () => {
      nav.classList.toggle('open');
      const b = mb.querySelectorAll('span');
      if (nav.classList.contains('open')) {
        b[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        b[1].style.opacity = '0';
        b[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
        document.body.classList.add('nav-open');
      } else {
        b.forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
        document.body.classList.remove('nav-open');
      }
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      mb.querySelectorAll('span').forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
      document.body.classList.remove('nav-open');
    }));
  }

  /* ── Header 3-state (transparent → blur → solid) + nav activ ──
     Un singur handler scroll, throttled cu rAF. ── */
  const hdrEl = document.getElementById('hdr');
  if (hdrEl) {
    const heroZone = document.getElementById('home');
    const secs = document.querySelectorAll('section[id]');
    const navLinks = nav ? nav.querySelectorAll('a') : [];

    function onScroll() {
      const sy = window.scrollY;
      /* header state */
      const heroBottom = heroZone ? heroZone.offsetTop + heroZone.offsetHeight : 0;
      const next = sy === 0 ? '' : (sy + 70 < heroBottom ? 'hdr-blur' : 'hdr-solid');
      const cur = hdrEl.classList.contains('hdr-blur') ? 'hdr-blur'
        : hdrEl.classList.contains('hdr-solid') ? 'hdr-solid' : '';
      if (next !== cur) {
        hdrEl.classList.remove('hdr-blur', 'hdr-solid');
        if (next) hdrEl.classList.add(next);
      }
      /* active nav */
      let curId = '';
      secs.forEach(s => { if (sy >= s.offsetTop - 80) curId = s.id; });
      navLinks.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + curId));
    }

    let scrollTick = false;
    window.addEventListener('scroll', () => {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => { scrollTick = false; onScroll(); });
    }, { passive: true });
    onScroll();
  }

  /* ── Reveal observer ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
  document.querySelectorAll('.rv').forEach(el => ro.observe(el));

  /* ── Bento spotlight — o singură funcție pentru toate grid-urile ──
     (înlocuiește 7 handlere aproape identice)
       gridSel  = containerul
       itemSel  = cardurile din interior
       opt.title       = selector copil care se luminează spre alb (opțional)
       opt.fade        = raza efectului (px, default 180)
       opt.clickThrough= selector link; click pe card → urmează href-ul ── */
  function spotlight(gridSel, itemSel, opt) {
    opt = opt || {};
    const grid = document.querySelector(gridSel);
    if (!grid) return;
    const items = Array.from(grid.querySelectorAll(itemSel));
    if (!items.length) return;
    const FADE = opt.fade || 180;
    const title = opt.title;
    const BASE = [200, 192, 184];

    function paint(mx, my) {
      items.forEach(el => {
        const r = el.getBoundingClientRect();
        const cx = Math.max(r.left, Math.min(mx, r.right));
        const cy = Math.max(r.top, Math.min(my, r.bottom));
        const d = Math.hypot(mx - cx, my - cy);
        const gi = d <= FADE ? (FADE - d) / FADE : 0;

        if (title) {
          const ccx = (r.left + r.right) / 2, ccy = (r.top + r.bottom) / 2;
          const gc = Math.max(0, 1 - Math.hypot(mx - ccx, my - ccy) / 380);
          const h = el.querySelector(title);
          if (h) h.style.color = `rgb(${Math.round(BASE[0] + (255 - BASE[0]) * gc)},${Math.round(BASE[1] + (255 - BASE[1]) * gc)},${Math.round(BASE[2] + (255 - BASE[2]) * gc)})`;
        }

        el.style.setProperty('--gx', (((mx - r.left) / r.width) * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (((my - r.top) / r.height) * 100).toFixed(1) + '%');
        el.style.setProperty('--gi', gi.toFixed(3));
      });
    }

    function reset() {
      items.forEach(el => {
        if (title) {
          const h = el.querySelector(title);
          if (h) { h.style.transition = 'color .5s ease'; h.style.color = ''; }
        }
        el.style.setProperty('--gi', '0');
      });
      if (title) {
        setTimeout(() => items.forEach(el => {
          const h = el.querySelector(title);
          if (h) h.style.transition = 'color .15s ease';
        }), 500);
      }
    }

    rafMove(grid, paint);
    grid.addEventListener('mouseleave', reset);

    if (opt.clickThrough) {
      items.forEach(card => card.addEventListener('click', e => {
        if (e.target.closest(opt.clickThrough)) return;
        const link = card.querySelector(opt.clickThrough);
        if (link) window.location.href = link.href;
      }));
    }
  }

  spotlight('.why-stats', '.wst');
  spotlight('.srvs-g', '.srv', { title: '.srv-h', clickThrough: '.srv-more' });
  spotlight('.pr-g', '.pr', { title: '.pr-name' });
  spotlight('.proj-g', '.pj', { title: '.pj-name' });
  spotlight('.fq-list', '.fq-item', { fade: 200 });

  /* ── FAQ accordion ── */
  const fqBtns = document.querySelectorAll('.fq-q');
  fqBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      const body = this.nextElementSibling;
      fqBtns.forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });

  /* ── Tech strip: dublează track-ul, aliniază fade-ul, marquee ── */
  const tsTrack = document.getElementById('ts-track');
  if (tsTrack) tsTrack.innerHTML += tsTrack.innerHTML;   /* dublare pentru loop seamless */

  (function () {
    const wrap = document.querySelector('.ts-wrap');
    const logo = document.querySelector('.logo');
    const cta = document.querySelector('.hdr-r .btn-blue');
    if (!wrap || !logo || !cta) return;
    function align() {
      const fl = logo.getBoundingClientRect().left;
      const fr = window.innerWidth - cta.getBoundingClientRect().right;
      wrap.style.setProperty('--ts-fl', Math.max(0, fl + 80) + 'px');
      wrap.style.setProperty('--ts-fr', Math.max(0, fr + 80) + 'px');
    }
    align();
    window.addEventListener('resize', align);
  })();

  (function () {
    const track = document.querySelector('.ts-track');
    const wrap = document.querySelector('.ts-wrap');
    if (!track || !wrap) return;
    const dir = -1;
    let x = 0;
    let last = null;
    let half = track.scrollWidth / 2;   /* cache — citit o dată, nu la fiecare frame */
    window.addEventListener('resize', () => { half = track.scrollWidth / 2; }, { passive: true });
    function tick(ts) {
      if (last === null) last = ts;
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      const speed = half / 48;
      x += dir * speed * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ── Smooth scroll pentru anchor-uri ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
