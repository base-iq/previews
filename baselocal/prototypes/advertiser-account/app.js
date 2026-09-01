/* =============================================================================
   BaseLocal · Advertiser Account prototype · app.js
   Vanilla JS, no build step, no dependencies. Everything is mocked client-side.
   ========================================================================== */

/* The click feed is broken upstream (see spec.md §7 open question 9).
   Flip this one flag to true and the Clicks module on market.html renders the
   available variant instead of the outage sentence. Nothing else changes. */
const CLICKS_AVAILABLE = false;

/* The prototype is pinned to a fixed "today" so the mocked inventory, run
   sheets and lead-time maths stay stable no matter when it is opened. */
const TODAY = '2026-09-01'; // Tuesday, September 1, 2026
const LEAD_DAYS = 3;        // three days' notice
const CANCEL_WINDOW_HOURS = 48;
const NAME_MAX = 80;
const CAP = { business: 2, event: 6 }; // spotlights 2/market/day · events 6/market/day
const UNIT = { directory: 10, directory_newsletter: 25 }; // dollars per market per day
const TIER_LABEL = { directory: 'Directory', directory_newsletter: 'Directory + newsletter' };

/* ---------------------------------------------------------------- dates --- */
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function toDate(isoStr) {
  const [y, m, d] = isoStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toIso(dt) {
  const p = n => String(n).padStart(2, '0');
  return dt.getFullYear() + '-' + p(dt.getMonth() + 1) + '-' + p(dt.getDate());
}
function addDays(isoStr, n) {
  const dt = toDate(isoStr);
  dt.setDate(dt.getDate() + n);
  return toIso(dt);
}
function weekdayOf(isoStr) { return WEEKDAYS[toDate(isoStr).getDay()]; }
function monthOf(isoStr) { return MONTHS[toDate(isoStr).getMonth()]; }
function dayOf(isoStr) { return toDate(isoStr).getDate(); }
function yearOf(isoStr) { return toDate(isoStr).getFullYear(); }
function fmtMonthDay(isoStr) { return monthOf(isoStr) + ' ' + dayOf(isoStr); }
function fmtShort(isoStr) { return MONTHS_SHORT[toDate(isoStr).getMonth()] + ' ' + dayOf(isoStr); }
function fmtLong(isoStr) { return weekdayOf(isoStr) + ', ' + fmtMonthDay(isoStr); }
function fmtRunDate(isoStr) { return weekdayOf(isoStr).slice(0, 3) + ', ' + fmtShort(isoStr); }
const FIRST_BOOKABLE = addDays(TODAY, LEAD_DAYS); // 2026-09-04

/* --------------------------------------------------------------- format --- */
function num(n) { return n.toLocaleString('en-US'); }
function money(dollars) { return '$' + num(dollars); }
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
function numberWord(n) { return NUMBER_WORDS[n] || num(n); }
function joinList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}
function plural(n, one, many) { return n === 1 ? one : many; }
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------- markets ---
   Audience figures for the four demo markets are real, rounded platform reads
   (live read 2026-09-01) and are approved for public display alongside the
   visible "Sample data" stamp. Every other market in the picker carries
   illustrative figures — see spec.md §5.
   ------------------------------------------------------------------------ */
const STATE_NAMES = {
  FL: 'Florida', NM: 'New Mexico', AZ: 'Arizona', CO: 'Colorado',
  TX: 'Texas', NC: 'North Carolina', OH: 'Ohio'
};

const MARKETS = [
  { slug: 'naples', city: 'Naples', state: 'FL', real: true, subscribers: 11879, open_rate: 58, open_rate_prev: 56, editions_30d: 69, delivered_30d: 764768, clicks_30d: 8280 },
  { slug: 'fort-myers', city: 'Fort Myers', state: 'FL', subscribers: 9420, open_rate: 51, open_rate_prev: 51, editions_30d: 69, delivered_30d: 601310, clicks_30d: 5940 },
  { slug: 'cape-coral', city: 'Cape Coral', state: 'FL', subscribers: 6115, open_rate: 49, open_rate_prev: 50, editions_30d: 69, delivered_30d: 389330, clicks_30d: 3410 },
  { slug: 'bonita-springs', city: 'Bonita Springs', state: 'FL', subscribers: 3240, open_rate: 55, open_rate_prev: 54, editions_30d: 69, delivered_30d: 206160, clicks_30d: 2180 },
  { slug: 'sarasota', city: 'Sarasota', state: 'FL', subscribers: 8730, open_rate: 53, open_rate_prev: 52, editions_30d: 69, delivered_30d: 556220, clicks_30d: 5010 },
  { slug: 'marco-island', city: 'Marco Island', state: 'FL', subscribers: 1980, open_rate: 61, open_rate_prev: 60, editions_30d: 69, delivered_30d: 126170, clicks_30d: 1490 },

  { slug: 'albuquerque', city: 'Albuquerque', state: 'NM', real: true, subscribers: 2856, open_rate: 43, open_rate_prev: 45, editions_30d: 69, delivered_30d: 174837, clicks_30d: 1610 },
  { slug: 'rio-rancho', city: 'Rio Rancho', state: 'NM', real: true, subscribers: 890, open_rate: 40, open_rate_prev: 40, editions_30d: 69, delivered_30d: 59042, clicks_30d: 470 },
  { slug: 'santa-fe', city: 'Santa Fe', state: 'NM', real: true, subscribers: 4006, open_rate: 59, open_rate_prev: 59, editions_30d: 136, delivered_30d: 262371, clicks_30d: 3120 },
  { slug: 'las-cruces', city: 'Las Cruces', state: 'NM', subscribers: 2140, open_rate: 47, open_rate_prev: 46, editions_30d: 69, delivered_30d: 136300, clicks_30d: 1180 },
  { slug: 'farmington', city: 'Farmington', state: 'NM', subscribers: 760, open_rate: 44, open_rate_prev: 44, editions_30d: 69, delivered_30d: 48400, clicks_30d: 390 },

  { slug: 'scottsdale', city: 'Scottsdale', state: 'AZ', subscribers: 7310, open_rate: 50, open_rate_prev: 51, editions_30d: 69, delivered_30d: 465800, clicks_30d: 4120 },
  { slug: 'tucson', city: 'Tucson', state: 'AZ', subscribers: 5880, open_rate: 46, open_rate_prev: 46, editions_30d: 69, delivered_30d: 374600, clicks_30d: 2960 },
  { slug: 'flagstaff', city: 'Flagstaff', state: 'AZ', subscribers: 2210, open_rate: 54, open_rate_prev: 53, editions_30d: 69, delivered_30d: 140800, clicks_30d: 1520 },
  { slug: 'sedona', city: 'Sedona', state: 'AZ', subscribers: 1140, open_rate: 60, open_rate_prev: 59, editions_30d: 69, delivered_30d: 72600, clicks_30d: 890 },

  { slug: 'boulder', city: 'Boulder', state: 'CO', subscribers: 6640, open_rate: 56, open_rate_prev: 55, editions_30d: 69, delivered_30d: 423000, clicks_30d: 4480 },
  { slug: 'fort-collins', city: 'Fort Collins', state: 'CO', subscribers: 5120, open_rate: 52, open_rate_prev: 52, editions_30d: 69, delivered_30d: 326200, clicks_30d: 3070 },
  { slug: 'colorado-springs', city: 'Colorado Springs', state: 'CO', subscribers: 8940, open_rate: 48, open_rate_prev: 49, editions_30d: 69, delivered_30d: 569600, clicks_30d: 4890 },
  { slug: 'durango', city: 'Durango', state: 'CO', subscribers: 1460, open_rate: 57, open_rate_prev: 56, editions_30d: 69, delivered_30d: 93000, clicks_30d: 1010 },

  { slug: 'austin', city: 'Austin', state: 'TX', subscribers: 14320, open_rate: 45, open_rate_prev: 46, editions_30d: 69, delivered_30d: 912400, clicks_30d: 7640 },
  { slug: 'round-rock', city: 'Round Rock', state: 'TX', subscribers: 4180, open_rate: 47, open_rate_prev: 47, editions_30d: 69, delivered_30d: 266300, clicks_30d: 2240 },
  { slug: 'san-marcos', city: 'San Marcos', state: 'TX', subscribers: 1720, open_rate: 50, open_rate_prev: 49, editions_30d: 69, delivered_30d: 109600, clicks_30d: 980 },
  { slug: 'new-braunfels', city: 'New Braunfels', state: 'TX', subscribers: 2640, open_rate: 52, open_rate_prev: 51, editions_30d: 69, delivered_30d: 168200, clicks_30d: 1560 },

  { slug: 'asheville', city: 'Asheville', state: 'NC', subscribers: 6980, open_rate: 55, open_rate_prev: 54, editions_30d: 69, delivered_30d: 444800, clicks_30d: 4610 },
  { slug: 'wilmington', city: 'Wilmington', state: 'NC', subscribers: 5340, open_rate: 51, open_rate_prev: 51, editions_30d: 69, delivered_30d: 340300, clicks_30d: 3120 },
  { slug: 'chapel-hill', city: 'Chapel Hill', state: 'NC', subscribers: 3120, open_rate: 58, open_rate_prev: 57, editions_30d: 69, delivered_30d: 198800, clicks_30d: 2280 },
  { slug: 'greensboro', city: 'Greensboro', state: 'NC', subscribers: 4890, open_rate: 44, open_rate_prev: 45, editions_30d: 69, delivered_30d: 311600, clicks_30d: 2440 },

  { slug: 'columbus', city: 'Columbus', state: 'OH', subscribers: 11240, open_rate: 46, open_rate_prev: 46, editions_30d: 69, delivered_30d: 716200, clicks_30d: 5980 },
  { slug: 'dayton', city: 'Dayton', state: 'OH', subscribers: 4460, open_rate: 43, open_rate_prev: 44, editions_30d: 69, delivered_30d: 284100, clicks_30d: 2110 },
  { slug: 'toledo', city: 'Toledo', state: 'OH', subscribers: 3980, open_rate: 42, open_rate_prev: 42, editions_30d: 69, delivered_30d: 253600, clicks_30d: 1830 }
];
MARKETS.forEach(m => { m.last_sent = TODAY; });

