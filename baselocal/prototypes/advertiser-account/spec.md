# Advertiser Account — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `advertiser-account`
**Direction:** B — "Your Markets" (the account's spine is place)
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/advertiser-account/](https://base-iq.github.io/previews/baselocal/prototypes/advertiser-account/)

This document is the design contract **and** the as-built record. Where the build
diverges from the original contract, this spec states the built behaviour — an
out-of-sync spec is a defect, not a footnote.

Stack: static HTML, one stylesheet, one vanilla-JS file. No framework, no build
step, no dependencies. Every visual value traces to
`brands/baselocal/design-system.md`; anything the design needed that the system
does not define is listed under **Design-system gaps** below.

---

## 1. Goal

A self-serve account for local businesses and media buyers who advertise with
BaseLocal, replacing V1's two anonymous Stripe-checkout flows with one persistent
relationship. An advertiser signs up, adds their business and the markets they
care about, sees honest aggregate audience numbers for each market, books either
kind of placement (business spotlight or event promotion) through a single flow
with multi-market selection, pays with a card on file, and manages spend against a
monthly ceiling they set themselves. The organizing idea is **place**: every screen
is scoped to a market, and the audience you can reach there is the first number on
the screen — ahead of anything about money. Concept-stage clickable prototype:
static HTML, vanilla JS, mocked data.

---

## 2. User flow

| # | Screen | File | Action forward |
|---|--------|------|----------------|
| 1 | Create account | `index.html` | Submit email + password → in-place verify state → enter code → `setup.html` |
| 1b | Sign in | `signin.html` | Submit → `home.html` |
| 2 | Setup · step 1 (Business) | `setup.html` | `Next: pick your markets →` reveals step 2 (no page change; Step Indicator advances) |
| 3 | Setup · step 2 (Markets) | `setup.html` | `Finish setup →` → `home.html?firstrun=1` |
| 4 | Your markets | `home.html` | Market card → `market.html?m={slug}` · `Book a placement →` → `book.html` · money strip → `budget.html` |
| 5 | Market detail | `market.html` | `Book in {Market} →` → `book.html?markets={slug}` |
| 6 | Book a placement | `book.html` | 4 sections on one page → `review.html?type=…&markets=…&days=…&tier=…&total=…` |
| 7 | Review and pay | `review.html` | `Pay $X →` → `booked.html?…&receipt={id}` |
| 8 | Booked | `booked.html` | Terminal — `Back to your markets →` or `Book something else` |
| 9 | Budget and receipts | `budget.html` | Terminal utility page; `Change ceiling` edits in place |

**Chrome.** Screens 4–9 carry the Account Header (logo · `Markets · Book · Budget`
· `{Business name} ▾`). Screens 1–3 carry a bare header (logo only). Step Indicator
on `setup.html` (`Business · Markets`) and the booking sequence
(`What · Where · When · Pay`), collapsing to the `Step N of 4` pill at ≤600px. On
`book.html` the indicator's current step advances as the page is filled in
(`What` → `Where` once a type is chosen → `When` once markets exist → `Pay` once
days exist). Every screen carries the Site Footer.

**Prototype state.** The mocked account persists in `sessionStorage` under
`bl_advertiser` (shape `{ active, accounts: { rivera, zia } }`) so the flow is
re-clickable. Two demo accounts switch from the account menu: **Rivera Dental
Studio** (Naples FL) and **Zia Media Group** (Albuquerque / Rio Rancho / Santa Fe).
The account menu also carries `Reset demo data`, a prototype-only affordance that
re-seeds both accounts.

**Fixed clock.** The prototype is pinned to `TODAY = 2026-09-01` (a Tuesday) in
`app.js`. Every lead-time floor, run sheet, availability line and inventory state
is computed from it, so the demo never rots. The first bookable day is therefore
always **Friday, September 4** and the calendar opens on September 2026.

**Reachable states.** Everything in §3 is reachable through the UI or through the
documented query params in §3. No state is dead code.

---

## 3. States

### `index.html`
- **Default** — two fields empty, CTA enabled, validation on submit.
- **Field errors** — run on submit, then on blur after the first submit. Error
  Text replaces Helper Text; never both.
- **Submitting** — button disabled, label `Creating your account…`, ~700ms mock.
- **Verify in place** (`?state=verify`) — the headline swaps, a 6-digit field and a
  resend link replace the two fields. `123456` → `setup.html`. Any other 6 digits →
  code error. `000000` → expired error, which auto-triggers the resend microcopy.
- **Email taken** (`?state=taken`, or submitting `taken@business.com`) — Inline
  Alert · Info with a sign-in link.

### `signin.html`
- **Default** · **submitting** (`Signing in…`, ~700ms) · **credentials error**
  (Inline Alert · Error) via `?state=error` or the password `wrongpass`. No lockout
  state.

### `setup.html`
- **Step 1 empty** — all blank, pills unselected, `Next: pick your markets →`
  disabled until business name + category + website + address + your name + role
  are filled.
- **Step 1 validation (as built).** Because `Next` is disabled while a required
  field is empty, the empty-field error strings surface **on blur** once a field
  has been visited and left empty; the category error surfaces once every other
  required field is filled and no pill is chosen; format errors (website) surface
  on the `Next` click. All six §4 error strings are reachable this way.
- **Step 2 empty** — `Finish setup →` disabled and labelled `Pick at least one
  market`; jump straight there with `?step=2`.
- **Market search empty** — `No markets match "{query}."`
- Market rows show subscriber counts inline (`Naples, FL — 11,879 subscribers`)
  with the recency footer line beneath the list.
- **≥2 selected** — combined line `{N} markets · {N} subscribers combined.`
- **Back link** returns to step 1 with every value preserved (the step-1 fields are
  hidden, never destroyed).

### `home.html`
Hero resolution order, highest first: **first-run** → **running today** →
**in review** → **running tomorrow** → **later** → **nothing**. Force any of them
with `?state=today|tomorrow|review|later|nothing`.

- **First-run** (`?firstrun=1`) — hero sentence + audience-and-scarcity subline +
  primary CTA; cards render with audience numbers and `Nothing booked` status; the
  money strip is hidden entirely (no zeros).
- **Nothing scheduled** (`?state=nothing`) — hero `Nothing of yours runs this
  week.`; money strip shows the month.
- **Running today / tomorrow** — hero names market and timing; that card gets a 3px
  terracotta left border and sorts first.
- **In review** — hero names the market and the editor SLA. This is the Zia Media
  Group default.
- **Loading** (`?state=loading`) — `Pulling this morning's numbers…`.
- **Numbers unavailable** (`?state=numbers-error`) — Inline Alert · Error with a
  `Try again` link; each card keeps its market name and booking status and replaces
  the metric row with one line (`We couldn't reach the numbers just now.` — the
  first clause of the §4 error string, no new copy). Booking state is never blocked
  by an analytics failure.
- **No markets** (`?state=nomarkets`) — empty block plus `Add a market →`.
- **≥4 markets** (`?state=manymarkets`) — Sticky Filter & Utility Bar with scope
  pills (`All · {Market} · …`) filtering the grid in place. Under 4 markets the bar
  does not render.

### `market.html` (`?m={slug}`)
- **Audience panel** — 4 Metric Tiles + qualifying line + trend sentence + network
  demographics line. Trend variants are keyed to the market's open-rate movement:
  up (Naples), down (Albuquerque), flat (Rio Rancho, Santa Fe).
- **Clicks module** — the unavailable (dated outage) sentence by default; the
  available variant when `CLICKS_AVAILABLE` is flipped in `app.js`. Nothing else on
  the page changes.
- **Run sheet populated** — one row per (booking, day) touching this market,
  newest first, grouped by month, with Status Chips; rows before today are muted.
- **Run sheet empty** (`?state=empty`) — copy block naming the next open day plus a
  day-specific CTA.
- **Market full through a date** — the availability line states the first opening
  (`Spotlights: 2 of 2 open Monday, both taken Friday.`). Reachable at
  `market.html?m=rio-rancho` on the Zia account.
- **Bad slug** (`?m=nowhere`) — `We don't have a market by that name.` plus
  `Back to your markets →`.
- **Remove-market confirmation dialog** — the only dialog in the product. `Remove
  {Market}` drops the market from the account and returns to `home.html`.

### `book.html`
- **Section 01 empty** — neither Pick Card selected; sections 02–04 are dimmed and
  non-interactive until a type is chosen.
- **Section 02** — saved markets pre-checked (or the markets in `?markets=`), full
  Location Multi-Select beneath.
- **Section 03 calendar** — 3-day lead-time floor (today, tomorrow and the day
  after are disabled). Day states: open · partial · full · past. Selecting a
  partial day writes the per-market helper line beneath the calendar. Quick picks
  (`This weekend`, `Next 7 days`, `Next 30 days`, `Clear`) are additive and skip
  full days silently; a partial day is only skipped when no selected market is open
  (which is the definition of full).
- **Section 04** — tier cards. For events the labels and pricing are unchanged; see
  **Design-system gaps**.
- **Ceiling exceeded** — Inline Alert · Error above the Order Summary Card; the CTA
  is disabled while over.
- **Slot lost mid-flow** — Inline Alert · Error, the affected day is auto-removed
  and the rest of the selection preserved. Triggers once per page load, on
  selecting **Sep 5** with **Santa Fe** in the market set.
- **Order Summary Card** — empty until markets *and* days exist; live math line;
  sticky bottom bar on mobile with a `View summary ▴` toggle.

### `review.html`
- **Default** — summary read from the query string.
- **Processing** — `Charging your card…`, ~900ms mock.
- **Declined** (`?state=declined`) — Inline Alert · Error, button re-enabled; a
  second attempt goes through. No 3DS / wallets / ACH / card-entry — the card is on
  file.

### `booked.html`
Success only. The receipt ID is generated client-side at the moment of payment and
passed forward; the booking is folded into the demo account so `home.html`,
`market.html` and `budget.html` immediately reflect it (idempotent on reload).

### `budget.html`
- **Populated** — 3 Metric Tiles, ceiling block, card-on-file block, receipts list.
- **No charges yet** (`?state=empty`) — receipts replaced by the empty copy; `$0`
  charged tile with the ceiling still visible.
- **Editing ceiling** — `Change ceiling` swaps the value for an inline field; save →
  Inline Alert · Success and the "left of your ceiling" tile updates.
- **Ceiling below spend** — Error Text on the field.
- **Loading** (`?state=loading`) — `Loading your receipts…`.
- `#card-on-file` is a stable anchor (the account menu's `Payment method` item
  links to it).

---

## 4. Copy — every string, verbatim (the copy IS the design)

Braced values (`{N}`, `{Market}`, `{September}`) are data; everything else is
literal and appears in the build unchanged.

### `index.html`
Page title `Create your advertiser account — BaseLocal` · Kicker `BaseLocal for business` · H1 `One account for every placement you buy.` · Subhead `Your markets, your budget, and who you're reaching — in one place. Opening an account is free; you only pay when you book something.` · Labels `Work email *` (placeholder `you@yourbusiness.com`), `Password *` (placeholder `At least 10 characters`) · Helper `We'll only email you receipts and run notices.` · CTA `Create account →` · Loading `Creating your account…` · Link `Already have one? Sign in` · Errors: `Add the email where you want receipts sent.` / `That address is missing an @ — try name@business.com.` / `This email already has an account. Sign in, or reset the password.` / `Make it at least 10 characters.` · Disclaimer `By creating an account you agree to BaseLocal's advertising terms. We don't share your details with other advertisers.`

Verify state: H1 `Check your email.` · Body `We sent a six-digit code to {email}. It's good for 15 minutes.` · Label `Six-digit code *` (placeholder `123456`) · CTA `Verify and continue →` · Link `Send it again` · Microcopy after resend `Sent. Give it a minute.` · Error wrong `That code doesn't match. Check the newest email — we send a new one each time you ask.` · Error expired `That code expired. We've sent a fresh one.` · Link `Wrong address? Start over`

### `signin.html`
Page title `Sign in — BaseLocal for business` · H1 `Sign in.` · Subhead `Your placements, receipts, and market numbers.` · Labels `Email *` · `Password *` · CTA `Sign in →` · Loading `Signing in…` · Links `Forgot your password?` · `Need an account? Create one` · Error `That email and password don't match. Try again, or reset the password.`

### `setup.html` step 1
Page title `Set up your account — BaseLocal for business` · Step Indicator `Business` · `Markets` · H1 `Tell us who's advertising.` · Subhead `This is what your editor works from, and what readers see when your placement runs.` · Section `01 The business` · `Business name *` (placeholder `Rivera Dental Studio`, helper `Up to 80 characters. Use the name people know you by.`) · `Category *` pills: `Eat & drink` · `Shop` · `Services` · `Wellness` · `Beauty` · `Fitness` · `Home & garden` · `Kids & pets` (helper `Your editor can move you later if another fits better.`) · `Website *` (placeholder `https://`) · `Street address or service area *` (placeholder `1200 5th Ave S, Naples FL — or "Collier County"`, helper `A street address if people come to you. The towns you cover if you go to them.`) · `Phone` (helper `Optional. Only used if your editor has a question before a run.`) · Section `02 You` · `Your name *` · `Your role *` (placeholder `Owner, marketing manager, agency…`) · CTA `Next: pick your markets →` · Errors: `Add the business name — it's what readers will see.` / `Pick the category that fits best.` / `Add a link, starting with https://.` / `Tell us where you are, or which towns you cover.` / `Add your name.` / `What's your role there?`

### `setup.html` step 2
H1 `Where do you want to be seen?` · Subhead `Pick the markets you'd buy in. Adding one costs nothing, and you can add more whenever.` · Search placeholder `Search 400+ markets` · Quick actions `+ All markets` · `Clear all` · Counter `{N} selected` · Row `{Market}, {ST} — {N} subscribers` · Combined (≥2) `{N} markets · {N} subscribers combined.` · Helper `Counts are from this morning's send.` · Empty search `No markets match "{query}."` · CTA `Finish setup →` (disabled label `Pick at least one market`) · Link `Back to business details`

### `home.html`
Page title `Your markets — BaseLocal for business` · Nav `Markets` · `Book` · `Budget` · Account menu `{Business name} ▾` → `Business details` · `Payment method` · `Sign out` · Heroes: first-run `You haven't booked anything yet.` (subline `{Market} goes out tomorrow at 6am to {N} people. {N} spotlight spots are open.`) / running today `Your spotlight runs in {Market} this morning.` / tomorrow `Your spotlight runs in {Market} tomorrow morning.` / later `Next up: {Market}, {Weekday} morning.` / in review `Your {Market} spotlight is with the editor. She usually replies inside a day.` / nothing `Nothing of yours runs this week.` · Sublines: multi-market `Nothing booked in {Market} or {Market} after {Weekday}.` / nothing-scheduled `The next open day across your markets is {Weekday}, {Month} {D}.` · Card H3 `{Market}, {ST}` · Tile labels `subscribers` · `open rate` · `last sent` · Card statuses: `Running tomorrow. {N} of {N} spots open {Month} {D}.` / `Nothing booked. Next open day: {Weekday}, {Month} {D}.` / `Full through {Weekday}. First opening: {Weekday}, {Month} {D}.` / `{N} placements ran here in {Month}.` · Card link `Open {Market} →` · Money strip `Charged in {Month}` · `Paid for, not yet run` · link `Budget and receipts →` · CTA `Book a placement →` · Footer microcopy `Every number here is a total. We never show you individual readers, and we don't sell subscriber data.` · Loading `Pulling this morning's numbers…` · Error `We couldn't reach the numbers just now. Everything you've booked is still on.` + `Try again` · No-markets empty `You haven't picked any markets. Add one and we'll show you who reads us there.` + `Add a market →`

Plus one section heading the contract did not name: **`Your markets`**, the H2 above
the card grid (see **Design-system gaps**).

### `market.html`
Page title `{Market}, {ST} — BaseLocal for business` · Breadcrumb `Markets / {Market}, {ST}` · H1 `{Market}, {ST}` · Subhead `Sent every morning. Last edition: {Weekday}, {Month} {D}.` · H2 `Who you reach in {Market}` · Tiles: `{11,879}`/`Subscribers` · `{58%}`/`Opened the last 30 days` · `{69}`/`Editions sent in 30 days` · `{Sep 1}`/`Last sent` · Qualifying line `We delivered {764,768} emails in {Market} over the last 30 days. That's send volume across every edition — the {11,879} is the people.` · Trends: up `Open rate is up about {two} points on the month before.` / down `Open rate slipped about {two} points from the month before.` / flat `Open rate is holding steady month to month.` · Network line `Across every BaseLocal market, roughly 73% of readers are women and most are 50 or older. We don't break that down by city yet.` · Clicks heading `Clicks` · unavailable `Our click counter stopped updating on August 16, so there's nothing here we'd stand behind. Subscribers, opens and send dates above are current through this morning.` · available `Readers clicked {8,280} links in {Market} last month.` · Fine print `Totals only. Nothing here identifies a reader, and we don't sell subscriber data.` · Tooltips: subscribers `People signed up to this market's daily email, as of this morning.` / open rate `Unique opens divided by emails delivered, across every edition we sent here in the last 30 days.` · H2 `What you're running in {Market}` · Run sheet row `{Weekday}, {Month} {D}` · `{Spotlight — newsletter + directory}` · chip · `${25}` · Chips `In review` · `Set` · `Live` · `Ran` · `Refunded` · Availability line `Spotlights: {1} of {2} open {Weekday}, both taken {Weekday}. Events: {4} of {6} open {Weekday}.` · Run sheet empty `Nothing of yours running in {Market}. The next open day is {Weekday}, {Month} {D}.` + CTA `Book {Weekday} →` · CTA `Book in {Market} →` · Link `Remove this market` · Dialog: title `Remove {Market} from your account?` body `Anything already booked still runs, and you keep the receipts. You just stop seeing {Market} here.` buttons `Remove {Market}` · `Keep it`

As built, the run-sheet date cell renders the abbreviated weekday (`Tue, Sep 1`) so
the 96px column holds one line at 375px; the month grouping header carries the full
`{Month} {Year}`.

### `book.html`
Page title `Book a placement — BaseLocal for business` · Step Indicator `What` · `Where` · `When` · `Pay` · H1 `What are you promoting?` · Pick cards: `Your business` — `A spotlight in the daily email and at the top of the directory. Priced per market, per day.` / `An event` — `Anything with a date — a sale, a class, a fundraiser. Pinned in the events directory, with an option to run inside the email.` · Section `02 Where should it run?` (helper `Your markets are checked already. Add any of the other 400.`) · Section `03 Which days?` (helper `Three days' notice, so your editor has time to write it.`) · Calendar legend `Crossed off means full. Half-filled means open in some of your markets, not all.` · Partial-day helper `{Month} {D} — open in {Market} and {Market}, full in {Market}.` · Section `04 How big?` · Tier cards: `Directory` · `$10 / market / day` · `Pinned above every listing in that market's directory.` / `Directory + newsletter` · `$25 / market / day` · `Everything above, plus your spot inside that morning's email.` · badge `Most businesses` · Order summary header `Order summary` · Line items `Markets` · `Days` · `Placement` · Math line `{8} days × {3} markets × ${25}` · `Total` · Empty `Pick markets and days to see your total.` · Ceiling error `This would take you ${75} past the ${500} ceiling you set for {September}. Drop a few market-days, or raise the ceiling.` + `Change the ceiling →` · Slot-lost error `Someone took the last {Market} spot on {Month} {D} while you were picking. We dropped that day — everything else is still yours.` · CTA `Review and pay →` (disabled label `Pick markets and days`)

Section 01 has no numbered Form Section Header — the H1 `What are you promoting?`
is the section (the contract supplies no `01 …` string). The mobile summary bar
adds one control label the contract did not name: **`View summary ▴`**, taken
straight from the design system's Order Summary Card mobile pattern.

### `review.html`
Page title `Review and pay — BaseLocal for business` · H1 `Review and pay.` · Subhead `Your card ending in {4242} gets charged today, once. Nothing recurring.` · Editorial note `A BaseLocal editor in each market writes the final copy and sends it to you before the first day runs.` · Refund line `Cancel any day up to 48 hours before it runs and that day is refunded in full. Inside 48 hours, the day is locked in.` · Legal `By paying you agree to BaseLocal's advertising terms and confirm the business is yours to promote. Declined placements are refunded in full.` · CTA `Pay ${600} →` · Processing `Charging your card…` · Link `Use a different card` · Error `Your bank turned down the charge. Nothing was booked and nothing is held.` + `Try another card →`

### `booked.html`
Page title `Booked — BaseLocal for business` · H1 `Booked. Your editor takes it from here.` · Body `${600} charged to the card ending in {4242}. The receipt is already in your inbox.` · Next steps: `An editor in each market reads your details within a day.` · `She writes the copy and emails it over for you to approve.` · `Your placement runs on the mornings you picked.` · `Cancel any day up to 48 hours before it runs.` · Microcopy `Receipt #{id} · {Month} {D}, {Year}` · CTA `Back to your markets →` · Link `Book something else`

The next-steps list is introduced by a screen-reader-only `Next steps` heading —
the contract names the group but supplies no visible heading, so none is rendered.

### `budget.html`
Page title `Budget and receipts — BaseLocal for business` · H1 `Where the money went.` · Subhead `{September} so far, plus everything you've paid for that hasn't run yet.` · Tiles: `${340}`/`Charged in {September}` · `${200}`/`Paid for, not yet run` (tooltip `You're charged when you book. This is the part you've paid for that hasn't run yet.`) · `${160} left`/`Of your ${500} ceiling` · Section `Monthly ceiling` (helper `A limit you set on yourself. We block any booking that would cross it. Change it whenever — it applies to your next booking.`) · Link `Change ceiling` · Field `Monthly ceiling *` (placeholder `500`) · Error `Your ceiling can't be lower than the ${340} you've already spent this month.` · Success `Ceiling set to ${750} for {September}.` · Section `Card on file` · Body `{Visa} ending {4242} · expires {04/29}` · Link `Replace card` · Section `Receipts` · Columns `Date` · `What` · `Markets` · `Amount` · `Status` · Chips `Paid` · `Refunded` · `Partly refunded` · Row link `Download invoice` · Empty `No charges yet. When you book, the card on file gets charged that day — nothing recurring, nothing held in advance.` · Loading `Loading your receipts…` · Fine print `Amounts include any sales tax we're required to collect.`

The ceiling editor's save control is labelled **`Save ceiling`** (the contract names
the link that opens the editor but not the one that commits it). With the seeded
Rivera data the tiles read `$300` charged / `$350` paid-not-yet-run / `$200 left`
of a `$500` ceiling — the braced figures above are examples, the built figures are
derived from the mock (§5).

