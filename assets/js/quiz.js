/* RENOFY — Style Quiz. 4 questions, each answer scores one style;
   result picks the highest-scoring style and deep-links to estimate.html */
(function(){
  'use strict';

  var QUESTIONS = [
    { q: 'Pick a kitchen that feels like you', opts: [
      { t: 'Dark & dramatic', s: 'Black stone, brass, low light', style: 'luxe',
        sw: 'linear-gradient(135deg,#070708 20%,#0d3b35 55%,#a05f27)' },
      { t: 'Warm woods', s: 'Oak, grain, golden glow', style: 'warm',
        sw: 'linear-gradient(135deg,#2b1a10 10%,#7a4b26 55%,#d29a54)' },
      { t: 'Bright & airy', s: 'White, light, effortless', style: 'fresh',
        sw: 'linear-gradient(135deg,#f7f7f4 20%,#dfe6d8 60%,#b7c9b2)' }
    ]},
    { q: 'Your ideal Friday night', opts: [
      { t: 'Cocktails at the island', s: 'Low light, loud playlist', style: 'luxe',
        sw: 'linear-gradient(135deg,#0a0a0c 30%,#123f45 60%,#c77b33)' },
      { t: 'Movie night in the basement lounge', s: 'Velvet, popcorn, projector glow', style: 'warm',
        sw: 'linear-gradient(135deg,#241510 30%,#5f3a1e 60%,#b07a3e)' },
      { t: 'Dinner party with friends', s: 'Platters, candles, loud laughter', style: 'fresh',
        sw: 'linear-gradient(135deg,#ffffff 10%,#eef1ea 55%,#c4d2bd)' }
    ]},
    { q: 'Choose a texture', opts: [
      { t: 'Veined marble', s: 'Drama in every slab', style: 'luxe',
        sw: 'linear-gradient(135deg,#0c0c0e 25%,#3a3a40 45%,#0f5b52 70%,#8a5a28)' },
      { t: 'Natural oak', s: 'Warmth you can touch', style: 'warm',
        sw: 'linear-gradient(135deg,#4a2e17 20%,#8a5a2e 55%,#d9a862)' },
      { t: 'Crisp matte white', s: 'Clean lines, no fuss', style: 'fresh',
        sw: 'linear-gradient(135deg,#fafafa 30%,#e8eae6 65%,#aebfa6)' }
    ]},
    { q: 'Budget vibe', opts: [
      { t: 'Luxe splurge', s: 'Top shelf everything', style: 'luxe',
        sw: 'linear-gradient(135deg,#050506 30%,#0d4f46 60%,#e8933c)' },
      { t: 'Smart mid-range', s: 'Big look, clever spend', style: 'warm',
        sw: 'linear-gradient(135deg,#33200f 25%,#9a6630 60%,#e0aa63)' },
      { t: 'Fresh refresh', s: 'Maximum glow, minimum spend', style: 'fresh',
        sw: 'linear-gradient(135deg,#f4f6f1 30%,#d5e0cf 60%,#93ad8d)' }
    ]}
  ];

  var STYLES = {
    luxe: {
      name: 'Dark Luxe', grad: 'grad-teal',
      palette: ['#0b0b0d', '#0f5b52', '#b0652a', '#f2ede4'],
      desc: 'Drama, stone and glow. You want rooms that feel like midnight in the best restaurant in the city.',
      start: 'a kitchen or bathroom',
      param: 'luxe'
    },
    warm: {
      name: 'Warm Modern', grad: 'grad-copper',
      palette: ['#5f3a1e', '#c98f4e', '#f2e3c8', '#2b1a10'],
      desc: 'Oak, texture and golden light. Modern lines, but it hugs you back.',
      start: 'flooring or a basement lounge',
      param: 'designer'
    },
    fresh: {
      name: 'Classic Fresh', grad: 'grad-silver',
      palette: ['#f5f5f2', '#dfe6d8', '#a9c0a4', '#3a3a40'],
      desc: 'Crisp, bright and timeless. The kind of rooms that never go out of style.',
      start: 'paint + kitchen refresh',
      param: 'refresh'
    }
  };
  var ORDER = ['luxe', 'warm', 'fresh'];

  var body = document.getElementById('quizBody');
  var bar = document.getElementById('quizBar');
  if(!body || !bar) return;

  var answers = []; // style keys in answer order

  function esc(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function progress(){ bar.style.width = (answers.length / QUESTIONS.length * 100) + '%'; }

  function renderQ(i){
    var q = QUESTIONS[i];
    var opts = q.opts.map(function(o){
      return '<button type="button" class="quiz-opt" data-style="' + o.style + '">' +
        '<span class="sw" style="background:' + o.sw + '"></span>' +
        '<b>' + esc(o.t) + '</b><span>' + esc(o.s) + '</span></button>';
    }).join('');
    var back = i > 0 ? '<button type="button" class="quiz-back" id="quizBack">← Back</button>' : '';
    body.innerHTML =
      '<div class="quiz-q"><h3>' + esc(q.q) + '</h3>' +
      '<div class="quiz-opts">' + opts + '</div>' + back + '</div>';
    body.querySelectorAll('.quiz-opt').forEach(function(btn){
      btn.addEventListener('click', function(){
        answers.push(btn.getAttribute('data-style'));
        progress();
        if(answers.length >= QUESTIONS.length){ renderResult(); }
        else { renderQ(answers.length); }
      });
    });
    var backBtn = document.getElementById('quizBack');
    if(backBtn) backBtn.addEventListener('click', function(){
      answers.pop();
      progress();
      renderQ(answers.length);
    });
  }

  function winner(){
    var scores = { luxe: 0, warm: 0, fresh: 0 };
    answers.forEach(function(s){ scores[s]++; });
    var best = ORDER[0];
    ORDER.forEach(function(k){ if(scores[k] > scores[best]) best = k; });
    return best;
  }

  function renderResult(){
    var st = STYLES[winner()];
    bar.style.width = '100%';
    var dots = st.palette.map(function(c){
      return '<i style="background:' + c + '"></i>';
    }).join('');
    body.innerHTML =
      '<div class="quiz-result">' +
        '<span class="kicker" style="justify-content:center">Your style is</span>' +
        '<div class="style-name ' + st.grad + '">' + esc(st.name) + '</div>' +
        '<div class="palette">' + dots + '</div>' +
        '<p class="lead" style="margin:0 auto;max-width:54ch">' + esc(st.desc) + '</p>' +
        '<p class="mt-2" style="color:var(--muted)">Start with: <b style="color:var(--text)">' + esc(st.start) + '</b>.</p>' +
        '<div class="hero-ctas" style="justify-content:center;margin-top:1.8rem">' +
          '<a href="estimate.html?style=' + st.param + '" class="btn magnetic">Estimate my ' + esc(st.name) + ' project</a>' +
          '<button type="button" class="btn btn-ghost magnetic" id="quizRetake">↺ Retake quiz</button>' +
        '</div>' +
      '</div>';
    document.getElementById('quizRetake').addEventListener('click', function(){
      answers = [];
      progress();
      renderQ(0);
    });
  }

  progress();
  renderQ(0);
})();