const MARKET_BY_SLUG = {};
MARKETS.forEach(m => { MARKET_BY_SLUG[m.slug] = m; });
function market(slug) { return MARKET_BY_SLUG[slug] || null; }
function marketName(slug) { const m = market(slug); return m ? m.city : slug; }
function marketFull(slug) { const m = market(slug); return m ? m.city + ', ' + m.state : slug; }

const CATEGORIES = ['Eat & drink', 'Shop', 'Services', 'Wellness', 'Beauty',
  'Fitness', 'Home & garden', 'Kids & pets'];

/* ------------------------------------------------------------- inventory ---
   Seeded sold-counts. Own bookings are added on top, so the open / partial /
   full day states below all actually render in the calendar. See spec.md §5. */
const BASE_SOLD = {
  // Naples — one day at capacity so the run sheet + availability line have a
  // "both taken" day; events part-sold so "4 of 6 open" is true.
  'naples|2026-09-10|business': 2,
  'naples|2026-09-17|business': 2,
  'naples|2026-09-04|event': 2,
  'naples|2026-09-24|business': 2,
  // Rio Rancho — full through Sunday Sep 6, first opening Monday Sep 7.
  'rio-rancho|2026-09-04|business': 2,
  'rio-rancho|2026-09-05|business': 2,
  'rio-rancho|2026-09-06|business': 2,
  // Sep 9 is full in every New Mexico market — a crossed-off day for Zia.
  'albuquerque|2026-09-09|business': 2,
  'rio-rancho|2026-09-09|business': 2,
  'santa-fe|2026-09-09|business': 2,
  'albuquerque|2026-09-09|event': 6,
  'rio-rancho|2026-09-09|event': 6,
  'santa-fe|2026-09-09|event': 6,
  // Santa Fe Sep 5 has exactly one spot left — the slot-lost trigger.
  'santa-fe|2026-09-05|business': 1,
  'santa-fe|2026-09-05|event': 5,
  // A little texture elsewhere.
  'albuquerque|2026-09-11|business': 1,
  'santa-fe|2026-09-15|business': 1,
  'naples|2026-09-19|business': 1
};

/* Slots lost mid-flow during this browsing session (the mocked 15-minute hold
   expiring under the user). Kept in memory only. */
const LOST_SLOTS = new Set();

function baseSold(slug, isoStr, kind) {
  const key = slug + '|' + isoStr + '|' + kind;
  let n = BASE_SOLD[key] || 0;
  if (LOST_SLOTS.has(key)) n = CAP[kind];
  return n;
}
function ownSold(slug, isoStr, kind, acct) {
  let n = 0;
  (acct.bookings || []).forEach(b => {
    if (b.type !== kind) return;
    if (b.markets.indexOf(slug) === -1) return;
    if (b.days.indexOf(isoStr) === -1) return;
    if (b.status === 'refunded') return;
    n += 1;
  });
  return n;
}
function soldOn(slug, isoStr, kind, acct) {
  return Math.min(CAP[kind], baseSold(slug, isoStr, kind) + ownSold(slug, isoStr, kind, acct));
}
function openOn(slug, isoStr, kind, acct) {
  return CAP[kind] - soldOn(slug, isoStr, kind, acct);
}
function hasRoom(slug, isoStr, kind, acct) { return openOn(slug, isoStr, kind, acct) > 0; }

/* Day state across N selected markets: open if all have room, partial if some,
   full if none. */
function dayState(slugs, isoStr, kind, acct) {
  if (!slugs.length) return 'open';
  const openIn = slugs.filter(s => hasRoom(s, isoStr, kind, acct));
  if (openIn.length === slugs.length) return 'open';
  if (openIn.length === 0) return 'full';
  return 'partial';
}
function nextOpenDay(slug, kind, acct, fromIso) {
  let d = fromIso || FIRST_BOOKABLE;
  for (let i = 0; i < 120; i++) {
    if (hasRoom(slug, d, kind, acct)) return d;
    d = addDays(d, 1);
  }
  return null;
}
function nextFullDay(slug, kind, acct, fromIso) {
  let d = fromIso || FIRST_BOOKABLE;
  for (let i = 0; i < 120; i++) {
    if (!hasRoom(slug, d, kind, acct)) return d;
    d = addDays(d, 1);
  }
  return null;
}
/* A market is "full through {date}" when the first bookable day is taken. */
function fullThrough(slug, acct) {
  if (hasRoom(slug, FIRST_BOOKABLE, 'business', acct)) return null;
  let d = FIRST_BOOKABLE;
  while (!hasRoom(slug, addDays(d, 1), 'business', acct)) d = addDays(d, 1);
  return { lastFull: d, firstOpen: addDays(d, 1) };
}

/* -------------------------------------------------------- demo accounts --- */
function seedAccounts() {
  return {
    rivera: {
      id: 'rivera',
      email: 'front-desk@riveradentalstudio.com',
      business: {
        name: 'Rivera Dental Studio',
        category: 'Wellness',
        website: 'https://riveradentalstudio.com',
        address: '1200 5th Ave S, Naples FL',
        phone: '(239) 555-0148'
      },
      contact: { name: 'Marisol Rivera', role: 'Owner' },
      markets: ['naples'],
      monthly_ceiling_cents: 50000,
      payment_method: { brand: 'Visa', last4: '4242', exp: '04/29' },
      bookings: [
        {
          id: 'BL-8841', charged: '2026-08-11', type: 'business', tier: 'directory_newsletter',
          markets: ['naples'], days: ['2026-08-13', '2026-08-14'], status: 'refunded',
          receipt_status: 'refunded'
        },
        {
          id: 'BL-8977', charged: '2026-08-18', type: 'business', tier: 'directory_newsletter',
          markets: ['naples'], days: ['2026-08-20', '2026-08-21', '2026-08-25'], status: 'ran',
          receipt_status: 'partly_refunded', refunded_days: ['2026-08-25']
        },
        {
          id: 'BL-9103', charged: '2026-08-27', type: 'business', tier: 'directory_newsletter',
          markets: ['naples'], days: ['2026-09-01', '2026-09-02', '2026-09-03'],
          status: 'scheduled', receipt_status: 'paid'
        },
        {
          id: 'BL-9241', charged: '2026-09-01', type: 'business', tier: 'directory_newsletter',
          markets: ['naples'],
          days: ['2026-09-04', '2026-09-08', '2026-09-11', '2026-09-15',
            '2026-09-18', '2026-09-22', '2026-09-25', '2026-09-29'],
          status: 'in_review', receipt_status: 'paid'
        },
        {
          id: 'BL-9242', charged: '2026-09-01', type: 'event', tier: 'directory',
          markets: ['naples'],
          days: ['2026-09-05', '2026-09-06', '2026-09-09', '2026-09-12', '2026-09-13',
            '2026-09-19', '2026-09-20', '2026-09-26', '2026-09-27', '2026-09-30'],
          status: 'in_review', receipt_status: 'paid'
        }
      ]
    },
    zia: {
      id: 'zia',
      email: 'buying@ziamediagroup.com',
      business: {
        name: 'Zia Media Group',
        category: 'Services',
        website: 'https://ziamediagroup.com',
        address: 'Albuquerque, Rio Rancho and Santa Fe',
        phone: '(505) 555-0172'
      },
      contact: { name: 'Daniel Ortiz', role: 'Media buyer' },
      markets: ['albuquerque', 'rio-rancho', 'santa-fe'],
      monthly_ceiling_cents: 50000,
      payment_method: { brand: 'Visa', last4: '4242', exp: '04/29' },
      bookings: [
        {
          id: 'BL-8620', charged: '2026-08-05', type: 'event', tier: 'directory',
          markets: ['albuquerque', 'santa-fe'], days: ['2026-08-08'],
          status: 'refunded', receipt_status: 'refunded'
        },
        {
          id: 'BL-8802', charged: '2026-08-21', type: 'business', tier: 'directory_newsletter',
          markets: ['albuquerque', 'rio-rancho', 'santa-fe'],
          days: ['2026-08-24', '2026-08-25'], status: 'ran', receipt_status: 'paid'
        },
        {
          id: 'BL-9250', charged: '2026-09-01', type: 'business', tier: 'directory_newsletter',
          markets: ['santa-fe'], days: ['2026-09-02', '2026-09-03', '2026-09-07'],
          status: 'in_review', receipt_status: 'paid'
        }
      ]
    }
  };
}

/* ------------------------------------------------------- session storage --- */
const STORE_KEY = 'bl_advertiser';

function loadState() {
  let raw = null;
  try { raw = sessionStorage.getItem(STORE_KEY); } catch (e) { raw = null; }
  let state = null;
  if (raw) { try { state = JSON.parse(raw); } catch (e) { state = null; } }
  if (!state || !state.accounts || !state.accounts.rivera || !state.accounts.zia) {
    state = { active: 'rivera', accounts: seedAccounts() };
    saveState(state);
  }
  return state;
}
function saveState(state) {
  try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
}
function resetState() {
  const state = { active: 'rivera', accounts: seedAccounts() };
  saveState(state);
  return state;
}
let STATE = loadState();
function account() { return STATE.accounts[STATE.active]; }
function commit() { saveState(STATE); }
function switchAccount(id) {
  if (!STATE.accounts[id]) return;
  STATE.active = id;
  commit();
  location.reload();
}

/* --------------------------------------------------------- booking maths --- */
function unitPrice(tier) { return UNIT[tier] || UNIT.directory_newsletter; }
function bookingTotal(b) { return b.markets.length * b.days.length * unitPrice(b.tier); }

