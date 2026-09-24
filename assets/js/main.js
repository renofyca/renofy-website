/* RENOFY — shared behaviors: reveal, counters, back-to-top,
   magnetic buttons, cursor glow, live ticker, accordion,
   before/after sliders, reviews carousel, hash auto-expand. */
(function(){
  'use strict';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !prefersReduced){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ ro.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('.count[data-to]');
  function animateCount(el){
    var to = parseFloat(el.getAttribute('data-to'));
    var dec = parseInt(el.getAttribute('data-dec')||'0',10);
    var suffix = el.getAttribute('data-suffix')||'';
    var dur = 1600, t0 = null;
    function tick(t){
      if(!t0) t0 = t;
      var p = Math.min((t-t0)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = (to*eased).toFixed(dec) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window && !prefersReduced){
    var co = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ animateCount(e.target); co.unobserve(e.target); }
      });
    },{threshold:.4});
    counters.forEach(function(el){ co.observe(el); });
  } else {
    counters.forEach(function(el){
      var to=parseFloat(el.getAttribute('data-to')),dec=parseInt(el.getAttribute('data-dec')||'0',10);
      el.textContent = to.toFixed(dec)+(el.getAttribute('data-suffix')||'');
    });
  }

  /* ---------- back to top + header handled in layout.js ---------- */
  var toTop = document.getElementById('to-top');
  if(toTop){
    window.addEventListener('scroll',function(){
      toTop.classList.toggle('show', window.scrollY > 700);
    },{passive:true});
    toTop.addEventListener('click',function(){ window.scrollTo({top:0,behavior:prefersReduced?'auto':'smooth'}); });
  }

  /* ---------- magnetic buttons (desktop only) ---------- */
  if(finePointer && !prefersReduced){
    document.querySelectorAll('.magnetic').forEach(function(btn){
      btn.addEventListener('mousemove',function(e){
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        btn.style.transform = 'translate('+(x*.22)+'px,'+(y*.28)+'px)';
      });
      btn.addEventListener('mouseleave',function(){ btn.style.transform=''; });
    });

    /* ambient cursor glow */
    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    var gx=innerWidth/2, gy=innerHeight/2, tx=gx, ty=gy;
    addEventListener('mousemove',function(e){ tx=e.clientX; ty=e.clientY; });
    (function loop(){
      gx += (tx-gx)*.08; gy += (ty-gy)*.08;
      glow.style.transform = 'translate('+(gx-170)+'px,'+(gy-170)+'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- live project ticker ---------- */
  var ticker = document.getElementById('live-ticker');
  if(ticker && !prefersReduced){
    var items = [
      '<b>Basement finished</b> in Mississauga · 2 days ago',
      '<b>★★★★★</b> “Flawless kitchen, zero dust.” — Priya, Vaughan',
      '<b>New project started</b> in Etobicoke · today',
      '<b>Bathroom reveal</b> in North York · 5 days ago',
      '<b>★★★★★</b> “They finished two days early.” — Marcus, Scarborough',
      '<b>Flooring installed</b> — 1,200 sq ft in Markham · 1 week ago',
      '<b>★★★★★</b> “Worth every penny.” — Sofia, Toronto'
    ];
    var msg = ticker.querySelector('p');
    var i = 0, shown = 0, timer = null;
    function show(){
      msg.innerHTML = items[i % items.length];
      ticker.classList.add('show');
      i++; shown++;
      if(shown >= 8){ hide(); return; }
      timer = setTimeout(function(){ ticker.classList.remove('show'); setTimeout(show, 900); }, 5200);
    }
    function hide(){ clearTimeout(timer); ticker.classList.remove('show'); }
    ticker.querySelector('.lt-x').addEventListener('click', hide);
    ticker.addEventListener('mouseenter', function(){ clearTimeout(timer); });
    ticker.addEventListener('mouseleave', function(){
      if(shown < 8){ timer = setTimeout(function(){ ticker.classList.remove('show'); setTimeout(show, 900); }, 2500); }
    });
    setTimeout(show, 6000);
  }

  /* ---------- FAQ / generic accordion ---------- */
  document.querySelectorAll('.faq-item .faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      var ans = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- expandable service details ---------- */
  document.querySelectorAll('.expandable').forEach(function(box){
    var btn = box.querySelector('.x-toggle');
    if(!btn) return;
    btn.addEventListener('click', function(){ toggleX(box); });
  });
  function toggleX(box, force){
    var body = box.querySelector('.x-body');
    var open = (typeof force === 'boolean') ? force : !box.classList.contains('open');
    box.classList.toggle('open', open);
    body.style.maxHeight = open ? body.scrollHeight + 'px' : '0px';
    var t = box.querySelector('.x-toggle .lbl');
    if(t) t.textContent = open ? 'Show less' : 'What\u2019s included';
  }
  // deep-link: #service-x or ?expand=x auto-opens + highlights
  function deepExpand(){
    var id = (location.hash||'').replace('#','') ||
             (new URLSearchParams(location.search).get('expand')||'');
    if(!id) return;
    var target = document.getElementById(id);
    if(!target) return;
    if(target.classList.contains('expandable')) toggleX(target, true);
    setTimeout(function(){
      target.scrollIntoView({behavior:prefersReduced?'auto':'smooth',block:'center'});
      target.classList.add('flash');
      setTimeout(function(){ target.classList.remove('flash'); }, 1900);
    }, 350);
  }
  if(document.readyState === 'complete') deepExpand();
  else window.addEventListener('load', deepExpand);

  /* ---------- before / after sliders ---------- */
  document.querySelectorAll('.ba').forEach(function(ba){
    var after = ba.querySelector('.ba-after');
    var afterImg = after.querySelector('img');
    var handle = ba.querySelector('.ba-handle');
    var pct = 50, dragging = false;
    function fit(){ afterImg.style.width = ba.clientWidth + 'px'; }
    function setP(p){
      pct = Math.max(2, Math.min(98, p));
      after.style.width = pct + '%';
      handle.style.left = pct + '%';
      ba.setAttribute('aria-valuenow', Math.round(pct));
    }
    function fromEvent(e){
      var r = ba.getBoundingClientRect();
      var x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      setP((x - r.left) / r.width * 100);
    }
    ba.addEventListener('pointerdown', function(e){ dragging = true; ba.setPointerCapture(e.pointerId); fromEvent(e); });
    ba.addEventListener('pointermove', function(e){ if(dragging) fromEvent(e); });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){ ba.addEventListener(ev, function(){ dragging = false; }); });
    ba.addEventListener('keydown', function(e){
      if(e.key==='ArrowLeft'){ setP(pct-4); e.preventDefault(); }
      if(e.key==='ArrowRight'){ setP(pct+4); e.preventDefault(); }
    });
    window.addEventListener('resize', fit);
    fit(); setP(50);
    if(afterImg.complete) fit(); else afterImg.addEventListener('load', fit);
  });

  /* ---------- reviews carousel ---------- */
  var revWrap = document.querySelector('.rev-wrap');
  if(revWrap){
    var slides = revWrap.querySelectorAll('.rev');
    var dotsBox = revWrap.querySelector('.rev-dots');
    var cur = 0, rTimer = null;
    slides.forEach(function(_, idx){
      var d = document.createElement('button');
      d.setAttribute('aria-label','Show review '+(idx+1));
      d.addEventListener('click', function(){ go(idx); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll('button');
    function go(n){
      slides[cur].classList.remove('on'); dots[cur].classList.remove('on');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('on'); dots[cur].classList.add('on');
    }
    function restart(){ clearInterval(rTimer); if(!prefersReduced) rTimer = setInterval(function(){ go(cur+1); }, 6000); }
    go(0); restart();
  }

  /* ---------- project filters ---------- */
  var filters = document.querySelectorAll('.filters button');
  if(filters.length){
    filters.forEach(function(f){
      f.addEventListener('click', function(){
        filters.forEach(function(x){ x.classList.remove('on'); });
        f.classList.add('on');
        var cat = f.getAttribute('data-filter');
        document.querySelectorAll('.proj').forEach(function(p){
          var show = cat === 'all' || p.getAttribute('data-cat') === cat;
          p.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ---------- process timeline progress ---------- */
  var tProg = document.querySelector('.timeline .t-prog');
  if(tProg){
    var tl = tProg.parentElement;
    function updT(){
      var r = tl.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (innerHeight*.72 - r.top) / r.height));
      tProg.style.height = (p*100).toFixed(1)+'%';
    }
    addEventListener('scroll', updT, {passive:true});
    addEventListener('resize', updT);
    updT();
  }

  /* ---------- hero parallax ---------- */
  var heroBg = document.querySelector('.hero-bg');
  if(heroBg && !prefersReduced){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if(y < innerHeight * 1.2) heroBg.style.transform = 'translateY(' + (y * .28) + 'px) scale(1.05)';
    }, {passive:true});
  }
})();
