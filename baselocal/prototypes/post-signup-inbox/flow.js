/* ----------------------------------------------------------------------------
   baselocal · post-signup-inbox prototype
   Provider detection (from email domain) + mailto: launch + state handoff
   between Screen 1 (index.html) and Screen 2 (confirmed.html).
   Spec.md is the source of truth — keep this file in sync with it.
---------------------------------------------------------------------------- */

(function () {
  'use strict';

  // --- Provider detection -------------------------------------------------

  // Maps an email domain to a provider key. Anything unmapped is "other".
  // Workspace/365 domains are intentionally treated as "other" — we do not
  // attempt MX/SSO lookups in the prototype. See spec.md, Open questions.
  var DOMAIN_MAP = {
    'gmail.com': 'gmail',
    'googlemail.com': 'gmail',
    'icloud.com': 'apple',
    'me.com': 'apple',
    'mac.com': 'apple',
    'outlook.com': 'outlook',
    'hotmail.com': 'outlook',
    'live.com': 'outlook',
    'msn.com': 'outlook',
    'yahoo.com': 'yahoo',
    'ymail.com': 'yahoo',
    'rocketmail.com': 'yahoo',
    'aol.com': 'aol'
  };

  var PROVIDER_LABELS = {
    gmail: 'Gmail',
    apple: 'Apple Mail',
    outlook: 'Outlook',
    yahoo: 'Yahoo Mail',
    aol: 'AOL Mail',
    other: 'your mail app'
  };

  function detectProvider(email) {
    if (!email || email.indexOf('@') === -1) return 'other';
    var domain = email.split('@')[1].trim().toLowerCase();
    return DOMAIN_MAP[domain] || 'other';
  }

  // --- URL params ---------------------------------------------------------

  function getParam(name) {
    var p = new URLSearchParams(window.location.search);
    var v = p.get(name);
    return v ? v.trim() : '';
  }

  // Prototype default. In production the email arrives from the form submit;
  // this fallback only exists so the URL is openable for demos.
  var DEMO_EMAIL = 'reader@gmail.com';

  function getEmail() {
    var fromUrl = getParam('email');
    return fromUrl || DEMO_EMAIL;
  }

  // --- Mailto: link -------------------------------------------------------

  // Recipient is a placeholder — surface as open question in spec.md. The
  // address must match the production welcome-email "From:" so the reply /
  // outbound signal trains the user's mail app on the correct sender.
  var SENDER_EMAIL = 'tacoma@baselocal.com';
  var MAILTO_SUBJECT = 'Hi from Tacoma';
  var MAILTO_BODY = 'Hi! 👋'; // Hi! 👋

  function buildMailto() {
    return 'mailto:' + SENDER_EMAIL +
      '?subject=' + encodeURIComponent(MAILTO_SUBJECT) +
      '&body=' + encodeURIComponent(MAILTO_BODY);
  }

  // --- Wire-up: Screen 1 (index.html) -------------------------------------

  function renderScreen1() {
    var email = getEmail();
    var provider = detectProvider(email);
    var label = PROVIDER_LABELS[provider];

    // Provider chip — single text run; provider name bolded inline.
    var chipEmail = document.querySelector('[data-chip-email]');
    var chipText = document.querySelector('[data-chip-text]');
    if (chipEmail) chipEmail.textContent = email;
    if (chipText) chipText.innerHTML = 'Tailored for <strong>' + label + '</strong>';

    // Primary CTA — let the browser open the mailto: natively, then advance
    // to Screen 2. The mailto: opens an external app (Mail.app, Gmail app,
    // Outlook, etc.) so the current page is free to navigate.
    var sendBtn = document.querySelector('[data-action="send"]');
    if (sendBtn) {
      sendBtn.setAttribute('href', buildMailto());
      sendBtn.addEventListener('click', function () {
        // Do NOT preventDefault — let the mailto: launch the user's mail app.
        setTimeout(function () {
          var params = new URLSearchParams({ email: email, contact: 'sent' });
          window.location.href = 'confirmed.html?' + params.toString();
        }, 400);
      });
    }

    // Skip — navigate to confirmed.html without the sent chip
    var skipBtn = document.querySelector('[data-action="skip"]');
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var params = new URLSearchParams({
          email: email,
          contact: 'skipped'
        });
        window.location.href = 'confirmed.html?' + params.toString();
      });
    }
  }

  // --- Wire-up: Screen 2 (confirmed.html) ---------------------------------

  // Provider-specific tips — read out loud per copywriting rules.
  // Each tip explains the fail-state + the one-tap recovery, in voice.
  var TIPS = {
    gmail: {
      title: "Find the welcome — move it to Primary.",
      body: "Open your inbox. Gmail probably filed our welcome under <strong>Promotions</strong> — move it to your <strong>Primary</strong> tab (drag on desktop, or long-press the email and tap <strong>Move to → Primary</strong> on mobile). If it's not in Promotions, check <strong>Spam</strong> and mark it <strong>Not Spam</strong>."
    },
    apple: {
      title: "Find the welcome — move it to your inbox.",
      body: "Open Mail and look for our welcome. If it's not in your inbox, check the <strong>Junk</strong> folder and tap <strong>Move to Inbox</strong> — Apple Mail learns from then on."
    },
    outlook: {
      title: "Find the welcome — move it to Focused.",
      body: "Open Outlook and look for our welcome. If it's not in <strong>Focused</strong>, check the <strong>Other</strong> tab and choose <strong>Move to Focused</strong> (right-click on desktop, long-press on mobile). Still not there? Look in <strong>Junk</strong> and mark it <strong>Not Junk</strong>."
    },
    yahoo: {
      title: "Find the welcome — mark it Not Spam.",
      body: "Open Yahoo Mail and look for our welcome. If it's not in your inbox, check the <strong>Spam</strong> folder and mark it <strong>Not Spam</strong> — Yahoo will trust us from then on."
    },
    aol: {
      title: "Find the welcome — mark it Not Spam.",
      body: "Open AOL Mail and look for our welcome. If it's not in your inbox, check the <strong>Spam</strong> folder and mark it <strong>Not Spam</strong> — AOL will trust us from then on."
    },
    other: {
      title: "Find the welcome — and mark us as safe.",
      body: "Open your mail app and look for our welcome. If it's not in your inbox, check <strong>Spam</strong> or <strong>Junk</strong> and mark it as safe — your mail app will trust us from then on."
    }
  };

  function renderScreen2() {
    var email = getParam('email') || DEMO_EMAIL;
    var contact = getParam('contact'); // 'sent' | 'skipped' | ''
    var provider = detectProvider(email);
    var tip = TIPS[provider];

    // Sent confirmation chip — only shown when contact=sent
    var sentChip = document.querySelector('[data-sent-chip]');
    if (sentChip && contact !== 'sent') {
      sentChip.style.display = 'none';
    }

    // Tip block
    var tipTitle = document.querySelector('[data-tip-title]');
    var tipBody = document.querySelector('[data-tip-body]');
    if (tipTitle) tipTitle.textContent = tip.title;
    if (tipBody) tipBody.innerHTML = tip.body;
  }

  // --- Boot ---------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body.dataset.screen === 'index') renderScreen1();
    if (document.body.dataset.screen === 'confirmed') renderScreen2();
  });
})();