function isRefundedDay(b, isoStr) {
  if (b.status === 'refunded') return true;
  return !!(b.refunded_days && b.refunded_days.indexOf(isoStr) !== -1);
}
/* Placement-day status → Status Chip label. */
function dayStatus(b, isoStr) {
  if (isRefundedDay(b, isoStr)) return 'Refunded';
  if (isoStr < TODAY) return 'Ran';
  if (isoStr === TODAY) return 'Live';
  if (b.status === 'in_review') return 'In review';
  return 'Set';
}
function placementLabel(b) {
  const what = b.type === 'business' ? 'Spotlight' : 'Event';
  const where = b.tier === 'directory_newsletter' ? 'newsletter + directory' : 'directory';
  return what + ' — ' + where;
}
function chargedInMonth(acct, isoMonthRef) {
  const y = yearOf(isoMonthRef), m = toDate(isoMonthRef).getMonth();
  let total = 0;
  (acct.bookings || []).forEach(b => {
    const c = toDate(b.charged);
    if (c.getFullYear() === y && c.getMonth() === m) total += bookingTotal(b);
  });
  return total;
}
function paidNotRun(acct) {
  let total = 0;
  (acct.bookings || []).forEach(b => {
    b.days.forEach(day => {
      if (day > TODAY && !isRefundedDay(b, day)) total += b.markets.length * unitPrice(b.tier);
    });
  });
  return total;
}
function ceilingDollars(acct) {
  return acct.monthly_ceiling_cents == null ? null : Math.round(acct.monthly_ceiling_cents / 100);
}
/* Every (booking, day) pair that touches a market, newest day first. */
function runSheetRows(acct, slug) {
  const rows = [];
  (acct.bookings || []).forEach(b => {
    if (b.markets.indexOf(slug) === -1) return;
    b.days.forEach(day => {
      rows.push({
        day: day,
        placement: placementLabel(b),
        status: dayStatus(b, day),
        cost: unitPrice(b.tier)
      });
    });
  });
  rows.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
  return rows;
}
function upcomingDays(acct, slug) {
  const days = [];
  (acct.bookings || []).forEach(b => {
    if (slug && b.markets.indexOf(slug) === -1) return;
    if (b.status === 'refunded') return;
    b.days.forEach(day => { if (day >= TODAY && !isRefundedDay(b, day)) days.push({ day: day, b: b }); });
  });
  days.sort((a, b) => (a.day < b.day ? -1 : 1));
  return days;
}

/* ============================================================================
   Chrome
   ========================================================================== */
const LOGO_DARK = '../../assets/logos/baselocal-full-dark.svg';
const LOGO_WHITE = '../../assets/logos/baselocal-full-white.svg';

function bareHeader() {
  return '<header class="site-header"><div class="site-header-inner">'
    + '<a class="logo-link" href="index.html"><img src="' + LOGO_DARK + '" alt="BaseLocal"></a>'
    + '</div></header>';
}

function accountHeader(active) {
  const acct = account();
  const nav = [
    { href: 'home.html', label: 'Markets', key: 'markets' },
    { href: 'book.html', label: 'Book', key: 'book' },
    { href: 'budget.html', label: 'Budget', key: 'budget' }
  ].map(i => '<a href="' + i.href + '"' + (i.key === active ? ' class="active" aria-current="page"' : '') + '>'
    + i.label + '</a>').join('');

  const others = Object.keys(STATE.accounts).map(id =>
    '<button type="button" data-switch="' + id + '"'
    + (id === STATE.active ? ' class="is-current" aria-current="true"' : '') + '>'
    + esc(STATE.accounts[id].business.name) + '</button>').join('');

  return '<header class="site-header"><div class="site-header-inner">'
    + '<a class="logo-link" href="home.html"><img src="' + LOGO_DARK + '" alt="BaseLocal"></a>'
    + '<nav class="acct-nav" aria-label="Account sections">' + nav + '</nav>'
    + '<div class="acct-menu">'
    + '<button type="button" class="acct-menu-btn" id="acctMenuBtn" aria-expanded="false" aria-haspopup="true">'
    + '<span class="who">' + esc(acct.business.name) + '</span><span class="caret" aria-hidden="true">▾</span></button>'
    + '<div class="acct-menu-panel" id="acctMenuPanel" hidden role="menu">'
    + '<a href="setup.html" role="menuitem">Business details</a>'
    + '<a href="budget.html#card-on-file" role="menuitem">Payment method</a>'
    + '<a href="signin.html" role="menuitem" data-signout="1">Sign out</a>'
    + '<div class="acct-menu-group">Demo account</div>'
    + others
    + '<button type="button" data-reset="1">Reset demo data</button>'
    + '</div></div></div></header>';
}

function siteFooter() {
  return '<footer class="site-footer"><div class="site-footer-inner">'
    + '<div class="footer-top">'
    + '<div class="footer-brand"><img src="' + LOGO_WHITE + '" alt="BaseLocal">'
    + '<p class="footer-tagline">Local news, events, and recommendations for 400+ markets.</p></div>'
    + '<div class="footer-col"><h4>Legal</h4>'
    + '<a href="#">Advertising terms</a><a href="#">Privacy</a></div>'
    + '<div class="footer-col"><h4>Contact</h4>'
    + '<a href="mailto:partner@baselocal.com">partner@baselocal.com</a></div>'
    + '</div>'
    + '<p class="footer-bottom">© 2026 BaseLocal. Placements are reviewed by a local editor before they run.</p>'
    + '</div></footer>';
}

function mountChrome(kind, active) {
  const head = document.getElementById('header-slot');
  if (head) head.outerHTML = kind === 'account' ? accountHeader(active) : bareHeader();
  const foot = document.getElementById('footer-slot');
  if (foot) foot.outerHTML = siteFooter();
  wireAccountMenu();
  measureHeader();
  window.addEventListener('resize', measureHeader);
}

/* The Sticky Filter & Utility Bar offsets its `top` by the sticky header's
   height (§ Sticky Filter & Utility Bar). The Account Header wraps to two rows
   below 768px, so the height is measured rather than hard-coded. */
function measureHeader() {
  const h = document.querySelector('header.site-header');
  if (!h) return;
  document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
}

function wireAccountMenu() {
  const btn = document.getElementById('acctMenuBtn');
  const panel = document.getElementById('acctMenuPanel');
  if (!btn || !panel) return;
  const close = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = panel.hidden;
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!panel.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  panel.querySelectorAll('[data-switch]').forEach(b => {
    b.addEventListener('click', () => switchAccount(b.dataset.switch));
  });
  panel.querySelectorAll('[data-reset]').forEach(b => {
    b.addEventListener('click', () => { STATE = resetState(); location.href = 'home.html'; });
  });
  panel.querySelectorAll('[data-signout]').forEach(a => {
    a.addEventListener('click', () => { try { sessionStorage.removeItem(STORE_KEY); } catch (e) {} });
  });
}

/* ============================================================================
   Small shared renderers
   ========================================================================== */
const CHIP_CLASS = {
  'In review': 'is-review', 'Set': 'is-set', 'Live': 'is-live',
  'Ran': 'is-ran', 'Refunded': 'is-refunded',
  'Paid': 'is-paid', 'Partly refunded': 'is-partly'
};
function statusChip(label) {
  return '<span class="chip-status ' + (CHIP_CLASS[label] || 'is-set') + '">' + label + '</span>';
}
function sampleStamp() { return '<span class="sample-stamp">Sample data</span>'; }
function metricTile(figure, label, tip) {
  return '<div class="metric-tile"><div class="figure">' + figure + '</div>'
    + '<div class="label">' + label
    + (tip ? ' <span class="tip" tabindex="0" role="img" aria-label="' + esc(tip) + '" title="' + esc(tip) + '">i</span>' : '')
    + '</div></div>';
}
function stepIndicator(labels, currentIndex) {
  const n = labels.length;
  let connectors = '';
  for (let i = 0; i < n - 1; i++) {
    const left = ((i + 0.5) / n) * 100;
    const right = 100 - ((i + 1.5) / n) * 100;
    const done = i + 1 <= currentIndex;
    connectors += '<div class="connector' + (done ? ' complete' : '') + '" style="left:' + left + '%;right:' + right + '%"></div>';
  }
  const steps = labels.map((l, i) => {
    const cls = i < currentIndex ? 'complete' : (i === currentIndex ? 'current' : '');
    const inner = i < currentIndex ? '✓' : String(i + 1);
    return '<div class="step ' + cls + '"><div class="circle">' + inner + '</div><div class="label">' + l + '</div></div>';
  }).join('');
  return '<div class="step-pill-wrap"><span class="step-pill">Step ' + (currentIndex + 1)
    + ' of ' + n + ' · ' + labels[currentIndex] + '</span></div>'
    + '<div class="step-indicator" aria-hidden="true">' + connectors + steps + '</div>';
}

/* Clicks module — the one place CLICKS_AVAILABLE is read. */
function clicksModule(m) {
  const body = CLICKS_AVAILABLE
    ? '<p class="is-available">Readers clicked ' + num(m.clicks_30d) + ' links in ' + m.city + ' last month.</p>'
    : '<p>Our click counter stopped updating on August 16, so there’s nothing here we’d stand behind. '
      + 'Subscribers, opens and send dates above are current through this morning.</p>';
  return '<div class="clicks-block"><h3>Clicks</h3>' + body + '</div>';
}

/* ============================================================================
   Location Multi-Select
   ========================================================================== */