### Global chrome
Footer nav `Advertising terms` · `Privacy` · `partner@baselocal.com` · Footer fine print `© 2026 BaseLocal. Placements are reviewed by a local editor before they run.` · Bad market slug `We don't have a market by that name. Back to your markets →`

---

## 5. Data (mocked in `app.js`)

**Advertiser:** `{ email, business { name ≤80, category (one of the 8 pills),
website http(s), address, phone optional }, contact { name, role }, markets[≥1],
monthly_ceiling_cents (null = unset), payment_method { brand, last4, exp } }`.

**Booking:** `{ id, charged (ISO), type 'business'|'event',
tier 'directory' ($10) | 'directory_newsletter' ($25), markets[], days[] (ISO, each
≥ today+3 at booking time), status: in_review | scheduled | live | ran | refunded,
receipt_status: paid | refunded | partly_refunded, refunded_days[] }`.
`total = markets × days × unit_price`, recomputed on every selection change.

**Audience mock** — real rounded platform reads (live read 2026-09-01), approved for
public display alongside the visible "Sample data" stamp:

| Market | Subscribers | Open rate | Editions 30d | Delivered 30d | Last sent |
|---|---|---|---|---|---|
| Naples, FL | 11,879 | 58% | 69 | 764,768 | Sep 1 |
| Albuquerque, NM | 2,856 | 43% | 69 | 174,837 | Sep 1 |
| Rio Rancho, NM | 890 | 40% | 69 | 59,042 | Sep 1 |
| Santa Fe, NM | 4,006 | 59% | 136 | 262,371 | Sep 1 |

