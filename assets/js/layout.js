/* RENOFY — shared header/footer injection.
   Every page: <div id="site-header"></div> ... <div id="site-footer"></div>
   and <body data-page="home|services|projects|about|quiz|estimate|contact"> */
(function(){
  var page = document.body.getAttribute('data-page') || 'home';

  var NAV = [
    ['home','Home','index.html'],
    ['services','Services','services.html'],
    ['projects','Projects','projects.html'],
    ['about','About','about.html'],
    ['quiz','Style Quiz','quiz.html'],
    ['estimate','Estimate','estimate.html'],
    ['contact','Contact','contact.html']
  ];

  var links = NAV.map(function(n){
    var cls = n[0] === page ? ' class="active"' : '';
    return '<li><a href="'+n[2]+'"'+cls+'>'+n[1]+'</a></li>';
  }).join('');

  document.getElementById('site-header').innerHTML =
    '<div class="container nav-inner">' +
      '<a class="brand" href="index.html" aria-label="Renofy home">' +
        '<img src="assets/logo.png?v=6" alt="Renofy logo">' +
        '<span class="wordmark grad-silver">RENOFY<small>Renovate · Redefine · Reimagine</small></span>' +
      '</a>' +
      '<ul class="nav-links" id="navLinks">' + links + '</ul>' +
      '<div class="nav-cta">' +
        '<a href="contact.html" class="btn btn-sm magnetic">Free Quote</a>' +
        '<button id="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</div>';

  document.getElementById('site-footer').innerHTML =
    '<div class="container">' +
      '<div class="foot-grid">' +
        '<div class="foot-brand">' +
          '<a class="brand" href="index.html"><img src="assets/logo.png?v=6" alt="Renofy logo">' +
          '<span class="wordmark grad-silver">RENOFY<small>Renovate · Redefine · Reimagine</small></span></a>' +
          '<p>Toronto\'s boldest renovation crew. We turn tired rooms into the reason you rush home — on time, on budget, and built to be stared at.</p>' +
          '<span class="script" style="font-size:1.6rem">Building Better Spaces</span>' +
        '</div>' +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="services.html">Services</a></li>' +
          '<li><a href="projects.html">Projects</a></li>' +
          '<li><a href="about.html">About</a></li>' +
          '<li><a href="quiz.html">Style Quiz</a></li>' +
          '<li><a href="estimate.html">Instant Estimate</a></li>' +
        '</ul></div>' +
        '<div><h4>Services</h4><ul>' +
          '<li><a href="services.html#service-kitchen">Kitchen Remodeling</a></li>' +
          '<li><a href="services.html#service-bathroom">Bathroom Retreats</a></li>' +
          '<li><a href="services.html#service-basement">Basement Finishing</a></li>' +
          '<li><a href="services.html#service-flooring">Flooring</a></li>' +
          '<li><a href="services.html#service-painting">Painting</a></li>' +
          '<li><a href="services.html#service-stone">Quartz &amp; Quartzite</a></li>' +
        '</ul></div>' +
        '<div><h4>Resources</h4><ul>' +
          '<li><a href="faq.html">Renovation FAQs</a></li>' +
          '<li><a href="areas.html">Service Areas</a></li>' +
          '<li><a href="kitchen-renovation-cost-toronto.html">Kitchen Cost Guide</a></li>' +
          '<li><a href="bathroom-renovation-cost-toronto.html">Bathroom Cost Guide</a></li>' +
        '</ul></div>' +
        '<div><h4>Get in touch</h4><ul class="foot-contact">' +
          '<li><b>Phone&nbsp;</b><a href="tel:+16476733696">+1 (647) 673 3696</a></li>' +
          '<li><b>Email&nbsp;</b><a href="mailto:info@renofy.ca">info@renofy.ca</a></li>' +
          '<li><b>Instagram&nbsp;</b><a href="https://www.instagram.com/renofy.homes/" target="_blank" rel="noopener">@renofy.homes</a></li>' +
          '<li><b>Hours&nbsp;</b><span>Mon–Fri, 9am–5pm</span></li>' +
          '<li><b>Areas&nbsp;</b><span>Toronto & the GTA · Hamilton · Niagara · Waterloo Region · Barrie · London & beyond</span></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="foot-bottom">' +
        '<span>© 2026 Renofy. All rights reserved.</span>' +
        '<span class="script">Building Better Spaces</span>' +
        '<span>Licensed &amp; insured · 1-year craftsmanship warranty</span>' +
      '</div>' +
    '</div>';

  // header scroll state + mobile menu
  var header = document.getElementById('site-header');
  var burger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  burger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function(e){
    if(e.target.tagName === 'A'){
      navLinks.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    }
  });

})();

/* ---------- live chat widget (every page) ---------- */
(function () {
  var s = document.createElement('script');
  s.src = 'assets/js/chat.js';
  s.defer = true;
  document.body.appendChild(s);
})();