function LocationPicker(root, opts) {
  const selected = new Set(opts.selected || []);
  const state = { query: '' };

  function groups() {
    const q = state.query.trim().toLowerCase();
    const out = [];
    const byState = {};
    MARKETS.forEach(m => {
      const label = m.city + ', ' + m.state;
      if (q && label.toLowerCase().indexOf(q) === -1) return;
      (byState[m.state] = byState[m.state] || []).push(m);
    });
    Object.keys(byState).forEach(st => out.push({ state: st, name: STATE_NAMES[st] || st, items: byState[st] }));
    return out;
  }

  function render() {
    const gs = groups();
    let html = '';
    html += '<div class="loc-search-wrap"><label class="sr-only" for="' + opts.id + '-search">'
      + esc(opts.searchLabel || 'Search markets') + '</label>'
      + '<input class="loc-search" id="' + opts.id + '-search" type="text" autocomplete="off" '
      + 'placeholder="' + esc(opts.searchPlaceholder) + '" value="' + esc(state.query) + '"></div>';
    html += '<div class="loc-actions">'
      + '<button type="button" class="btn secondary small" data-all="1">+ All markets</button>'
      + '<button type="button" class="btn secondary small" data-clear="1">Clear all</button></div>';

    html += '<div class="loc-chips">';
    Array.from(selected).forEach(slug => {
      html += '<span class="chip">' + esc(marketFull(slug))
        + '<button type="button" class="x" data-remove="' + slug + '" aria-label="Remove '
        + esc(marketFull(slug)) + '">×</button></span>';
    });
    html += '</div>';

    html += '<div class="loc-list">';
    html += '<div class="loc-counter">' + selected.size + ' selected</div>';
    if (!gs.length) {
      html += '<div class="loc-empty">No markets match “' + esc(state.query) + '.”</div>';
    } else {
      gs.forEach(g => {
        const allIn = g.items.every(m => selected.has(m.slug));
        html += '<div class="loc-group-header"><span>' + esc(g.name) + '</span>'
          + '<button type="button" class="select-all" data-group="' + g.state + '">'
          + (allIn ? 'Clear ' + esc(g.name) : 'Select all in ' + esc(g.name)) + '</button></div>';
        g.items.forEach(m => {
          const on = selected.has(m.slug);
          html += '<button type="button" class="loc-row' + (on ? ' selected' : '') + '" data-slug="' + m.slug + '"'
            + ' aria-pressed="' + on + '">'
            + '<span class="check" aria-hidden="true"></span>'
            + '<span class="loc-name">' + esc(m.city + ', ' + m.state) + ' — '
            + '<span class="loc-subs">' + num(m.subscribers) + ' subscribers</span></span>'
            + '</button>';
        });
      });
    }
    html += '</div>';
    html += '<p class="loc-recency">Counts are from this morning’s send.</p>';
    if (selected.size >= 2) {
      let subs = 0;
      selected.forEach(s => { subs += market(s).subscribers; });
      html += '<p class="loc-combined">' + selected.size + ' markets · ' + num(subs) + ' subscribers combined.</p>';
    }
    root.innerHTML = html;
    wire();
    if (opts.onChange) opts.onChange(Array.from(selected));
  }

  function wire() {
    const search = root.querySelector('.loc-search');
    search.addEventListener('input', () => {
      state.query = search.value;
      render();
      const s2 = root.querySelector('.loc-search');
      s2.focus();
      s2.setSelectionRange(s2.value.length, s2.value.length);
    });
    root.querySelector('[data-all]').addEventListener('click', () => {
      MARKETS.forEach(m => selected.add(m.slug)); render();
    });
    root.querySelector('[data-clear]').addEventListener('click', () => { selected.clear(); render(); });
    root.querySelectorAll('[data-remove]').forEach(b =>
      b.addEventListener('click', () => { selected.delete(b.dataset.remove); render(); }));
    root.querySelectorAll('[data-group]').forEach(b =>
      b.addEventListener('click', () => {
        const items = MARKETS.filter(m => m.state === b.dataset.group);
        const allIn = items.every(m => selected.has(m.slug));
        items.forEach(m => allIn ? selected.delete(m.slug) : selected.add(m.slug));
        render();
      }));
    root.querySelectorAll('.loc-row').forEach(b =>
      b.addEventListener('click', () => {
        const s = b.dataset.slug;
        selected.has(s) ? selected.delete(s) : selected.add(s);
        render();
      }));
  }

  render();
  return { get: () => Array.from(selected) };
}

/* ============================================================================
   Multi-Select Calendar (with the NEW partial day state)
   ========================================================================== */
function Calendar(root, opts) {
  const selected = new Set(opts.selected || []);
  let cursor = FIRST_BOOKABLE.slice(0, 7); // 'YYYY-MM'
  let helperText = '';

  function monthStart(ym) { return ym + '-01'; }
  function stateFor(isoStr) {
    return dayState(opts.getMarkets(), isoStr, opts.getKind(), account());
  }
  function partialHelper(isoStr) {
    const kind = opts.getKind();
    const slugs = opts.getMarkets();
    const openIn = slugs.filter(s => hasRoom(s, isoStr, kind, account())).map(marketName);
    const fullIn = slugs.filter(s => !hasRoom(s, isoStr, kind, account())).map(marketName);
    return fmtMonthDay(isoStr) + ' — open in ' + joinList(openIn) + ', full in ' + joinList(fullIn) + '.';
  }

  function render() {
    const first = toDate(monthStart(cursor));
    const y = first.getFullYear(), mo = first.getMonth();
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const lead = first.getDay();

    let html = '';
    html += '<div class="cal-quick">'
      + '<button type="button" class="pill" data-quick="weekend">This weekend</button>'
      + '<button type="button" class="pill" data-quick="7">Next 7 days</button>'
      + '<button type="button" class="pill" data-quick="30">Next 30 days</button>'
      + '<button type="button" class="pill" data-quick="clear">Clear</button>'
      + '</div>';

    const atFirstMonth = cursor === FIRST_BOOKABLE.slice(0, 7);
    html += '<div class="cal-month-header">'
      + '<button type="button" class="cal-nav" data-nav="-1" aria-label="Previous month"'
      + (atFirstMonth ? ' hidden' : '') + '>‹</button>'
      + '<div class="cal-month-title">' + MONTHS[mo] + ' ' + y + '</div>'
      + '<button type="button" class="cal-nav" data-nav="1" aria-label="Next month">›</button>'
      + '</div>';

    html += '<div class="cal-weekdays" aria-hidden="true">'
      + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => '<div>' + d + '</div>').join('')
      + '</div>';

    html += '<div class="cal-grid" role="group" aria-label="Pick the days your placement runs">';
    for (let i = 0; i < lead; i++) html += '<div class="cal-day blank" aria-hidden="true"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isoStr = cursor + '-' + String(d).padStart(2, '0');
      const cls = ['cal-day'];
      let disabled = false, title = '';
      if (isoStr < FIRST_BOOKABLE) { cls.push('past'); disabled = true; title = 'Three days’ notice needed.'; }
      else {
        const st = stateFor(isoStr);
        if (st === 'full') { cls.push('full'); disabled = true; title = 'Every placement for this day is taken.'; }
        else if (st === 'partial') { cls.push('partial'); title = partialHelper(isoStr); }
        if (selected.has(isoStr)) cls.push('selected');
      }
      if (isoStr === TODAY) cls.push('today');
      html += '<button type="button" class="' + cls.join(' ') + '" data-day="' + isoStr + '"'
        + (disabled ? ' aria-disabled="true" disabled' : '')
        + (selected.has(isoStr) ? ' aria-pressed="true"' : ' aria-pressed="false"')
        + (title ? ' title="' + esc(title) + '"' : '')
        + '><span>' + d + '</span></button>';
    }
    html += '</div>';

    html += '<div class="cal-footer"><span class="count">' + selected.size + ' '
      + plural(selected.size, 'day', 'days') + ' selected</span>'
      + '<button type="button" class="clear" data-quick="clear">Clear days</button></div>';
    html += '<p class="cal-legend">Crossed off means full. Half-filled means open in some of your markets, not all.</p>';

    root.innerHTML = html;
    const helper = document.getElementById(opts.helperId);
    if (helper) helper.textContent = helperText;
    wire();
    if (opts.onChange) opts.onChange(Array.from(selected).sort());
  }

  function toggle(isoStr) {
    if (selected.has(isoStr)) {
      selected.delete(isoStr);
      helperText = '';
    } else {
      if (opts.beforeSelect && opts.beforeSelect(isoStr) === false) { render(); return; }
      selected.add(isoStr);
      helperText = stateFor(isoStr) === 'partial' ? partialHelper(isoStr) : '';
    }
    render();
  }
  function addRange(fromIso, count) {
    for (let i = 0; i < count; i++) {
      const d = addDays(fromIso, i);
      if (d < FIRST_BOOKABLE) continue;
      if (stateFor(d) === 'full') continue; // quick picks skip full days silently
      selected.add(d);
    }
  }
  function wire() {
    root.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => {
      const dt = toDate(monthStart(cursor));
      dt.setMonth(dt.getMonth() + Number(b.dataset.nav));
      cursor = toIso(dt).slice(0, 7);
      render();
    }));
    root.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => {
      const q = b.dataset.quick;
      if (q === 'clear') { selected.clear(); helperText = ''; }
      else if (q === '7') addRange(FIRST_BOOKABLE, 7);
      else if (q === '30') addRange(FIRST_BOOKABLE, 30);
      else if (q === 'weekend') {
        let d = FIRST_BOOKABLE;
        while (toDate(d).getDay() !== 6) d = addDays(d, 1);
        addRange(d, 2);
      }
      render();
    }));
    root.querySelectorAll('.cal-day[data-day]:not([disabled])').forEach(b =>
      b.addEventListener('click', () => toggle(b.dataset.day)));
  }

  render();
  return {
    get: () => Array.from(selected).sort(),
    drop: isoStr => { selected.delete(isoStr); render(); },
    refresh: render
  };
}

/* ============================================================================
   Page controllers
   ========================================================================== */
const qs = new URLSearchParams(location.search);

function setFieldError(fieldEl, message) {
  const helper = fieldEl.querySelector('.helper');
  let err = fieldEl.querySelector('.error-text');
  if (message) {
    fieldEl.classList.add('has-error');
    if (helper) helper.hidden = true;             // Error Text replaces Helper Text, never both
    if (!err) {
      err = document.createElement('p');
      err.className = 'error-text';
      fieldEl.appendChild(err);
    }
    err.textContent = message;
  } else {
    fieldEl.classList.remove('has-error');
    if (helper) helper.hidden = false;
    if (err) err.remove();
  }
}
function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function validUrl(v) { return /^https?:\/\/\S+\.\S+/.test(v.trim()); }