Prior-month open rates drive the trend sentence: Naples 56 → 58 (up two),
Albuquerque 45 → 43 (down two), Rio Rancho and Santa Fe unchanged (flat).

The Location Multi-Select needs a list to search, so `app.js` carries **30 markets
across 7 states**. The four above are the real reads; the other 26 carry
**illustrative** figures of the same shape. Every screen that shows any of them
carries the "Sample data" stamp. Production reads all 400+ from the per-location
advertiser-insights endpoint.

Rules: `delivered_30d` is send volume, never rendered as an audience size and always
accompanied by the qualifying sentence; rates render as whole percentage points;
`clicks_30d` exists in the mock but renders only when `CLICKS_AVAILABLE` is true.

**Inventory mock.** Capacity is **2 spotlights** and **6 events** per market, per
day. `sold = seeded base + the account's own bookings`, capped at capacity. The seed
(`BASE_SOLD` in `app.js`) is chosen so every calendar state actually renders:

| Seeded | Why |
|---|---|
| Naples spotlights full Sep 10, 17, 24 | a crossed-off day and the `both taken Thursday` clause |
| Naples events 2 of 6 sold Sep 4 | makes `Events: 4 of 6 open Friday` true |
| Rio Rancho spotlights full Sep 4–6 | the `Full through Sunday. First opening: Monday, September 7.` card status |
| All three NM markets full Sep 9 (spotlights and events) | a fully crossed-off day for a 3-market selection |
| Santa Fe spotlights 1 of 2 sold Sep 5 | exactly one spot left — the slot-lost trigger |

