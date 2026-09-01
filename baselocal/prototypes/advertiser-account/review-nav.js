/* BaseLocal · Advertiser Account prototype · REVIEW CHROME — not product code.
   ---------------------------------------------------------------------------
   A persistent, collapsible index so a reviewer can jump to any screen from any
   screen instead of walking back to start-here.html. Injects its own CSS, owns
   its own markup, touches nothing else: no sessionStorage, no `bl_advertiser`,
   no prototype classes, no listeners on prototype elements. Deliberately styled
   as dark scaffolding so it never reads as part of the product.

   Excluded from any production build. Delete this file and the ten
   <script src="review-nav.js" defer> tags and the prototype is unchanged.

   Placement: fixed bottom-LEFT. book.html's sticky Order Summary bar spans the
   full width at <1000px, so on that page the pill is lifted above the bar. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- pages ---
     The single source of truth for the widget. `file` + `query` build the href;
     `exact: true` means the entry only highlights when the query matches too
     (that is how a state link avoids stealing the highlight from its screen). */

  var SAMPLE_ORDER = 'type=business&markets=naples&days=2026-09-04,2026-09-08'
    + '&tier=directory_newsletter&total=50';

  var PAGES = [
    /* --- the index itself --- */
    { group: 'top', label: '★ Start here (full review index)', file: 'start-here.html' },

    /* --- the nine screens, flow order --- */
    { group: 'screens', n: 1, label: 'Create account', file: 'index.html' },
    { group: 'screens', n: 2, label: 'Sign in', file: 'signin.html' },
    { group: 'screens', n: 3, label: 'Setup', file: 'setup.html' },
    { group: 'screens', n: 4, label: 'Your markets', file: 'home.html' },
    { group: 'screens', n: 5, label: 'Market detail', file: 'market.html', query: 'm=naples' },
    { group: 'screens', n: 6, label: 'Book', file: 'book.html' },
    { group: 'screens', n: 7, label: 'Review and pay', file: 'review.html', query: SAMPLE_ORDER,
      note: 'sample order' },
    { group: 'screens', n: 8, label: 'Booked', file: 'booked.html',
      query: SAMPLE_ORDER + '&receipt=BL-9301', note: 'files a demo booking' },
    { group: 'screens', n: 9, label: 'Budget', file: 'budget.html' },

    /* --- a short list of high-value states; the full catalogue is on start-here --- */
    { group: 'states', label: 'First run', file: 'home.html', query: 'firstrun=1', exact: true },
    { group: 'states', label: 'Four or more markets', file: 'home.html',
      query: 'state=manymarkets', exact: true },
    { group: 'states', label: 'Verify your email', file: 'index.html',
      query: 'state=verify', exact: true },
    { group: 'states', label: 'Card declined', file: 'review.html',
      query: 'state=declined&' + SAMPLE_ORDER, exact: true }
  ];

  var GROUP_LABEL = { screens: 'Screens · flow order', states: 'Key states' };

  /* ------------------------------------------------------------------ css ---
     Everything is scoped under #rnav so nothing here can reach the prototype.
     Charcoal/near-black on purpose: this is scaffolding, not BaseLocal. */

  var CSS = [
    '#rnav{position:fixed;left:12px;bottom:12px;z-index:9000;',
    'font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;',
    'line-height:1.35;text-align:left;}',

    /* book.html carries the sticky Order Summary bar (~68px + shadow) below
       1000px, so lift clear of it there. Above 1000px the bar is display:none. */
    '@media (max-width:999px){body[data-page="book"] #rnav{bottom:96px;}}',

    '#rnav *{box-sizing:border-box;}',

    '#rnav-btn{display:inline-flex;align-items:center;gap:6px;',
    'background:#1B1B1F;color:#F2F2F3;border:1px solid #3A3A42;border-radius:999px;',
    'font-weight:700;font-size:11px;line-height:1;letter-spacing:.06em;text-transform:uppercase;',
    'padding:9px 13px;min-width:90px;justify-content:center;cursor:pointer;',
    'box-shadow:0 2px 10px rgba(0,0,0,.28);}',
    '#rnav-btn:hover{background:#2A2A31;}',
    '#rnav-btn .rnav-caret{font-size:9px;opacity:.75;transition:transform .15s ease;}',
    '#rnav.is-open #rnav-btn .rnav-caret{transform:rotate(180deg);}',
    '#rnav-btn:focus-visible{outline:2px solid #F2F2F3;outline-offset:2px;}',

    '#rnav-panel{position:absolute;left:0;bottom:calc(100% + 8px);',
    'width:262px;max-height:min(72vh,560px);overflow-y:auto;-webkit-overflow-scrolling:touch;',
    'background:#1B1B1F;border:1px solid #3A3A42;border-radius:8px;',
    'box-shadow:0 10px 30px rgba(0,0,0,.38);padding:6px 0;}',
    '#rnav-panel[hidden]{display:none;}',

    '#rnav .rnav-group{font-weight:900;font-size:9px;line-height:1;letter-spacing:.14em;text-transform:uppercase;',
    'color:#8B8B96;padding:12px 14px 6px;margin-top:4px;border-top:1px solid #2E2E36;}',
    '#rnav .rnav-group:first-child{border-top:none;margin-top:0;padding-top:8px;}',

    '#rnav a.rnav-item{display:flex;align-items:baseline;gap:8px;',
    'padding:8px 14px;color:#DCDCE1;text-decoration:none;font-weight:400;font-size:13px;line-height:1.35;}',
    '#rnav a.rnav-item:hover{background:#2A2A31;color:#FFF;text-decoration:none;}',
    '#rnav a.rnav-item:focus-visible{outline:2px solid #F2F2F3;outline-offset:-2px;border-radius:0;}',
    '#rnav a.rnav-item .rnav-n{flex:0 0 14px;color:#75757F;font-weight:700;font-size:10px;line-height:1.5;',
    'font-variant-numeric:tabular-nums;}',
    '#rnav a.rnav-item .rnav-label{flex:1 1 auto;}',
    '#rnav a.rnav-item .rnav-note{display:block;color:#85858F;font-size:11px;font-style:italic;}',
    '#rnav a.rnav-item[aria-current="page"]{background:#2F2F38;color:#FFF;font-weight:700;',
    'box-shadow:inset 3px 0 0 #C2604A;}',
    '#rnav a.rnav-item[aria-current="page"] .rnav-here{color:#C2604A;font-weight:700;font-size:9px;line-height:1;',
    'letter-spacing:.1em;text-transform:uppercase;margin-left:auto;padding-left:8px;}',

    '@media (prefers-reduced-motion:reduce){#rnav-btn .rnav-caret{transition:none;}}',
    '@media print{#rnav{display:none;}}'
  ].join('');

  /* ----------------------------------------------------------------- util --- */

  function fileOf(pathname) {
    var last = pathname.split('/').pop();
    return last === '' ? 'index.html' : last;
  }

  function normalise(search) {
    return (search || '').replace(/^\?/, '');
  }

  function hrefFor(p) {
    return p.query ? p.file + '?' + p.query : p.file;
  }

  var here = fileOf(location.pathname);
  var hereQuery = normalise(location.search);

  function isCurrent(p) {
    if (p.file !== here) return false;
    return p.exact ? normalise(p.query) === hereQuery : true;
  }

  /* Screens win the highlight over states; on a state URL (home.html?firstrun=1)
     the state entry is the more specific match, so it wins instead. */
  var currentEntry = null;
  PAGES.forEach(function (p) {
    if (!isCurrent(p)) return;
    if (!currentEntry || (p.exact && !currentEntry.exact)) currentEntry = p;
  });

  /* ----------------------------------------------------------------- build --- */

  function build() {
    if (document.getElementById('rnav')) return;

    var style = document.createElement('style');
    style.id = 'rnav-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var root = document.createElement('nav');
    root.id = 'rnav';
    root.setAttribute('aria-label', 'Prototype review navigation');

    var panel = document.createElement('div');
    panel.id = 'rnav-panel';
    panel.hidden = true;

    var lastGroup = null;
    PAGES.forEach(function (p) {
      if (p.group !== 'top' && p.group !== lastGroup) {
        var h = document.createElement('div');
        h.className = 'rnav-group';
        h.textContent = GROUP_LABEL[p.group] || p.group;
        panel.appendChild(h);
      }
      lastGroup = p.group;

      var a = document.createElement('a');
      a.className = 'rnav-item';
      a.href = hrefFor(p);

      if (p.n) {
        var n = document.createElement('span');
        n.className = 'rnav-n';
        n.setAttribute('aria-hidden', 'true');
        n.textContent = String(p.n);
        a.appendChild(n);
      }

      var label = document.createElement('span');
      label.className = 'rnav-label';
      label.appendChild(document.createTextNode(p.label));
      if (p.note) {
        var note = document.createElement('span');
        note.className = 'rnav-note';
        note.textContent = p.note;
        label.appendChild(note);
      }
      a.appendChild(label);

      if (p === currentEntry) {
        a.setAttribute('aria-current', 'page');
        var badge = document.createElement('span');
        badge.className = 'rnav-here';
        badge.textContent = 'here';
        a.appendChild(badge);
      }

      panel.appendChild(a);
    });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'rnav-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'rnav-panel');
    btn.appendChild(document.createTextNode('Review'));
    var caret = document.createElement('span');
    caret.className = 'rnav-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = '▾';
    btn.appendChild(caret);

    root.appendChild(panel);
    root.appendChild(btn);
    document.body.appendChild(root);

    function open() {
      panel.hidden = false;
      root.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      var cur = panel.querySelector('[aria-current="page"]');
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: 'nearest' });
    }

    function close(refocus) {
      panel.hidden = true;
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus();
    }

    /* No stopPropagation anywhere below: the prototype's own outside-click and
       Escape handlers must keep seeing every event exactly as they do today. */
    btn.addEventListener('click', function () {
      if (panel.hidden) open(); else close(false);
    });

    document.addEventListener('click', function (e) {
      if (!panel.hidden && !root.contains(e.target)) close(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) close(true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