/* ------------------------------------------------------------- index.html --- */
function pageIndex() {
  mountChrome('bare');
  const create = document.getElementById('createState');
  const verify = document.getElementById('verifyState');
  const emailField = document.getElementById('f-email');
  const pwField = document.getElementById('f-password');
  const emailInput = document.getElementById('email');
  const pwInput = document.getElementById('password');
  const takenAlert = document.getElementById('takenAlert');
  const btn = document.getElementById('createBtn');
  let submitted = false;

  function validate() {
    let ok = true;
    const e = emailInput.value.trim();
    if (!e) { setFieldError(emailField, 'Add the email where you want receipts sent.'); ok = false; }
    else if (!validEmail(e)) { setFieldError(emailField, 'That address is missing an @ — try name@business.com.'); ok = false; }
    else setFieldError(emailField, null);
    if (pwInput.value.length < 10) { setFieldError(pwField, 'Make it at least 10 characters.'); ok = false; }
    else setFieldError(pwField, null);
    return ok;
  }
  [emailInput, pwInput].forEach(i =>
    i.addEventListener('blur', () => { if (submitted) validate(); }));

  function showVerify(email) {
    document.getElementById('verifyEmail').textContent = email;
    create.hidden = true;
    verify.hidden = false;
    document.getElementById('code').focus();
  }

  btn.addEventListener('click', () => {
    submitted = true;
    takenAlert.hidden = true;
    if (!validate()) return;
    const email = emailInput.value.trim();
    btn.disabled = true;
    btn.textContent = 'Creating your account…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Create account →';
      if (email.toLowerCase() === 'taken@business.com') { takenAlert.hidden = false; return; }
      const acct = account();
      acct.email = email;
      commit();
      showVerify(email);
    }, 700);
  });

  const codeField = document.getElementById('f-code');
  const codeInput = document.getElementById('code');
  const resentNote = document.getElementById('resentNote');
  document.getElementById('verifyBtn').addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (code === '123456') { location.href = 'setup.html'; return; }
    if (code === '000000') {
      setFieldError(codeField, 'That code expired. We’ve sent a fresh one.');
      resentNote.hidden = false;   // the expired path auto-triggers the resend microcopy
      return;
    }
    setFieldError(codeField, 'That code doesn’t match. Check the newest email — we send a new one each time you ask.');
  });
  document.getElementById('resendLink').addEventListener('click', e => {
    e.preventDefault();
    setFieldError(codeField, null);
    resentNote.hidden = false;
  });
  document.getElementById('startOver').addEventListener('click', e => {
    e.preventDefault();
    verify.hidden = true; create.hidden = false;
    codeInput.value = ''; setFieldError(codeField, null); resentNote.hidden = true;
  });

  if (qs.get('state') === 'verify') showVerify(emailInput.value.trim() || account().email);
  if (qs.get('state') === 'taken') takenAlert.hidden = false;
}

/* ------------------------------------------------------------ signin.html --- */
function pageSignin() {
  mountChrome('bare');
  const btn = document.getElementById('signinBtn');
  const alertEl = document.getElementById('signinError');
  if (qs.get('state') === 'error') alertEl.hidden = false;
  btn.addEventListener('click', () => {
    alertEl.hidden = true;
    const pw = document.getElementById('password').value;
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Sign in →';
      if (pw === 'wrongpass') { alertEl.hidden = false; return; }
      location.href = 'home.html';
    }, 700);
  });
}

/* ------------------------------------------------------------- setup.html --- */
function pageSetup() {
  mountChrome('bare');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const stepSlot = document.getElementById('stepSlot');
  let chosenCategory = null;
  let picker = null;
  let chosenMarkets = [];

  function paintSteps(i) { stepSlot.innerHTML = stepIndicator(['Business', 'Markets'], i); }
  paintSteps(0);

  const pillGrid = document.getElementById('categoryPills');
  pillGrid.innerHTML = CATEGORIES.map(c =>
    '<button type="button" class="pill" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '</button>'
  ).join('');
  pillGrid.querySelectorAll('.pill').forEach(p => p.addEventListener('click', () => {
    pillGrid.querySelectorAll('.pill').forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
    p.classList.add('selected'); p.setAttribute('aria-pressed', 'true');
    chosenCategory = p.dataset.cat;
    checkCategory();
    refreshNext();
  }));

  const ids = ['bizName', 'website', 'address', 'yourName', 'yourRole'];
  const nextBtn = document.getElementById('nextBtn');
  function step1Complete() {
    return ids.every(id => document.getElementById(id).value.trim()) && !!chosenCategory;
  }
  function refreshNext() {
    nextBtn.disabled = !step1Complete();
    nextBtn.classList.toggle('is-disabled', nextBtn.disabled);
  }
  ids.forEach(id => document.getElementById(id).addEventListener('input', () => {
    refreshNext();
    checkCategory();
  }));
  refreshNext();

  /* Validation. `Next` stays disabled until the six required fields are filled
     (§3), so the empty-field errors surface on blur once a field has been
     visited and left empty; the category error surfaces once every other
     required field is filled and no pill is chosen. Format errors (website)
     surface on the Next click. */
  const STEP1_CHECKS = [
    ['bizName', 'Add the business name — it’s what readers will see.', v => !!v],
    ['website', 'Add a link, starting with https://.', v => validUrl(v)],
    ['address', 'Tell us where you are, or which towns you cover.', v => !!v],
    ['yourName', 'Add your name.', v => !!v],
    ['yourRole', 'What’s your role there?', v => !!v]
  ];
  function checkCategory() {
    const catField = document.getElementById('f-category');
    const othersFilled = ids.every(id => document.getElementById(id).value.trim());
    if (!chosenCategory && othersFilled) {
      setFieldError(catField, 'Pick the category that fits best.');
      return false;
    }
    if (chosenCategory) setFieldError(catField, null);
    return !!chosenCategory;
  }
  function validateField(id) {
    const entry = STEP1_CHECKS.find(c => c[0] === id);
    if (!entry) return true;
    const el = document.getElementById(id);
    const field = el.closest('.field');
    const v = el.value.trim();
    if (!v) { setFieldError(field, entry[1]); return false; }
    if (!entry[2](v)) { setFieldError(field, entry[1]); return false; }
    setFieldError(field, null);
    return true;
  }
  function validateStep1() {
    let ok = true;
    STEP1_CHECKS.forEach(([id]) => { if (!validateField(id)) ok = false; });
    if (!checkCategory()) ok = false;
    return ok;
  }

  nextBtn.addEventListener('click', () => {
    if (!validateStep1()) return;
    step1.hidden = true; step2.hidden = false;
    paintSteps(1);
    window.scrollTo(0, 0);
    if (!picker) {
      picker = LocationPicker(document.getElementById('marketPicker'), {
        id: 'setup-markets',
        searchPlaceholder: 'Search 400+ markets',
        searchLabel: 'Search markets',
        selected: [],
        onChange: sel => {
          chosenMarkets = sel;
          const fin = document.getElementById('finishBtn');
          fin.disabled = sel.length === 0;
          fin.classList.toggle('is-disabled', fin.disabled);
          fin.textContent = sel.length === 0 ? 'Pick at least one market' : 'Finish setup →';
        }
      });
    }
  });
  ids.forEach(id => document.getElementById(id).addEventListener('blur', () => {
    validateField(id);
    checkCategory();
  }));

  document.getElementById('backLink').addEventListener('click', e => {
    e.preventDefault();
    step2.hidden = true; step1.hidden = false;   // step-1 values are preserved in the DOM
    paintSteps(0);
    window.scrollTo(0, 0);
  });

  document.getElementById('finishBtn').addEventListener('click', () => {
    if (!chosenMarkets.length) return;
    const acct = account();
    acct.business.name = document.getElementById('bizName').value.trim().slice(0, NAME_MAX);
    acct.business.category = chosenCategory;
    acct.business.website = document.getElementById('website').value.trim();
    acct.business.address = document.getElementById('address').value.trim();
    acct.business.phone = document.getElementById('phone').value.trim();
    acct.contact.name = document.getElementById('yourName').value.trim();
    acct.contact.role = document.getElementById('yourRole').value.trim();
    acct.markets = chosenMarkets;
    commit();
    location.href = 'home.html?firstrun=1';
  });

  if (qs.get('step') === '2') nextBtn.click();
}

