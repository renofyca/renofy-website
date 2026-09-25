/* RENOFY — live chat widget with built-in smart assistant.
   Injected on every page by layout.js. No backend needed:
   keyword-based answers from the Renofy knowledge base + in-chat
   consultation booking flow. */
(function () {
  'use strict';

  /* ---------- markup ---------- */
  var CHAT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  var fab = document.createElement('button');
  fab.id = 'chat-fab';
  fab.setAttribute('aria-label', 'Chat with the Renofy assistant');
  fab.innerHTML = CHAT_SVG;

  var panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Renofy chat');
  panel.innerHTML =
    '<div class="chat-head">' +
      '<div class="chat-avatar">R</div>' +
      '<div><b>Renofy Assistant</b><span class="chat-status"><i></i>Online &mdash; replies instantly</span></div>' +
      '<button id="chat-close" aria-label="Close chat">&times;</button>' +
    '</div>' +
    '<div class="chat-msgs" id="chat-msgs" aria-live="polite"></div>' +
    '<div class="chat-chips" id="chat-chips"></div>' +
    '<div class="chat-input">' +
      '<input id="chat-text" type="text" placeholder="Ask about services, pricing&hellip;" autocomplete="off" aria-label="Type your message">' +
      '<button id="chat-send" aria-label="Send message">&rarr;</button>' +
    '</div>';

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  var msgs = panel.querySelector('#chat-msgs');
  var chipsBox = panel.querySelector('#chat-chips');
  var input = panel.querySelector('#chat-text');
  var sendBtn = panel.querySelector('#chat-send');
  var opened = false;
  var flow = null; // lead-capture state: {step, name, phone}

  /* ---------- helpers ---------- */
  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addMsg(html, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    if (who === 'user') d.textContent = html;
    else d.innerHTML = html;
    msgs.appendChild(d);
    scrollDown();
  }

  function typing(on) {
    var t = msgs.querySelector('.msg.typing');
    if (on && !t) {
      var d = document.createElement('div');
      d.className = 'msg bot typing';
      d.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(d);
      scrollDown();
    } else if (!on && t) {
      t.remove();
    }
  }

  function botSay(html, chips) {
    typing(true);
    setTimeout(function () {
      typing(false);
      addMsg(html, 'bot');
      if (chips) renderChips(chips);
    }, 650 + Math.random() * 450);
  }

  function renderChips(list) {
    chipsBox.innerHTML = '';
    list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c;
      if (/whatsapp/i.test(c)) {
        b.onclick = function () {
          window.open(waLink('Hi Renofy! I have a question about a renovation project.'), '_blank', 'noopener');
        };
      } else {
        b.onclick = function () { userSay(c); };
      }
      chipsBox.appendChild(b);
    });
  }

  function clearChips() { chipsBox.innerHTML = ''; }

  /* ---------- knowledge base ---------- */
  var PHONE = '+1 (647) 673-3696';
  var PHONE_LINK = 'tel:+16476733696';
  var WHATSAPP_NUMBER = '16476733696'; // business line doubles as WhatsApp
  function waLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  var MAIN_CHIPS = ['\uD83D\uDCB0 Pricing', '\uD83D\uDD28 Services', '\uD83D\uDCCD Service areas', '\uD83D\uDCC5 Book a consultation', '\uD83D\uDCAC WhatsApp us'];

  function pricingMsg() {
    return 'Here are our starting prices:<br>' +
      '\u2022 <b>Kitchen remodel</b> \u2014 from $25k (4\u20136 weeks)<br>' +
      '\u2022 <b>Bathroom retreat</b> \u2014 from $18k (3\u20134 weeks)<br>' +
      '\u2022 <b>Flooring</b> \u2014 from $8/sq ft (3\u20135 days)<br>' +
      '\u2022 <b>Painting</b> \u2014 from $2.50/sq ft (2\u20133 days)<br>' +
      '\u2022 <b>Drywall &amp; plaster</b> \u2014 from $3/sq ft (2\u20134 days)<br>' +
      '\u2022 <b>Quartz &amp; quartzite</b> \u2014 from $85/sq ft (2\u20133 weeks)<br>' +
      'Every project gets a <b>fixed quote</b> \u2014 no surprises. ' +
      'Want a fast ballpark? Try our <a href="estimate.html">instant estimator</a>.';
  }

  var INTENTS = [
    { re: /\b(tile\s*backsplash|backsplash\s*tile)\b/i,
      msg: 'We don\u2019t do tile backsplashes \u2014 ever. Our countertops and backsplashes are only <b>quartz, quartzite, or natural stone</b>, usually full-height with zero grout lines. It costs more than tile, and it looks it.' },
    { re: /\b(quartz|quartzite|stone|countertop|backsplash|marble|granite|waterfall)\b/i,
      msg: '<b>Quartz &amp; quartzite</b> \u2014 from $85/sq ft (2\u20133 weeks). Full-height stone backsplashes, waterfall islands, book-matched slabs. Real stone, zero grout lines. <a href="services.html#service-stone">See stone services \u2192</a>' },
    { re: /\bkitchen\b/i,
      msg: '<b>Kitchen remodeling</b> \u2014 from $25k (4\u20136 weeks). Custom layouts, full-height quartz or quartzite backsplashes, cabinetry that fits like a glove. Kitchens are our specialty. <a href="services.html#service-kitchen">Explore kitchens \u2192</a> We also have a <a href="kitchen-renovation-cost-toronto.html">Toronto kitchen cost guide</a>.' },
    { re: /\b(bath|shower|powder)\b/i,
      msg: '<b>Bathroom retreats</b> \u2014 from $18k (3\u20134 weeks). Curbless showers, heated floors, spa lighting, premium stone surfaces. <a href="services.html#service-bathroom">Explore bathrooms \u2192</a> Here\u2019s our <a href="bathroom-renovation-cost-toronto.html">Toronto bathroom cost guide</a>.' },
    { re: /\b(floor|hardwood|vinyl|laminate)\b/i,
      msg: '<b>Flooring</b> \u2014 from $8/sq ft (3\u20135 days). Hardwood, luxury vinyl and tile, installed laser-level and silent underfoot \u2014 guaranteed against squeaks. <a href="services.html#service-flooring">Explore flooring \u2192</a>' },
    { re: /\bpaint\b/i,
      msg: '<b>Painting</b> \u2014 from $2.50/sq ft (2\u20133 days). Sprayed and rolled to a furniture-grade finish, razor-sharp lines, zero mess left behind. <a href="services.html#service-painting">Explore painting \u2192</a>' },
    { re: /\b(drywall|plaster|mud|taping)\b/i,
      msg: '<b>Drywall &amp; plaster</b> \u2014 from $3/sq ft (2\u20134 days). Level-5 smooth finishes, perfectly straight corners \u2014 the invisible craft that makes paint look expensive.' },
    { re: /\bbasement\b/i,
      msg: '<b>Basement finishing</b> \u2014 turn dead square footage into the best room in the house: lounge, gym, guest suite, or cinema. <a href="services.html#service-basement">Explore basements \u2192</a> Tell me what you\u2019d use it for and I\u2019ll point you the right way.' },
    { re: /\b(price|pricing|cost|how much|charge|rates?|budget)\b/i, fn: pricingMsg },
    { re: /\b(warranty|guarantee)\b/i,
      msg: 'Every Renofy project is backed by our <b>1-year craftsmanship warranty</b>, on top of a fixed quote agreed before we start. No surprise extras, ever.' },
    { re: /\b(area|areas|location|where|serve|serving|city|cities|toronto|gta|etobicoke|scarborough|mississauga|vaughan|markham|hamilton|barrie|london|niagara)\b/i,
      msg: 'We serve <b>Toronto, the GTA &amp; beyond</b> \u2014 10 regions: Toronto, Durham, York, Peel, Halton, Hamilton area, Niagara, Waterloo Region, Simcoe County (Barrie) and Southwestern Ontario (London). <a href="areas.html">See all service areas \u2192</a>' },
    { re: /\b(hour|hours|open|when|schedule|available)\b/i,
      msg: 'We\u2019re open <b>Monday to Friday, 9am\u20135pm</b>. The fastest way to reach us anytime is right here \u2014 or call <a href="' + PHONE_LINK + '">' + PHONE + '</a>.' },
    { re: /\b(contact|phone|number|call|email|e-mail|instagram|human|person|someone|agent)\b/i,
      msg: 'You can reach us at <a href="' + PHONE_LINK + '">' + PHONE + '</a> or <a href="mailto:info@renofy.ca">info@renofy.ca</a> \u2014 and we\u2019re <a href="https://www.instagram.com/renofy.homes/" target="_blank" rel="noopener">@renofy.homes</a> on Instagram. Or <a href="contact.html">send us a message \u2192</a>' },
    { re: /\b(how long|timeline|duration|take|finish|done)\b/i,
      msg: 'Typical timelines: painting 2\u20133 days, flooring 3\u20135 days, bathrooms 3\u20134 weeks, kitchens 4\u20136 weeks, full-home remodels 8\u201316 weeks. Your fixed quote includes a firm schedule before we start.' },
    { re: /\b(book|consult|appointment|quote|estimate|callback|call me|call back|talk)\b/i, fn: 'BOOK' },
    { re: /\b(bot|ai|robot|artificial|who are you|your name)\b/i,
      msg: 'I\u2019m Renofy\u2019s virtual assistant \u2014 I can answer questions about services, pricing, areas and timelines instantly. For anything complex, I\u2019ll get you booked with the human crew.' },
    { re: /\b(thank|thanks|thx|great|awesome|perfect)\b/i,
      msg: 'Anytime! If you\u2019d like a free estimate, just say <b>\u201cbook\u201d</b> and I\u2019ll set it up.' },
    { re: /\b(bye|goodbye|see you)\b/i,
      msg: 'Goodbye for now \u2014 and remember, your dream space starts with a conversation. \uD83D\uDE0A' },
    { re: /^(hi|hey|hello|yo|good (morning|afternoon|evening))\b/i,
      msg: 'Hello! \uD83D\uDC4B Ask me about our <b>services</b>, <b>pricing</b>, <b>service areas</b> \u2014 or tap below to <b>book a free consultation</b>.',
      chips: MAIN_CHIPS }
  ];

  function startBooking() {
    flow = { step: 'name' };
    botSay('Great \u2014 let\u2019s get you booked in. What\u2019s your <b>name</b>?');
  }

  function handleFlow(text) {
    if (/^(cancel|stop|never ?mind|quit)\b/i.test(text)) {
      flow = null;
      botSay('No problem \u2014 I\u2019m here whenever you\u2019re ready.', MAIN_CHIPS);
      return;
    }
    if (flow.step === 'name') {
      var name = text.trim();
      if (name.length < 2) { botSay('Could you share your name so we know who to ask for?'); return; }
      flow.name = name;
      flow.step = 'phone';
      botSay('Nice to meet you, ' + escapeHtml(name.split(' ')[0]) + '! What\u2019s the best <b>phone number</b> to reach you?');
    } else if (flow.step === 'phone') {
      var digits = text.replace(/\D/g, '');
      if (digits.length < 7) { botSay('Hmm, that doesn\u2019t look like a full number \u2014 mind double-checking it?'); return; }
      flow.phone = text.trim();
      flow.step = 'project';
      botSay('And what project are you thinking about?', ['Kitchen', 'Bathroom', 'Full home', 'Something else']);
    } else if (flow.step === 'project') {
      var first = escapeHtml(flow.name.split(' ')[0]);
      var project = text.trim();
      var phone = flow.phone;
      var waText = 'Hi Renofy! I\'m ' + flow.name + ' (' + phone + '). I\'m interested in: ' + project + '. Please contact me.';
      flow = null;
      botSay(
        'Thanks, ' + first + '! Here\u2019s your booking summary:<br>' +
        '\u2022 <b>Project:</b> ' + escapeHtml(project) + '<br>' +
        '\u2022 <b>Your number:</b> ' + escapeHtml(phone) + '<br><br>' +
        'Tap below to send this straight to our <b>WhatsApp</b> \u2014 it lands directly on our phone and we\u2019ll reply shortly (Mon\u2013Fri, 9\u20135).<br><br>' +
        '<a class="wa-btn" href="' + waLink(waText) + '" target="_blank" rel="noopener">Send via WhatsApp</a><br><br>' +
        'Prefer to talk now? <a href="' + PHONE_LINK + '">Call ' + PHONE + '</a>',
        MAIN_CHIPS);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function answer(text) {
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].re.test(text)) {
        var it = INTENTS[i];
        if (it.fn === 'BOOK') { startBooking(); return; }
        botSay(typeof it.fn === 'function' ? it.fn() : it.msg, it.chips);
        return;
      }
    }
    botSay('I want to make sure I get this right \u2014 could you rephrase that? I\u2019m best with questions about <b>services</b>, <b>pricing</b>, <b>timelines</b>, <b>service areas</b>, or tap below to <b>book a free consultation</b>.', MAIN_CHIPS);
  }

  function userSay(text) {
    text = (text || '').trim();
    if (!text) return;
    clearChips();
    addMsg(text, 'user');
    if (flow) handleFlow(text);
    else answer(text);
  }

  /* ---------- open / close ---------- */
  function openChat() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.add('active');
    fab.setAttribute('aria-label', 'Close chat');
    opened = true;
    if (!msgs.children.length) {
      botSay('Hi there! \uD83D\uDC4B I\u2019m the <b>Renofy assistant</b>. Ask me about services, pricing, timelines or service areas \u2014 or book a free consultation below.', MAIN_CHIPS);
    }
    setTimeout(function () { input.focus(); }, 350);
  }

  function closeChat() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.classList.remove('active');
    fab.setAttribute('aria-label', 'Chat with the Renofy assistant');
  }

  fab.addEventListener('click', function () {
    panel.classList.contains('open') ? closeChat() : openChat();
  });
  panel.querySelector('#chat-close').addEventListener('click', closeChat);
  sendBtn.addEventListener('click', function () { userSay(input.value); input.value = ''; });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { userSay(input.value); input.value = ''; }
    if (e.key === 'Escape') closeChat();
  });

  /* one-time attention nudge */
  setTimeout(function () {
    if (!opened) fab.classList.add('attn');
  }, 20000);
})();
