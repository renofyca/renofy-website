/* RENOFY — Contact form. Builds a mailto handoff with all fields,
   opens the user's email app, then swaps in a confirmation panel. */
(function(){
  'use strict';

  var form = document.getElementById('quoteForm');
  if(!form) return;

  function val(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; }

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

    var bodyLines = [
      'Name: ' + name,
      'Phone: ' + phone,
      'Email: ' + (email || '—'),
      'Project type: ' + type,
      '',
      'About the project:',
      msg || '—'
    ];
    var mailto = 'mailto:info@renofy.ca' +
      '?subject=' + encodeURIComponent('Quote request — ' + name + ' (' + type + ')') +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));

    window.location.href = mailto;

    form.outerHTML =
      '<div class="quiz-result" style="padding:1.5rem 0">' +
        '<div style="font-size:2.8rem;color:var(--teal);line-height:1">✓</div>' +
        '<h3 class="display" style="font-size:1.8rem;margin:1rem 0 .6rem;letter-spacing:.04em">Request ready in your email app</h3>' +
        '<p class="lead" style="margin:0 auto 1.6rem;max-width:44ch">Your message is drafted and waiting — just hit send. Prefer talking? We like that too.</p>' +
        '<a href="tel:+16476733696" class="btn magnetic">Call (647) 673 3696</a>' +
      '</div>';
  });
})();