/* -------------------------------------------------------------- home.html --- */
function pageHome() {
  mountChrome('account', 'markets');
  const acct = account();
  const firstrun = qs.get('firstrun') === '1';
  const forced = qs.get('state');
  const main = document.getElementById('homeMain');

  if (forced === 'loading') {
    main.innerHTML = '<p class="subhead">Pulling this morning’s numbers…</p>';
    return;
  }

  let markets = acct.markets.slice();
  if (forced === 'nomarkets') markets = [];
  if (forced === 'manymarkets') {
    ['sarasota', 'fort-myers', 'cape-coral'].forEach(s => { if (markets.indexOf(s) === -1) markets.push(s); });
  }
  const numbersOut = forced === 'numbers-error';

  /* --- hero ------------------------------------------------------------- */
  const upcoming = firstrun ? [] : upcomingDays(acct, null);
  const todayRun = upcoming.find(u => u.day === TODAY);
  const tomorrowRun = upcoming.find(u => u.day === addDays(TODAY, 1));
  const inReview = upcoming.find(u => u.b.status === 'in_review');
  const later = upcoming.find(u => u.day > addDays(TODAY, 1));

  function marketOf(entry) {
    const inMine = entry.b.markets.filter(m => markets.indexOf(m) !== -1);
    return marketName(inMine[0] || entry.b.markets[0]);
  }

  let hero, subline = '';
  let mode = forced || '';
  if (firstrun || !markets.length) mode = markets.length ? 'firstrun' : 'nomarkets';
  else if (!mode || ['manymarkets', 'numbers-error'].indexOf(mode) !== -1) {
    if (todayRun) mode = 'today';
    else if (inReview) mode = 'review';
    else if (tomorrowRun) mode = 'tomorrow';
    else if (later) mode = 'later';
    else mode = 'nothing';
  }

  if (['today', 'tomorrow', 'later', 'review'].indexOf(mode) !== -1
      && !todayRun && !tomorrowRun && !inReview && !later) mode = 'nothing';

  const heroMarket = todayRun ? marketOf(todayRun)
    : inReview ? marketOf(inReview)
    : tomorrowRun ? marketOf(tomorrowRun)
    : later ? marketOf(later) : marketName(markets[0] || 'naples');

  switch (mode) {
    case 'firstrun': hero = 'You haven’t booked anything yet.'; break;
    case 'today': hero = 'Your spotlight runs in ' + heroMarket + ' this morning.'; break;
    case 'tomorrow': hero = 'Your spotlight runs in ' + heroMarket + ' tomorrow morning.'; break;
    case 'later':
      hero = later
        ? 'Next up: ' + heroMarket + ', ' + weekdayOf(later.day) + ' morning.'
        : 'Nothing of yours runs this week.';
      break;
    case 'review': hero = 'Your ' + heroMarket + ' spotlight is with the editor. She usually replies inside a day.'; break;
    case 'nomarkets': hero = 'You haven’t booked anything yet.'; break;
    default: hero = 'Nothing of yours runs this week.';
  }

  if (mode === 'firstrun' && markets.length) {
    const m = market(markets[0]);
    const fresh = { bookings: [] };   // a brand-new account has nothing of its own booked
    subline = m.city + ' goes out tomorrow at 6am to ' + num(m.subscribers) + ' people. '
      + openOn(m.slug, addDays(TODAY, 1), 'business', fresh) + ' spotlight spots are open.';
  } else if (mode === 'nothing') {
    const day = nextOpenDay(markets[0] || 'naples', 'business', acct);
    subline = 'The next open day across your markets is ' + weekdayOf(day) + ', ' + fmtMonthDay(day) + '.';
  } else {
    const quiet = markets.filter(s => !upcoming.some(u => u.b.markets.indexOf(s) !== -1));
    if (quiet.length >= 2) {
      const lastDay = upcoming.length ? upcoming[upcoming.length - 1].day : TODAY;
      subline = 'Nothing booked in ' + quiet.slice(0, 2).map(marketName).join(' or ')
        + ' after ' + weekdayOf(lastDay) + '.';
    }
  }

  let html = '';
  html += '<div class="reveal"><h1 class="hero-sentence">' + esc(hero) + '</h1>'
    + (subline ? '<p class="hero-subline">' + esc(subline) + '</p>' : '')
    + (markets.length ? '<p style="margin-top:10px">' + sampleStamp() + '</p>' : '')
    + '<div class="hero-actions"><a class="btn primary" href="book.html">Book a placement →</a>'
    + '</div></div>';

  if (numbersOut) {
    html += '<div class="alert error" role="alert"><span class="icon" aria-hidden="true">⚠</span>'
      + '<div class="body">We couldn’t reach the numbers just now. Everything you’ve booked is still on.'
      + '<div class="actions"><a href="home.html">Try again</a></div></div></div>';
  }

  if (!markets.length) {
    html += '<div class="empty-block" style="margin-top:32px">'
      + '<p>You haven’t picked any markets. Add one and we’ll show you who reads us there.</p>'
      + '<a class="btn primary" href="setup.html?step=2">Add a market →</a></div>';
  } else {
    if (markets.length >= 4) {
      html += '<nav class="filter-bar" aria-label="Market filters"><div class="filter-bar-row" id="scopePills">'
        + '<button type="button" class="fpill selected" data-scope="all">All</button>'
        + markets.map(s => '<button type="button" class="fpill" data-scope="' + s + '">'
          + esc(marketName(s)) + '</button>').join('')
        + '</div></nav>';
    }
    html += '<div class="markets-head"><h2>Your markets</h2>' + sampleStamp() + '</div>';
    html += '<div class="markets-grid stagger" id="marketsGrid">';

    const sorted = markets.slice().sort((a, b) => {
      const aRun = upcoming.some(u => u.b.markets.indexOf(a) !== -1 && u.day <= addDays(TODAY, 1));
      const bRun = upcoming.some(u => u.b.markets.indexOf(b) !== -1 && u.day <= addDays(TODAY, 1));
      return (bRun ? 1 : 0) - (aRun ? 1 : 0);
    });

    sorted.forEach(slug => {
      const m = market(slug);
      const mineHere = upcoming.filter(u => u.b.markets.indexOf(slug) !== -1);
      const running = mineHere.some(u => u.day <= addDays(TODAY, 1));
      html += '<article class="market-card' + (running ? ' is-running' : '') + '" data-market="' + slug + '">';
      html += '<h3>' + esc(m.city + ', ' + m.state) + '</h3>';
      if (numbersOut) {
        html += '<p class="numbers-out">We couldn’t reach the numbers just now.</p>';
      } else {
        html += '<div class="metric-row">'
          + metricTile(num(m.subscribers), 'subscribers')
          + metricTile(m.open_rate + '%', 'open rate')
          + metricTile(fmtShort(m.last_sent), 'last sent')
          + '</div>';
      }
      html += '<p class="card-status">' + esc(cardStatus(acct, slug, mineHere, firstrun)) + '</p>';
      html += '<p class="card-link"><a href="market.html?m=' + slug + '">Open ' + esc(m.city) + ' →</a></p>';
      html += '</article>';
    });
    html += '</div>';

    if (!firstrun) {
      const charged = chargedInMonth(acct, TODAY);
      html += '<div class="money-strip">'
        + '<div class="msq"><span class="figure">' + money(charged) + '</span>'
        + '<span class="label">Charged in ' + monthOf(TODAY) + '</span></div>'
        + '<div class="msq"><span class="figure">' + money(paidNotRun(acct)) + '</span>'
        + '<span class="label">Paid for, not yet run</span></div>'
        + '<a class="ms-link" href="budget.html">Budget and receipts →</a></div>';
    }
  }

  html += '<p class="disclosure">Every number here is a total. We never show you individual readers, '
    + 'and we don’t sell subscriber data.</p>';

  main.innerHTML = html;

  const pills = document.getElementById('scopePills');
  if (pills) {
    pills.querySelectorAll('.fpill').forEach(p => p.addEventListener('click', () => {
      pills.querySelectorAll('.fpill').forEach(o => o.classList.remove('selected'));
      p.classList.add('selected');
      const scope = p.dataset.scope;
      document.querySelectorAll('#marketsGrid .market-card').forEach(c => {
        c.style.display = (scope === 'all' || c.dataset.market === scope) ? '' : 'none';
      });
    }));
  }
}

function cardStatus(acct, slug, mineHere, firstrun) {
  if (firstrun || !mineHere.length) {
    const full = fullThrough(slug, acct);
    if (full) {
      return 'Full through ' + weekdayOf(full.lastFull) + '. First opening: '
        + weekdayOf(full.firstOpen) + ', ' + fmtMonthDay(full.firstOpen) + '.';
    }
    if (!firstrun) {
      // Anything that already ran here, most recent month first.
      const ran = [];
      (acct.bookings || []).forEach(b => {
        if (b.markets.indexOf(slug) === -1 || b.status === 'refunded') return;
        b.days.forEach(d => { if (d < TODAY && !isRefundedDay(b, d)) ran.push(d); });
      });
      if (ran.length) {
        ran.sort();
        const lastMonth = monthOf(ran[ran.length - 1]);
        const inMonth = ran.filter(d => monthOf(d) === lastMonth).length;
        return inMonth + ' ' + plural(inMonth, 'placement', 'placements') + ' ran here in ' + lastMonth + '.';
      }
    }
    const day = nextOpenDay(slug, 'business', acct);
    return 'Nothing booked. Next open day: ' + weekdayOf(day) + ', ' + fmtMonthDay(day) + '.';
  }
  const tomorrow = addDays(TODAY, 1);
  if (mineHere.some(u => u.day === tomorrow || u.day === TODAY)) {
    const day = nextOpenDay(slug, 'business', acct);
    return 'Running tomorrow. ' + openOn(slug, day, 'business', acct) + ' of ' + CAP.business
      + ' spots open ' + fmtMonthDay(day) + '.';
  }
  const full = fullThrough(slug, acct);
  if (full) {
    return 'Full through ' + weekdayOf(full.lastFull) + '. First opening: '
      + weekdayOf(full.firstOpen) + ', ' + fmtMonthDay(full.firstOpen) + '.';
  }
  const day = nextOpenDay(slug, 'business', acct);
  return 'Running tomorrow. ' + openOn(slug, day, 'business', acct) + ' of ' + CAP.business
    + ' spots open ' + fmtMonthDay(day) + '.';
}

