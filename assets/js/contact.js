/* RENOFY — Contact form. Submits to Web3Forms (instant email) and to a
   Google Form receiver (feeds the live "Renofy Website Enquiries" sheet),
   then swaps in a confirmation panel. Booking uses the embedded Zoho
   widget (live availability) above the submit button. */
(function(){
  'use strict';

  var form = document.getElementById('quoteForm');
  if(!form) return;

  /* Google Form receiver -> live sheet. Entry IDs in website-field order. */
  var GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdikBHMy3Pdr-pn4E0cxPdDsLM8_Mu0goCOWK4H2-5cgELZPw/formResponse';
  var GOOGLE_ENTRIES = {
    name:           'entry.56289354',
    phone:          'entry.1827519147',
    email:          'entry.1434579579',
    project_type:   'entry.2009336296',
    message:        'entry.1636763234'
  };

  function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    var name = val('qName');
    var phone = val('qPhone');
    var email = val('qEmail');
    var type = val('qType');
    var msg = val('qMsg');

    if(!name || !phone){
      var missing = !name ? document.getElementById('qName') : document.getElementById('qPhone');
      missing.focus();
      missing.style.borderColor = 'var(--copper)';
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    /* 1) Web3Forms -> instant email to info@renofy.ca. This is the
          source of truth for the success UI. */
    var fd = new FormData(form);
    fd.set('subject', 'New enquiry from renofy.ca \u2014 ' + name + ' (' + type + ')');
    if(email) fd.set('replyto', email);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: fd
    }).then(function(r){ return r.json(); }).then(function(data){
      if(data && data.success){

        /* 2) Google Form receiver -> live sheet. Fire and forget:
              the sheet poller picks it up within minutes. */
        try{
          var g = new URLSearchParams();
          g.set(GOOGLE_ENTRIES.name, name);
          g.set(GOOGLE_ENTRIES.phone, phone);
          if(email) g.set(GOOGLE_ENTRIES.email, email);
          g.set(GOOGLE_ENTRIES.project_type, type);
          if(msg) g.set(GOOGLE_ENTRIES.message, msg);
          g.set('fvv', '1');
          g.set('draftResponse', '[]');
          g.set('pageHistory', '0');
          fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body: g })
            .catch(function(){ /* sheet sync is best-effort; email already sent */ });
        }catch(_){}

        var thanks = 'Thanks, ' + escapeHtml(name.split(' ')[0]) +
          ' \u2014 we\u2019ll be in touch shortly (Mon\u2013Fri, 9\u20135).';

        form.outerHTML =
          '<div class="quiz-result" style="padding:1.5rem 0">' +
            '<div style="font-size:2.8rem;color:var(--teal);line-height:1">\u2713</div>' +
            '<h3 class="display" style="font-size:1.8rem;margin:1rem 0 .6rem;letter-spacing:.04em">Request received</h3>' +
            '<p class="lead" style="margin:0 auto 1.6rem;max-width:44ch">' + thanks + '</p>' +
            '<a href="tel:+16476733696" class="btn magnetic">Call (647) 673 3696</a>' +
          '</div>';
      } else {
        throw new Error((data && data.message) || 'send failed');
      }
    }).catch(function(){
      btn.disabled = false;
      btn.textContent = 'Send my request';
      var err = document.getElementById('formError');
      if(!err){
        err = document.createElement('p');
        err.id = 'formError';
        err.style.cssText = 'color:var(--copper);margin:.75rem 0 0;text-align:center';
        form.appendChild(err);
      }
      err.textContent = 'Hmm, that didn\u2019t go through \u2014 please try again or call us directly.';
    });
  });
})();