Day state across N selected markets: **open** if all have room, **partial** if some,
**full** if none.

**Demo bookings.** Rivera Dental Studio: five bookings (three charged in August,
two charged today) producing `Ran`, `Refunded`, `Live`, `Set` and `In review` chips
in the Naples run sheet, `$300` charged in September, `$350` paid-for-not-yet-run
against a `$500` ceiling. Because today is the 1st, the September charge total is
smaller than the paid-for-not-yet-run total — the August-charged booking that runs
Sep 2–3 sits in the latter and not the former, which is the honest reading of both
tiles. Zia Media Group: three bookings producing an August `Ran` block, a
refunded receipt, and a Santa Fe `In review` spotlight that runs tomorrow — which is
why Zia's default home hero is the in-review variant.

**Validation.** Email minimal RFC shape; password ≥ 10 characters; code exactly 6
digits (`123456` valid, `000000` expired); business name 1–80 (`maxlength="80"`);
website must parse as `http(s)://…`; every bookable day ≥ today + 3; ceiling ≥
current-month charged; total blocked over the ceiling.

---

## 6. Payment / external integrations (mocked here — this is the production contract)

- Card on file via a Stripe **SetupIntent**; the prototype never renders a card-entry
  form anywhere.
- A **Payment Intent** at booking; `paid_at` is the revenue-recognition timestamp.
- **15-minute inventory holds** while a booking is being assembled. A lost hold
  surfaces as the slot-lost error (mocked in the prototype as a single scripted
  trigger on Sep 5 / Santa Fe).