/* ------------------------------------------------------------ market.html --- */
function pageMarket() {
  mountChrome('account', 'markets');
  const acct = account();
  const slug = qs.get('m');
  const m = market(slug);
  const main = document.getElementById('marketMain');

  if (!m) {
    main.innerHTML = '<h1>We don’t have a market by that name.</h1>'
      + '<p class="hero-actions"><a class="btn primary" href="home.html">Back to your markets →</a></p>';
    return;
  }
  document.title = m.city + ', ' + m.state + ' — BaseLocal for business';

  const emptyRun = qs.get('state') === 'empty';
  const rows = emptyRun ? [] : runSheetRows(acct, slug);

  let html = '';
  html += '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="home.html">Markets</a>'
    + '<span class="sep" aria-hidden="true">/</span>'
    + '<span class="current" aria-current="page">' + esc(m.city + ', ' + m.state) + '</span></nav>';
  html += '<h1>' + esc(m.city + ', ' + m.state) + '</h1>';
  html += '<p class="subhead">Sent every morning. Last edition: ' + fmtLong(m.last_sent) + '.</p>';

  /* Audience panel */
  html += '<section class="panel"><div class="panel-head"><h2>Who you reach in ' + esc(m.city) + '</h2>'
    + sampleStamp() + '</div>';
  html += '<div class="metric-row">'
    + metricTile(num(m.subscribers), 'Subscribers',
      'People signed up to this market’s daily email, as of this morning.')
    + metricTile(m.open_rate + '%', 'Opened the last 30 days',
      'Unique opens divided by emails delivered, across every edition we sent here in the last 30 days.')
    + metricTile(num(m.editions_30d), 'Editions sent in 30 days')
    + metricTile(fmtShort(m.last_sent), 'Last sent')
    + '</div>';
  html += '<p class="qualifier">We delivered ' + num(m.delivered_30d) + ' emails in ' + esc(m.city)
    + ' over the last 30 days. That’s send volume across every edition — the ' + num(m.subscribers)
    + ' is the people.</p>';

  const diff = m.open_rate - m.open_rate_prev;
  let trend;
  if (diff > 0) trend = 'Open rate is up about ' + numberWord(diff) + ' points on the month before.';
  else if (diff < 0) trend = 'Open rate slipped about ' + numberWord(-diff) + ' points from the month before.';
  else trend = 'Open rate is holding steady month to month.';
  html += '<p class="trend-line">' + trend + '</p>';
  html += '<p class="network-line">Across every BaseLocal market, roughly 73% of readers are women '
    + 'and most are 50 or older. We don’t break that down by city yet.</p>';
  html += clicksModule(m);
  html += '<p class="fine-print" style="margin-top:16px">Totals only. Nothing here identifies a reader, '
    + 'and we don’t sell subscriber data.</p>';
  html += '</section>';

  /* Run sheet */
  html += '<h2 style="margin-top:44px">What you’re running in ' + esc(m.city) + '</h2>';

  const spotOpenDay = nextOpenDay(slug, 'business', acct);
  const spotFullDay = nextFullDay(slug, 'business', acct);
  const evOpenDay = hasRoom(slug, spotOpenDay, 'event', acct) ? spotOpenDay : nextOpenDay(slug, 'event', acct);
  html += '<p class="availability-line">Spotlights: ' + openOn(slug, spotOpenDay, 'business', acct)
    + ' of ' + CAP.business + ' open ' + weekdayOf(spotOpenDay)
    + (spotFullDay ? ', both taken ' + weekdayOf(spotFullDay) : '')
    + '. Events: ' + openOn(slug, evOpenDay, 'event', acct) + ' of ' + CAP.event
    + ' open ' + weekdayOf(evOpenDay) + '.</p>';

  if (!rows.length) {
    html += '<div class="run-empty"><p>Nothing of yours running in ' + esc(m.city)
      + '. The next open day is ' + weekdayOf(spotOpenDay) + ', ' + fmtMonthDay(spotOpenDay) + '.</p>'
      + '<a class="btn primary" href="book.html?markets=' + slug + '&day=' + spotOpenDay + '">Book '
      + weekdayOf(spotOpenDay) + ' →</a></div>';
  } else {
    html += '<div class="run-sheet">';
    let currentMonth = '';
    html += '<ul>';
    rows.forEach(r => {
      const label = monthOf(r.day) + ' ' + yearOf(r.day);
      if (label !== currentMonth) {
        currentMonth = label;
        html += '</ul><div class="run-month">' + label + '</div><ul>';
      }
      html += '<li class="run-row' + (r.day < TODAY ? ' is-past' : '') + '">'
        + '<span class="rs-date">' + fmtRunDate(r.day) + '</span>'
        + '<span class="rs-placement">' + esc(r.placement) + '</span>'
        + '<span class="rs-chip">' + statusChip(r.status) + '</span>'
        + '<span class="rs-cost">' + money(r.cost) + '</span></li>';
    });
    html += '</ul></div>';
  }

  html += '<div class="page-actions"><a class="btn primary" href="book.html?markets=' + slug + '">Book in '
    + esc(m.city) + ' →</a>'
    + '<button type="button" class="muted-link" id="removeLink" style="background:none;border:none;'
    + 'font-family:inherit;font-size:15px;cursor:pointer">Remove this market</button></div>';

  html += '<dialog class="remove-dialog" id="removeDialog" aria-labelledby="removeTitle">'
    + '<h2 id="removeTitle">Remove ' + esc(m.city) + ' from your account?</h2>'
    + '<p>Anything already booked still runs, and you keep the receipts. You just stop seeing '
    + esc(m.city) + ' here.</p>'
    + '<div class="dlg-actions"><button type="button" class="btn primary" id="removeYes">Remove '
    + esc(m.city) + '</button>'
    + '<button type="button" class="btn secondary" id="removeNo">Keep it</button></div></dialog>';

  main.innerHTML = html;

  const dlg = document.getElementById('removeDialog');
  document.getElementById('removeLink').addEventListener('click', () => dlg.showModal());
  document.getElementById('removeNo').addEventListener('click', () => dlg.close());
  document.getElementById('removeYes').addEventListener('click', () => {
    acct.markets = acct.markets.filter(s => s !== slug);
    commit();
    location.href = 'home.html';
  });
}

