/* RENOFY — "Step Inside" Apple-style pinned scroll tour.
   Builds 8 photorealistic scenes from data, drives crossfade +
   Ken Burns camera by scroll progress, with hotspot deep-links
   to services.html anchors. */
(function(){
  'use strict';
  var stage = document.getElementById('tourStage');
  if(!stage) return;
  var wrap = document.getElementById('house-tour');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SCENES = [
    { img:'assets/tour-exterior.webp', rail:'Exterior', kicker:'Step inside',
      title:'The Renofy House', copy:'Every transformation starts at the front door. Keep scrolling — we\u2019ll walk you through it, room by room.',
      cue:'Scroll to enter', spots:[] },
    { img:'assets/service-flooring.webp', rail:'Flooring', kicker:'Stop 01 · Flooring',
      title:'Step onto something solid.', copy:'Hardwood, luxury vinyl and tile — installed laser-level, silent underfoot, and guaranteed against squeaks.',
      price:'From $8/sq ft', time:'3–5 days',
      spots:[{x:50,y:64,label:'Flooring',blurb:'Hardwood, vinyl & tile — installed laser-level and silent underfoot.',anchor:'#service-flooring'}] },
    { img:'assets/service-kitchen.webp', rail:'Kitchen', kicker:'Stop 02 · Kitchen',
      title:'The heart of the home, rebuilt around you.', copy:'Custom layouts, stone counters and cabinetry that fits like a glove. This is where jaws drop.',
      price:'From $25k', time:'4–6 weeks',
      spots:[
        {x:36,y:44,label:'Kitchen',blurb:'Custom layouts, stone counters, cabinetry that fits like a glove.',anchor:'#service-kitchen'},
        {x:64,y:60,label:'Quartz & Quartzite',blurb:'Full-height stone backsplashes, waterfall islands.',anchor:'#service-stone'}
      ] },
    { img:'assets/tour-plaster.webp', rail:'Walls', kicker:'Stop 03 · Drywall & Plaster',
      title:'Walls so smooth you\u2019ll want to touch them.', copy:'Level-5 smooth finishes, perfectly straight corners. The invisible craft that makes paint look expensive.',
      price:'From $3/sq ft', time:'2–4 days',
      spots:[{x:56,y:40,label:'Drywall & Plaster',blurb:'Level-5 smooth finishes. No waves, no seams, no excuses.',anchor:'#service-walls'}] },
    { img:'assets/tour-painting.webp', rail:'Paint', kicker:'Stop 04 · Painting',
      title:'One color can change everything.', copy:'Sprayed and rolled to a furniture-grade finish, with razor-sharp lines and zero mess left behind.',
      price:'From $2.50/sq ft', time:'2–3 days',
      spots:[{x:44,y:46,label:'Painting',blurb:'Sprayed and rolled to a furniture-grade finish.',anchor:'#service-painting'}] },
    { img:'assets/service-bathroom.webp', rail:'Bath', kicker:'Stop 05 · Bathroom',
      title:'Your private spa, five steps from bed.', copy:'Curbless showers, heated floors, spa lighting. Mornings will never feel the same.',
      price:'From $18k', time:'3–4 weeks',
      spots:[{x:50,y:42,label:'Bathroom',blurb:'Curbless showers, heated floors, spa lighting.',anchor:'#service-bathroom'}] },
    { img:'assets/service-stone.webp', rail:'Stone', kicker:'Stop 06 · Quartz & Quartzite',
      title:'Real stone. Zero grout lines.', copy:'Full-height quartz and quartzite backsplashes, waterfall islands, book-matched slabs. We don\u2019t do tile backsplashes \u2014 ever.',
      price:'From $85/sq ft', time:'2–3 weeks',
      spots:[{x:50,y:56,label:'Quartz & Quartzite',blurb:'Book-matched slabs and waterfall edges.',anchor:'#service-stone'}] },
    { img:'assets/showcase-after.webp', rail:'Reveal', kicker:'The reveal',
      title:'Every inch, reimagined.', copy:'That\u2019s the walkthrough. Now imagine it\u2019s your address on the mailbox.',
      cta:{label:'Estimate my project', href:'estimate.html'}, spots:[] }
  ];

  // build scenes
  var sceneEls = SCENES.map(function(s){
    var d = document.createElement('div');
    d.className = 'tour-scene';
    d.style.backgroundImage = "url('"+s.img+"')";
    d.setAttribute('role','img');
    d.setAttribute('aria-label', s.title);
    stage.insertBefore(d, stage.firstChild);
    return d;
  });

  // build captions + hotspots inside .tour-ui
  var ui = stage.querySelector('.tour-ui');
  var capEls = [], spotGroups = [];
  SCENES.forEach(function(s, i){
    var cap = document.createElement('div');
    cap.className = 'tour-cap';
    var html = '<span class="kicker">'+s.kicker+'</span><h3>'+s.title+'</h3><p>'+s.copy+'</p>';
    if(s.price) html += '<div class="meta"><span><b>'+s.price+'</b></span><span>'+s.time+'</span></div>';
    if(s.cta) html += '<a class="btn magnetic" href="'+s.cta.href+'">'+s.cta.label+' →</a>';
    else if(s.cue) html += '<span class="go">'+s.cue+' ↓</span>';
    cap.innerHTML = html;
    ui.appendChild(cap); capEls.push(cap);

    var group = [];
    s.spots.forEach(function(sp){
      var b = document.createElement('button');
      b.className = 'hotspot';
      b.style.left = sp.x+'%'; b.style.top = sp.y+'%';
      b.setAttribute('aria-label', sp.label+' — view service details');
      b.innerHTML = '<span class="halo"></span><span class="core"></span>' +
        '<span class="tip"><b>'+sp.label+'</b><span>'+sp.blurb+'</span><em>View details →</em></span>';
      b.addEventListener('click', function(){ window.location.href = 'services.html'+sp.anchor; });
      stage.appendChild(b); group.push(b);
    });
    spotGroups.push(group);
  });

  // progress rail
  var rail = document.createElement('div');
  rail.className = 'tour-rail'; rail.setAttribute('aria-label','Tour stops');
  var railBtns = SCENES.map(function(s, i){
    var b = document.createElement('button');
    b.innerHTML = '<i></i><span>'+s.rail+'</span>';
    b.setAttribute('aria-label','Jump to '+s.title);
    b.addEventListener('click', function(){ jumpTo(i); });
    rail.appendChild(b); return b;
  });
  ui.appendChild(rail);
  var prog = document.createElement('div');
  prog.className = 'tour-progress'; prog.innerHTML = '<i></i>';
  ui.appendChild(prog);
  var progFill = prog.firstChild;

  function metrics(){
    var top = wrap.offsetTop, scrollable = wrap.offsetHeight - window.innerHeight;
    return {top:top, scrollable:scrollable};
  }
  function jumpTo(i){
    var m = metrics();
    window.scrollTo({top: m.top + (m.scrollable * (i+.5)/SCENES.length), behavior: prefersReduced?'auto':'smooth'});
  }

  if(prefersReduced){
    wrap.classList.add('tour-static');
    return; // CSS fallback stacks the scenes
  }

  var N = SCENES.length, activeIdx = -1;
  function render(){
    var m = metrics();
    var p = (window.scrollY - m.top) / m.scrollable;
    p = Math.max(0, Math.min(1, p));
    var f = p * N;
    var idx = Math.max(0, Math.min(N-1, Math.floor(f)));
    var local = f - idx;

    for(var i=0;i<N;i++){
      var d = Math.abs(f - (i+.5));           // distance in scene units
      var op = Math.max(0, Math.min(1, 1 - (d-.35)/.65));
      sceneEls[i].style.opacity = op.toFixed(3);
      // Ken Burns drift while active
      var z = 1.06 + .07*Math.max(0,Math.min(1,1-d));
      var dx = (i%2? -1:1) * 1.6 * Math.max(0,Math.min(1,1-d));
      sceneEls[i].style.transform = 'scale('+z.toFixed(4)+') translateX('+dx.toFixed(2)+'%)';
    }
    if(idx !== activeIdx){
      activeIdx = idx;
      capEls.forEach(function(c,i){ c.classList.toggle('on', i===idx); });
      spotGroups.forEach(function(g,i){ g.forEach(function(b){ b.classList.toggle('on', i===idx); }); });
      railBtns.forEach(function(b,i){ b.classList.toggle('on', i===idx); });
    }
    progFill.style.width = (p*100).toFixed(2)+'%';
  }
  var ticking = false;
  window.addEventListener('scroll', function(){
    if(!ticking){ ticking = true; requestAnimationFrame(function(){ render(); ticking = false; }); }
  }, {passive:true});
  window.addEventListener('resize', render);
  render();
})();
