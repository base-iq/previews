/* ----------------------------------------------------------------------------
   BaseLocal · post-signup-stories prototype
   Provider detection (from the ?email= param) → renders a one-line,
   provider-tailored deliverability nudge and the subscribed-as line.
   Spec.md is the source of truth — keep this file in sync with it.

   Same domain→provider contract as the post-signup-inbox prototype. This
   version deliberately compresses the deliverability job to a single sentence:
   the page's focus is the most-read stories, not the inbox walkthrough.
---------------------------------------------------------------------------- */

(function () {
  'use strict';

  // --- Provider detection -------------------------------------------------

  // Maps an email domain to a provider key. Anything unmapped is "other".
  // Workspace/365 domains intentionally fall to "other" — no MX lookups here.
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

  function detectProvider(email) {
    if (!email || email.indexOf('@') === -1) return 'other';
    var domain = email.split('@')[1].trim().toLowerCase();
    return DOMAIN_MAP[domain] || 'other';
  }

  // --- Provider-tailored nudge ---------------------------------------------

  // One sentence per provider: where the welcome probably is, and the single
  // move that fixes deliverability. <strong> marks bold inline.
  var NUDGE = {
    gmail: 'Your welcome email is on its way — look in <strong>Promotions</strong> or <strong>Spam</strong> and drag it to <strong>Primary</strong>. One move fixes every edition after.',
    apple: 'Your welcome email is on its way — if it isn’t in your inbox, check <strong>Junk</strong> and choose <strong>Move to Inbox</strong>. One move fixes every edition after.',
    outlook: 'Your welcome email is on its way — if it isn’t in <strong>Focused</strong>, check <strong>Other</strong> or <strong>Junk</strong> and move it over. One move fixes every edition after.',
    yahoo: 'Your welcome email is on its way — if it isn’t in your inbox, check <strong>Spam</strong> and mark it <strong>Not Spam</strong>. One move fixes every edition after.',
    aol: 'Your welcome email is on its way — if it isn’t in your inbox, check <strong>Spam</strong> and mark it <strong>Not Spam</strong>. One move fixes every edition after.',
    other: 'Your welcome email is on its way — if it isn’t in your inbox, check <strong>Spam</strong> or <strong>Junk</strong> and mark it safe. One move fixes every edition after.'
  };

  // --- URL params -----------------------------------------------------------

  function getParam(name) {
    var p = new URLSearchParams(window.location.search);
    var v = p.get(name);
    return v ? v.trim() : '';
  }

  // Prototype default. In production the email arrives from the form submit;
  // this fallback only exists so the URL is openable for demos.
  var DEMO_EMAIL = 'reader@gmail.com';

  function getEmail() {
    return getParam('email') || DEMO_EMAIL;
  }

  // --- Render ----------------------------------------------------------------

  function render() {
    var email = getEmail();
    var provider = detectProvider(email);

    var nudge = document.querySelector('[data-nudge] p');
    if (nudge) {
      nudge.innerHTML = '<strong>You’re in.</strong> ' + NUDGE[provider];
    }

    var chipEmail = document.querySelector('[data-chip-email]');
    if (chipEmail) chipEmail.textContent = email;
  }

  // --- Boot --------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', render);
})();