- **Per-day 48-hour refunds** that release inventory back to the market-day.
- **Server-side ceiling enforcement.** The client-side block is UX only.
- Auth implementation is open; the prototype mocks email + password + a 6-digit code.
- Emails: verification code, receipt, copy-approval request, run-day notice,
  decline + refund.

---

## 7. Open questions

1. **ICP.** SMB-primary chosen for this build; media-buyer machinery (invoices, POs,
   agency seats, rate cards) not designed.
2. **Pricing.** Prototype echoes V1's $10/$25 per market per day; volume /
   multi-market / commitment pricing unresolved — a principal decision.
3. **Event pricing parity.** Same $10/$25 for very different caps (2/day vs 6/day)
   and buyer types.
4. **Claiming V1 anonymous orders** by purchase-email match.
5. **Auth implementation.**
6. **Multi-user accounts.**
7. **Public numbers.** DECIDED — real markets, real rounded numbers, visible
   "Sample data" stamp; never a real customer business name.
8. **Per-market demographics** (only network-level 73% / 50+ exists).
9. **Click feed.** Flip `CLICKS_AVAILABLE` when repaired; the platform's
   `avg_click_rate == avg_ctor` field collision must be fixed first.
10. **Cancel/refund UI.** Promised in copy, not built — next iteration.
11. **Copy-approval loop.** Revision rounds; owner never approves before the first
    booked day.