/* -------------------------------------------------------------- book.html --- */
function pageBook() {
  mountChrome('account', 'book');
  const acct = account();
  const stepSlot = document.getElementById('stepSlot');

  let type = null;
  let tier = 'directory_newsletter';
  let markets = (qs.get('markets') || '').split(',').filter(Boolean);
  if (!markets.length) markets = acct.markets.slice();
  let days = [];
  let slotLostFired = false;

  function paintSteps() {
    const i = !type ? 0 : (!markets.length ? 1 : (!days.length ? 2 : 3));
    stepSlot.innerHTML = stepIndicator(['What', 'Where', 'When', 'Pay'], i);
  }

  const summaryBody = document.getElementById('summaryBody');
  const cta = document.getElementById('bookCta');
  const barCta = document.getElementById('barCta');
  const barAmount = document.getElementById('barAmount');
  const ceilingAlert = document.getElementById('ceilingAlert');

  /* Section 01 — Pick Cards */
  document.querySelectorAll('.pick-card').forEach(card => card.addEventListener('click', () => {
    document.querySelectorAll('.pick-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('selected'); card.setAttribute('aria-pressed', 'true');
    type = card.dataset.type;
    ['sec02', 'sec03', 'sec04'].forEach(id => document.getElementById(id).classList.remove('is-dimmed'));
    if (cal) cal.refresh();
    recalc();
  }));

  /* Section 02 — Location Multi-Select */
  let cal = null;
  LocationPicker(document.getElementById('bookMarkets'), {
    id: 'book-markets',
    searchPlaceholder: 'Search 400+ markets',
    searchLabel: 'Search markets',
    selected: markets,
    onChange: sel => { markets = sel; if (cal) cal.refresh(); recalc(); }
  });

  /* Section 03 — Multi-Select Calendar */
  cal = Calendar(document.getElementById('bookCalendar'), {
    helperId: 'calHelper',
    selected: qs.get('day') ? [qs.get('day')] : [],
    getMarkets: () => markets,
    getKind: () => type || 'business',
    beforeSelect: isoStr => {
      // Mocked lost 15-minute hold — fires once, on Sep 5 with Santa Fe selected.
      if (!slotLostFired && isoStr === '2026-09-05' && markets.indexOf('santa-fe') !== -1) {
        slotLostFired = true;
        LOST_SLOTS.add('santa-fe|2026-09-05|business');
        LOST_SLOTS.add('santa-fe|2026-09-05|event');
        const el = document.getElementById('slotLost');
        el.querySelector('.body').textContent =
          'Someone took the last Santa Fe spot on ' + fmtMonthDay(isoStr)
          + ' while you were picking. We dropped that day — everything else is still yours.';
        el.hidden = false;
        el.scrollIntoView({ block: 'center' });
        return false;
      }
      return true;
    },
    onChange: sel => { days = sel; recalc(); }
  });

  /* Section 04 — tiers */
  document.querySelectorAll('.tier-card').forEach(card => card.addEventListener('click', () => {
    document.querySelectorAll('.tier-card').forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
    card.classList.add('selected'); card.setAttribute('aria-pressed', 'true');
    tier = card.dataset.tier;
    recalc();
  }));

  function recalc() {
    paintSteps();
    const unit = unitPrice(tier);
    const total = markets.length * days.length * unit;
    const charged = chargedInMonth(acct, TODAY);
    const ceiling = ceilingDollars(acct);
    const over = ceiling == null ? 0 : (charged + total) - ceiling;

    if (!markets.length || !days.length) {
      summaryBody.innerHTML = '<p class="empty-state">Pick markets and days to see your total.</p>';
    } else {
      summaryBody.innerHTML =
        '<div class="line"><span class="label">Markets</span><span class="value">' + markets.length + '</span></div>'
        + '<div class="line"><span class="label">Days</span><span class="value">' + days.length + '</span></div>'
        + '<div class="line"><span class="label">Placement</span><span class="value">' + TIER_LABEL[tier] + '</span></div>'
        + '<p class="math">' + days.length + ' ' + plural(days.length, 'day', 'days') + ' × '
        + markets.length + ' ' + plural(markets.length, 'market', 'markets') + ' × ' + money(unit) + '</p>'
        + '<div class="total"><span class="label">Total</span><span class="amount">' + money(total) + '</span></div>';
    }
    barAmount.textContent = money(total);

    const blocked = over > 0;
    if (blocked) {
      ceilingAlert.querySelector('.body').innerHTML =
        'This would take you ' + money(over) + ' past the ' + money(ceiling) + ' ceiling you set for '
        + monthOf(TODAY) + '. Drop a few market-days, or raise the ceiling.'
        + '<div class="actions"><a href="budget.html">Change the ceiling →</a></div>';
      ceilingAlert.hidden = false;
    } else {
      ceilingAlert.hidden = true;
    }

    const ready = !!type && markets.length > 0 && days.length > 0 && !blocked;
    [cta, barCta].forEach(b => {
      b.disabled = !ready;
      b.classList.toggle('is-disabled', !ready);
      b.textContent = (markets.length && days.length) ? 'Review and pay →' : 'Pick markets and days';
    });
  }

  function go() {
    const total = markets.length * days.length * unitPrice(tier);
    location.href = 'review.html?type=' + type + '&markets=' + markets.join(',')
      + '&days=' + days.join(',') + '&tier=' + tier + '&total=' + total;
  }
  cta.addEventListener('click', go);
  barCta.addEventListener('click', go);

  document.body.classList.add('has-summary-bar');
  document.getElementById('viewSummary').addEventListener('click', () => {
    const s = document.getElementById('orderSummary');
    s.classList.toggle('is-expanded');
    s.scrollIntoView({ block: 'center' });
  });

  recalc();
}

/* ------------------------------------------------------------ review.html --- */
function pageReview() {
  mountChrome('account', 'book');
  const acct = account();
  const type = qs.get('type') || 'business';
  const markets = (qs.get('markets') || '').split(',').filter(Boolean);
  const days = (qs.get('days') || '').split(',').filter(Boolean);
  const tier = qs.get('tier') || 'directory_newsletter';
  const total = Number(qs.get('total') || (markets.length * days.length * unitPrice(tier)));
  const card = acct.payment_method;

  document.getElementById('cardLast4').textContent = card.last4;
  document.getElementById('summaryBody').innerHTML =
    '<div class="line"><span class="label">Markets</span><span class="value">'
      + esc(markets.map(marketName).join(', ')) + '</span></div>'
    + '<div class="line"><span class="label">Days</span><span class="value">' + days.length + '</span></div>'
    + '<div class="line"><span class="label">Placement</span><span class="value">' + TIER_LABEL[tier] + '</span></div>'
    + '<p class="math">' + days.length + ' ' + plural(days.length, 'day', 'days') + ' × '
      + markets.length + ' ' + plural(markets.length, 'market', 'markets') + ' × '
      + money(unitPrice(tier)) + '</p>'
    + '<div class="total"><span class="label">Total</span><span class="amount">' + money(total) + '</span></div>';

  const btn = document.getElementById('payBtn');
  btn.textContent = 'Pay ' + money(total) + ' →';
  const declineAlert = document.getElementById('declineAlert');
  let willDecline = qs.get('state') === 'declined';

  btn.addEventListener('click', () => {
    declineAlert.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Charging your card…';
    setTimeout(() => {
      if (willDecline) {
        willDecline = false;                    // a second attempt goes through
        declineAlert.hidden = false;
        btn.disabled = false;
        btn.textContent = 'Pay ' + money(total) + ' →';
        return;
      }
      const receipt = 'BL-' + Math.floor(9300 + Math.random() * 600);
      location.href = 'booked.html?type=' + type + '&markets=' + markets.join(',')
        + '&days=' + days.join(',') + '&tier=' + tier + '&total=' + total + '&receipt=' + receipt;
    }, 900);
  });
}

/* ------------------------------------------------------------ booked.html --- */
function pageBooked() {
  mountChrome('account', 'markets');
  const acct = account();
  const type = qs.get('type') || 'business';
  const markets = (qs.get('markets') || '').split(',').filter(Boolean);
  const days = (qs.get('days') || '').split(',').filter(Boolean);
  const tier = qs.get('tier') || 'directory_newsletter';
  const total = Number(qs.get('total') || 0);
  const receipt = qs.get('receipt') || ('BL-' + Math.floor(9300 + Math.random() * 600));

  /* Fold the booking into the demo account so home / market / budget reflect it. */
  if (markets.length && days.length && !(acct.bookings || []).some(b => b.id === receipt)) {
    acct.bookings.push({
      id: receipt, charged: TODAY, type: type, tier: tier,
      markets: markets, days: days, status: 'in_review', receipt_status: 'paid'
    });
    commit();
  }

  document.getElementById('bookedAmount').textContent = money(total);
  document.getElementById('bookedLast4').textContent = acct.payment_method.last4;
  document.getElementById('receiptLine').textContent =
    'Receipt #' + receipt + ' · ' + fmtMonthDay(TODAY) + ', ' + yearOf(TODAY);
}

/* ------------------------------------------------------------ budget.html --- */
function pageBudget() {
  mountChrome('account', 'budget');
  const acct = account();
  const main = document.getElementById('budgetMain');
  const forced = qs.get('state');

  if (forced === 'loading') {
    main.innerHTML = '<h1>Where the money went.</h1><p class="subhead">Loading your receipts…</p>';
    return;
  }

  const empty = forced === 'empty';
  const bookings = empty ? [] : (acct.bookings || []);
  const charged = empty ? 0 : chargedInMonth(acct, TODAY);
  const notRun = empty ? 0 : paidNotRun(acct);
  const ceiling = ceilingDollars(acct);
  const left = ceiling == null ? null : ceiling - charged;

  let html = '';
  html += '<h1>Where the money went.</h1>';
  html += '<p class="subhead">' + monthOf(TODAY) + ' so far, plus everything you’ve paid for that hasn’t run yet.</p>';

  html += '<div class="metric-row" style="margin-top:28px">'
    + metricTile(money(charged), 'Charged in ' + monthOf(TODAY))
    + metricTile(money(notRun), 'Paid for, not yet run',
      'You’re charged when you book. This is the part you’ve paid for that hasn’t run yet.')
    + metricTile(ceiling == null ? '—' : money(left) + ' left',
      ceiling == null ? 'No ceiling set' : 'Of your ' + money(ceiling) + ' ceiling')
    + '</div>';

  html += '<section class="budget-block"><div class="bb-head"><h2>Monthly ceiling</h2>'
    + '<a href="#" id="changeCeiling">Change ceiling</a></div>'
    + '<p class="helper">A limit you set on yourself. We block any booking that would cross it. '
    + 'Change it whenever — it applies to your next booking.</p>'
    + '<div class="bb-value" id="ceilingValue">' + (ceiling == null ? '—' : money(ceiling)) + '</div>'
    + '<div id="ceilingEdit" hidden><div class="field" id="f-ceiling">'
    + '<label class="field-label" for="ceilingInput">Monthly ceiling <span class="req">*</span></label>'
    + '<input type="number" id="ceilingInput" placeholder="500" min="0" step="5" value="'
    + (ceiling == null ? '' : ceiling) + '"></div>'
    + '<button type="button" class="btn primary small" id="saveCeiling">Save ceiling</button></div>'
    + '<div class="alert success" id="ceilingSaved" hidden><span class="icon" aria-hidden="true">✓</span>'
    + '<div class="body"></div></div>'
    + '</section>';

  html += '<section class="budget-block" id="card-on-file"><div class="bb-head"><h2>Card on file</h2>'
    + '<a href="#">Replace card</a></div>'
    + '<p class="card-on-file">' + esc(acct.payment_method.brand) + ' ending '
    + esc(acct.payment_method.last4) + ' · expires ' + esc(acct.payment_method.exp) + '</p></section>';

  html += '<section class="budget-block"><h2>Receipts</h2>';
  if (!bookings.length) {
    html += '<p class="small" style="margin-top:12px">No charges yet. When you book, the card on file gets '
      + 'charged that day — nothing recurring, nothing held in advance.</p>';
  } else {
    const RECEIPT_CHIP = { paid: 'Paid', refunded: 'Refunded', partly_refunded: 'Partly refunded' };
    html += '<div class="receipt-head"><span>Date</span><span>What</span><span>Markets</span>'
      + '<span>Amount</span><span>Status</span><span></span></div><ul class="receipt-list">';
    bookings.slice().sort((a, b) => (a.charged < b.charged ? 1 : -1)).forEach(b => {
      html += '<li class="receipt-row">'
        + '<span class="rc-date">' + fmtShort(b.charged) + ', ' + yearOf(b.charged) + '</span>'
        + '<span class="rc-what">' + esc(placementLabel(b)) + '</span>'
        + '<span class="rc-markets">' + esc(b.markets.map(marketFull).join(', ')) + '</span>'
        + '<span class="rc-amount">' + money(bookingTotal(b)) + '</span>'
        + '<span class="rc-chip">' + statusChip(RECEIPT_CHIP[b.receipt_status] || 'Paid') + '</span>'
        + '<span class="rc-link"><a href="#">Download invoice</a></span>'
        + '</li>';
    });
    html += '</ul>';
  }
  html += '<p class="fine-print" style="margin-top:16px">Amounts include any sales tax we’re required '
    + 'to collect.</p></section>';

  main.innerHTML = html;

  const editBlock = document.getElementById('ceilingEdit');
  const valueEl = document.getElementById('ceilingValue');
  const savedAlert = document.getElementById('ceilingSaved');
  document.getElementById('changeCeiling').addEventListener('click', e => {
    e.preventDefault();
    valueEl.hidden = true; editBlock.hidden = false; savedAlert.hidden = true;
    document.getElementById('ceilingInput').focus();
  });
  document.getElementById('saveCeiling').addEventListener('click', () => {
    const field = document.getElementById('f-ceiling');
    const v = Number(document.getElementById('ceilingInput').value);
    if (!v || v < charged) {
      setFieldError(field, 'Your ceiling can’t be lower than the ' + money(charged)
        + ' you’ve already spent this month.');
      return;
    }
    setFieldError(field, null);
    acct.monthly_ceiling_cents = v * 100;
    commit();
    valueEl.textContent = money(v);
    valueEl.hidden = false; editBlock.hidden = true;
    savedAlert.querySelector('.body').textContent = 'Ceiling set to ' + money(v) + ' for ' + monthOf(TODAY) + '.';
    savedAlert.hidden = false;
    document.querySelectorAll('.metric-tile').forEach(t => {
      const lab = t.querySelector('.label');
      if (lab && lab.textContent.indexOf('Of your') === 0) {
        t.querySelector('.figure').textContent = money(v - charged) + ' left';
        lab.textContent = 'Of your ' + money(v) + ' ceiling';
      }
    });
  });
}

/* ---------------------------------------------------------------- router --- */
const PAGES = {
  index: pageIndex, signin: pageSignin, setup: pageSetup, home: pageHome,
  market: pageMarket, book: pageBook, review: pageReview, booked: pageBooked, budget: pageBudget
};
document.addEventListener('DOMContentLoaded', () => {
  const p = document.body.dataset.page;
  if (PAGES[p]) PAGES[p]();
});
