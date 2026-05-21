/* ----------------------------------------------------------------------------
   BaseLocal · post-signup-inbox prototype
   Provider detection (from email domain) → renders provider-tailored numbered
   steps for finding the welcome email and moving it to the inbox.
   Spec.md is the source of truth — keep this file in sync with it.

   Note: this flow assumes BaseLocal sends via a Beehiiv sending-domain that
   does NOT accept inbound mail. So the deliverability action is "find the
   welcome and move it to your inbox" — a valid signal that needs no receiving
   mailbox on our side. An earlier iteration used a `mailto:` "send us a hi"
   action; that was dropped when the Beehiiv constraint was confirmed.
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

  // --- Provider-tailored steps -------------------------------------------

  // Each step is a single concrete action. Three steps per provider. The
  // sequence is consistent: (1) open the right place, (2) take the action,
  // (3) fallback if it's not where expected. <strong> marks bold inline.
  var STEPS = {
    gmail: [
      'Open Gmail and check your <strong>Promotions</strong> tab.',
      'Find the welcome from BaseLocal and move it to <strong>Primary</strong> — drag on desktop, or long-press the email and tap <strong>Move to → Primary</strong> on mobile.',
      'Not in Promotions? Look in <strong>Spam</strong> and mark it <strong>Not Spam</strong>.'
    ],
    apple: [
      'Open Mail and check your inbox.',
      'If the welcome isn\'t there, check the <strong>Junk</strong> folder.',
      'Tap the welcome and choose <strong>Move to Inbox</strong>.'
    ],
    outlook: [
      'Open Outlook and check <strong>Focused</strong>.',
      'If the welcome isn\'t there, check the <strong>Other</strong> tab. Right-click on desktop, or long-press on mobile, then choose <strong>Move to Focused</strong>.',
      'Still not there? Look in <strong>Junk</strong> and mark it <strong>Not Junk</strong>.'
    ],
    yahoo: [
      'Open Yahoo Mail and check your inbox.',
      'If the welcome isn\'t there, open the <strong>Spam</strong> folder.',
      'Find the welcome and mark it <strong>Not Spam</strong>.'
    ],
    aol: [
      'Open AOL Mail and check your inbox.',
      'If the welcome isn\'t there, open the <strong>Spam</strong> folder.',
      'Find the welcome and mark it <strong>Not Spam</strong>.'
    ],
    other: [
      'Open your mail app and check your inbox.',
      'If the welcome isn\'t there, check <strong>Spam</strong> or <strong>Junk</strong>.',
      'Find the welcome and mark it as <strong>safe</strong> (sometimes called "Not Spam" or "Move to Inbox").'
    ]
  };

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

  // --- Render -------------------------------------------------------------

  function render() {
    var email = getEmail();
    var provider = detectProvider(email);
    var label = PROVIDER_LABELS[provider];

    // Email confirmation line at the bottom of the page
    var chipEmail = document.querySelector('[data-chip-email]');
    if (chipEmail) chipEmail.textContent = email;

    // Provider chip — single text run; provider name bolded inline
    var chipText = document.querySelector('[data-chip-text]');
    if (chipText) chipText.innerHTML = 'Tailored for <strong>' + label + '</strong>';

    // Numbered steps — replace the static fallback with provider-tailored copy
    var stepsList = document.querySelector('[data-steps]');
    if (stepsList) {
      stepsList.innerHTML = STEPS[provider]
        .map(function (s) { return '<li>' + s + '</li>'; })
        .join('');
    }
  }

  // --- Boot ---------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', render);
})();
