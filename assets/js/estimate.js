/* RENOFY — Instant estimator. Live ballpark from type × size × finish,
   count-up animation on the range, mailto handoff for "Send me this estimate". */
(function(){
  'use strict';

  var TYPES = {
    kitchen:  { label: 'Kitchen',   rate: { refresh: 150, designer: 220, luxe: 320 },  sqft: 200,  timeline: '4–6 weeks' },
    bathroom: { label: 'Bathroom',  rate: { refresh: 160, designer: 240, luxe: 340 },  sqft: 120,  timeline: '3–4 weeks' },
    basement: { label: 'Basement',  rate: { refresh: 60,  designer: 95,  luxe: 140 },  sqft: 800,  timeline: '6–10 weeks' },
    flooring: { label: 'Flooring',  rate: { refresh: 8,   designer: 12,  luxe: 18 },   sqft: 1000, timeline: '3–5 days' },
    painting: { label: 'Painting',  rate: { refresh: 2.5, designer: 4,   luxe: 6.5 },  sqft: 1200, timeline: '2–3 days' },
    fullhome: { label: 'Full Home', rate: { refresh: 90,  designer: 130, luxe: 190 },  sqft: 2000, timeline: '8–16 weeks' }
  };
  var FINISHES = { refresh: 'Refresh', designer: 'Designer', luxe: 'Luxe' };

  var typeSeg = document.getElementById('typeSeg');
  var finishSeg = document.getElementById('finishSeg');
  var sizeRange = document.getElementById('sizeRange');
  var rangeVal = document.getElementById('rangeVal');
  var result = document.getElementById('estResult');
  if(!typeSeg || !finishSeg || !sizeRange || !result) return;

  var state = { type: 'kitchen', finish: 'designer', sqft: TYPES.kitchen.sqft };

  /* honour ?style=refresh|designer|luxe deep-links (from the style quiz) */
  var q = new URLSearchParams(window.location.search);
  var styleParam = (q.get('style') || '').toLowerCase();
  if(FINISHES[styleParam]) state.finish = styleParam;

  function segInit(seg, attr, current, cb){
    seg.querySelectorAll('button').forEach(function(btn){
      btn.classList.toggle('on', btn.getAttribute(attr) === current);
      btn.addEventListener('click', function(){
        seg.querySelectorAll('button').forEach(function(b){ b.classList.remove('on'); });
        btn.classList.add('on');
        cb(btn.getAttribute(attr));
      });
    });
  }

  /* ---------- passport card: built once, updated live ---------- */
  result.innerHTML =
    '<div class="passport">' +
      '<div class="stamp">Renofy Estimate</div>' +
      '<h2>Project Passport</h2>' +
      '<div class="row"><span>Project</span><b id="ppType">–</b></div>' +
      '<div class="row"><span>Size</span><b id="ppSize">–</b></div>' +
      '<div class="row"><span>Finish</span><b id="ppFinish">–</b></div>' +
      '<div class="row"><span>Timeline</span><b id="ppTime">–</b></div>' +
      '<div class="range" id="ppRange">$0 – $0</div>' +
      '<div class="per">all-in ballpark</div>' +
      '<div class="p-ctas">' +
        '<a class="btn magnetic" href="#" id="ppMail">Send me this estimate</a>' +
        '<a class="btn btn-ghost magnetic" href="tel:+16476733696">Book free consult</a>' +
      '</div>' +
    '</div>';

  var el = {
    type: document.getElementById('ppType'),
    size: document.getElementById('ppSize'),
    finish: document.getElementById('ppFinish'),
    time: document.getElementById('ppTime'),
    range: document.getElementById('ppRange'),
    mail: document.getElementById('ppMail')
  };

  function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }

  var shown = { lo: 0, hi: 0 };
  var animId = null;

  function animateRange(lo, hi){
    if(animId) cancelAnimationFrame(animId);
    var from = { lo: shown.lo, hi: shown.hi };
    var dur = 650, t0 = null;
    function tick(t){
      if(!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var curLo = from.lo + (lo - from.lo) * e;
      var curHi = from.hi + (hi - from.hi) * e;
      el.range.textContent = money(curLo) + ' – ' + money(curHi);
      if(p < 1){ animId = requestAnimationFrame(tick); }
      else { shown.lo = lo; shown.hi = hi; animId = null; }
    }
    animId = requestAnimationFrame(tick);
  }

  function compute(){
    var T = TYPES[state.type];
    var total = state.sqft * T.rate[state.finish];
    var lo = Math.round(total * 0.88 / 100) * 100;
    var hi = Math.round(total * 1.12 / 100) * 100;

    el.type.textContent = T.label;
    el.size.textContent = state.sqft.toLocaleString('en-US') + ' sq ft';
    el.finish.textContent = FINISHES[state.finish];
    el.time.textContent = T.timeline;
    animateRange(lo, hi);

    var bodyLines = [
      'Hi Renofy team,',
      '',
      'Please send me a fixed quote for:',
      '• Project: ' + T.label,
      '• Size: ' + state.sqft.toLocaleString('en-US') + ' sq ft',
      '• Finish: ' + FINISHES[state.finish],
      '• Ballpark estimate: ' + money(lo) + ' – ' + money(hi),
      '• Timeline: ' + T.timeline,
      '',
      'Name:',
      'Phone:',
      '',
      'Thanks!'
    ];
    var mailto = 'mailto:info@renofy.ca' +
      '?subject=' + encodeURIComponent('Estimate request — ' + T.label) +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));
    el.mail.setAttribute('href', mailto);
  }

  el.mail.addEventListener('click', function(e){
    e.preventDefault();
    window.location.href = el.mail.getAttribute('href');
  });

  function updateSize(){
    rangeVal.textContent = state.sqft.toLocaleString('en-US') + ' sq ft';
  }

  segInit(typeSeg, 'data-type', state.type, function(v){
    state.type = v;
    state.sqft = TYPES[v].sqft;
    sizeRange.value = state.sqft;
    updateSize();
    compute();
  });

  segInit(finishSeg, 'data-finish', state.finish, function(v){
    state.finish = v;
    compute();
  });

  sizeRange.value = state.sqft;
  sizeRange.addEventListener('input', function(){
    state.sqft = parseInt(sizeRange.value, 10);
    updateSize();
    compute();
  });

  updateSize();
  compute();
})();