12. **Ceiling semantics.** Calendar month (as designed) vs rolling 30 days vs
    per-market.
13. **Auto-renew.** Not built; if prioritized, revisit the wallet model.
14. **Accessibility.** Full WCAG AA audit still required on the built prototype.

---

## Drift-source checklist (verified against the build)

| Contract value | Where it lives in the build | Verified |
|---|---|---|
| 80-character business name | `NAME_MAX = 80` in `app.js`; `maxlength="80"` on `#bizName`; helper `Up to 80 characters.` | ✓ |
| 6-digit code, `123456` valid / `000000` expired | `pageIndex()`; `maxlength="6"`; expired path also fires `Sent. Give it a minute.` | ✓ |
| 3-day lead time | `LEAD_DAYS = 3` → `FIRST_BOOKABLE = 2026-09-04`; Sep 1–3 disabled in the calendar | ✓ |
| 48-hour cancellation window | `CANCEL_WINDOW_HOURS = 48`; the refund line on `review.html` and the last next-step on `booked.html` | ✓ |
| 2 spotlights per market-day | `CAP.business = 2`; availability line, card statuses, calendar full state | ✓ |
| 6 events per market-day | `CAP.event = 6`; availability line, event-type calendar | ✓ |
| $10 / $25 tiers | `UNIT = { directory: 10, directory_newsletter: 25 }`; tier cards; math line; identical for both placement types | ✓ |
| Every §4 button label | `Create account →`, `Verify and continue →`, `Sign in →`, `Next: pick your markets →`, `Finish setup →` (disabled `Pick at least one market`), `Book a placement →`, `Add a market →`, `Open {Market} →`, `Book in {Market} →`, `Book {Weekday} →`, `Remove {Market}`, `Keep it`, `Review and pay →` (disabled `Pick markets and days`), `Pay ${N} →`, `Back to your markets →` | ✓ |
| Every §4 error string | index (4), signin (1), setup step 1 (6), setup step 2 empty search, home numbers-unavailable, book ceiling + slot-lost, review declined, budget ceiling-below-spend | ✓ |
| No local development URL in this file — the only prototype link is the Pages URL at the top | — | ✓ |

---

## Design-system gaps

These are treatments this prototype needed that
`brands/baselocal/design-system.md` does not define. They are recorded here rather
than added to the system — promote any of them only if a second surface needs them.

1. **Account Header.** A signed-in variant of the Site Header: same sticky white
   bar, 1px Warm Border rule, 1120px inner at 20px/24px, 28px Espresso wordmark.
   Adds section nav (`Markets · Book · Budget`, Site Header nav type — Lato 500 15px
   Gray, active Lato 700 Terracotta with a 2px underline) and an account menu button
   (Lato 700 14px Espresso, 1px Warm Border, 6px radius, 44px min-height) opening a
   248px white panel with 6px radius and a warm-toned shadow. Below 768px the nav
   wraps to a second, horizontally scrollable row and the wordmark drops to 22px.
   The Sticky Filter & Utility Bar reads the header's measured height into
   `--header-h` rather than hard-coding the 68px the system quotes for events hubs.
2. **Metric Tile.** Compact number lockup: figure Bitter 700 24px Espresso
   (tabular numerals), label Lato 400 13px Gray, 1px Warm Border, 6px radius, 14px
   16px padding. Deliberately **not** the Stat Hero (64px Terracotta) — an account
   screen shows several numbers at once and none of them is the story.
3. **Status Chip.** Lato 900 10px uppercase, 0.06em tracking, 2px 7px padding, 3px
   radius. `In review` Warm Cream / Gray / Warm Border · `Set` White / Gray / Warm
   Border · `Live` Light Green / Green · `Ran` White / Silver · `Refunded` White /
   Silver with `line-through`. Receipt statuses reuse the same chip: `Paid` takes
   the `Set` treatment, `Partly refunded` the `In review` treatment, `Refunded` its
   own — the contract names the receipt chips but not their colours.
4. **Multi-Select Calendar · Partial day state.** Sits between Selected and Full:
   a half-height terracotta fill at 40% opacity rising from the cell baseline,
   Charcoal text, still selectable, `title` and an on-select helper line naming the
   markets it is full in. The system's Full state (silver, line-through) and
   Selected state (solid terracotta) are unchanged.
5. **Run Sheet Row.** Grid `96px | minmax(0,1fr) | auto | 64px` — date · placement ·
   status chip · cost — 12px gap, 14px vertical padding, 1px Warm Border rule,
   grouped under a month header that borrows the Event Day-List Table's day header
   (Lato 900 13px uppercase Espresso over a 2px Espresso rule). Past rows drop to
   55% opacity and their placement text de-emphasises to Lato 400 Gray. **At
   ≤560px** the row re-flows to two lines (`date | cost` above `placement | chip`)
   so the 375px viewport never scrolls sideways.
6. **Sample data stamp.** Lato 900 10px uppercase, 0.06em tracking, Silver on White
   inside a 1px Warm Border, 3px radius — the Status Chip geometry in a neutral
   register. Required on every screen that shows audience numbers.
7. **Pick Card / tier card as a form control.** The system's Pick Cards are
   editorial recommendation cards; here they are `<button aria-pressed>` selectors.
   Geometry is unchanged (1px Warm Border, 4px radius, 32px padding, featured =
   2px Terracotta); the selected state reuses the featured border and the tier
   badge reuses the Feature Comparison Table's Pick badge.
8. **Money strip.** A Warm Cream, Warm Border, 6px-radius bar carrying two Metric
   Tile lockups and a trailing link. Nothing in the system covers a summary bar of
   this shape.
9. **Order Summary empty state copy.** The system's Order Summary Card specifies
   `Pick dates and locations to see your total.`; the contract's §4 string is
   `Pick markets and days to see your total.` — §4 wins, because "markets" is this
   product's word.
10. **Event tier labels.** §3 anticipates that "for events, labels change but
    pricing doesn't", but §4 supplies only one set of tier-card strings. Rather than
    invent copy, the build renders the same two tier cards for both placement
    types. Event-specific tier labels are an open copy task.
11. **Subhead at mobile.** The system gives the 20px hero subhead no mobile size;
    it stays 20px at 375px here, which reads fine at the 560px auth width.

---

## Accessibility notes

Real headings in order on every page; the account menu is a `button` with
`aria-expanded` over a `role="menu"` panel closed by outside click or `Escape`;
calendar days, market rows, pick cards and tier cards are real buttons carrying
`aria-pressed`, and unavailable days carry `disabled` + `aria-disabled` + a `title`
explaining why; the breadcrumb is a `nav` with `aria-current="page"`; the remove
dialog is a native `<dialog>`; alerts carry `role="alert"` or `role="status"`; every
tappable target clears 44×44px; focus-visible rings are 2px Terracotta at 2px
offset; all motion collapses under `prefers-reduced-motion: reduce`. **No number on
any screen counts up** — figures render at their final value. The full WCAG AA audit
is still outstanding (§7.14).
