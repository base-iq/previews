# Business Spotlight (Self-Service Ads + Directory) — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `business-spotlight`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/business-spotlight/](https://base-iq.github.io/previews/baselocal/prototypes/business-spotlight/)

---

## 1. Goal

A self-service ad product for local businesses, plus the reader-facing surface it sells placement on. Three pieces, designed together:

1. **Local business directory** (`directory.html`) — a per-location, editor-curated directory of local businesses. New reader surface.
2. **Self-serve ad flow** (`index.html` → `advertise.html` → `checkout.html` → `confirmation.html`) — businesses buy a "pin": **$10/location/day** pins them at the top of that location's directory; **$25/location/day** adds the lead spot in the daily newsletter's Local Business Spotlight section.
3. **Newsletter placement** (`newsletter.html`) — how the $25 tier's Pinned Spotlight renders inside the 7xv1 daily email.

**Inventory is capped at 2 pinned placements per location per day.** Sold-out days appear crossed off in the booking calendar. The cap is a core business rule, not a UI detail — it surfaces in the FAQ ("What happens when a day sells out?"), the form's placement intro, and the calendar legend.

The product is editorial, not programmatic: a BaseLocal editor in the relevant location reviews every placement and **writes/polishes the final copy** before it runs. Paid placements are always disclosed (`Pinned *` stamp / `Pinned spot *` tag + fine-print rule).

## 2. User flow

### Advertiser flow (5 screens)

| # | Screen | File | Action forward |
|---|--------|------|----------------|
| 0 | **Advertise fork** | `choose.html` | "An event" → event-submission flow · "A local business" → `index.html` |
| 1 | **Pitch** | `index.html` | Click a tier card (or a proof-section CTA) → `advertise.html?tier={directory\|newsletter}` |
| 2 | **Business details** | `advertise.html` | Fill single-page form → `checkout.html?tier=…&locations=…&days=…&total=…&business=…` |
| 3 | **Payment** | `checkout.html` | Enter card, click `Pay $X →` → `confirmation.html?…` |
| 4 | **Confirmation** | `confirmation.html` | Terminal — book another placement or view the directory |

Step indicator (`Placement · Details · Payment · Done`) on screens 2–4; collapses to a `Step N of 4` pill on mobile. Same pattern as the event-submission flow — the two flows should feel like siblings.

**CTA routing rule:** *generic* "Advertise" CTAs (top nav, newsletter top-links, footer) land on the fork (`choose.html`) because many advertisers are actually event organizers. *Specific* feature-your-business CTAs (the newsletter spotlight section's Advertise CTA, the directory's Slot CTAs) skip the fork and go straight to `index.html`. The pitch page carries a reciprocal escape hatch: an event callout under the hero ("Promoting an event? That has its own flow →") plus an FAQ entry, both linking to the events flow.

**Navigation model:** directories live inside each location's own navigation, not the global nav. The global nav is `Home · Locations · Advertise · Submit Event`; on ≤600px only Locations + Advertise stay visible.

### Reader surfaces (2 screens)

- `directory.html` — the location's business directory (prototype shows Glendale, CA). Linked from the pitch ("See a live directory →") and from every newsletter.
- `newsletter.html` — a 7xv1 edition excerpt showing the Pinned Spotlight in context. Linked from the pitch ("See it in the email →").

## 3. States

### `choose.html` — Advertise fork
- **Default only.** Static two-card chooser (An event / A local business), hover-lift per card, helper line for the unsure ("Events have dates; businesses don't").

### `index.html` — Pitch
- **Default only.** Static pitch; tier cards hover-lift. CTAs: hero button + both proof-section buttons + tier cards + post-FAQ "Ready when you are." block (hero and bottom CTAs anchor to `#tiers`; proof CTAs deep-link to `advertise.html?tier=…`). No error/empty states.

### `advertise.html` — Business details
- **Empty (default):** all fields empty, no locations, no days. Summary shows "Pick locations and pin dates to see your total." Continue disabled. Mobile: sticky bottom bar with `Total $0` + disabled `Continue to payment →`.
- **Tier banner:** same in-place tier switching as events — Directory tier shows an upsell card + `Upgrade to Directory + Newsletter (+$15 / location / day) →` CTA; Newsletter tier shows a `Switch to Directory only` link. Switching updates rate, summary, and URL via `history.replaceState`.
- **Description:** **500-char limit.** Counter `{used} / 500`, terracotta at ≥450, red at limit.
- **Location search empty result:** `No locations match "{query}."`
- **Calendar:**
  - **3-day lead time** — today/tomorrow/day-after blocked (silver, disabled).
  - **Full days** — days where both placements are sold render with the **Full state** (silver + strikethrough, disabled, `title="Both placements for this day are taken"`, `aria-disabled`). Legend below the calendar: *"Crossed-off days are full — two placements max per location, per day."* Prototype mocks full days at earliest+2, +6, +11; **production queries live inventory per selected location set** (see Open Questions #2).
  - Quick picks (`This weekend`, `Next 7 days`, `Next 30 days`, `Clear`) **skip full days** silently.
- **Cost calculator:** updates on every locations/dates change. Math line `{N} days × {M} locations × ${rate}`. Continue enables only when all required fields + ≥1 location + ≥1 day.
- **Validation:** Continue stays disabled until complete (prototype). Production should additionally show inline Error Text on blur/submit per design system.

### `checkout.html` — Payment
- Card number auto-spaces every 4 digits; expiry formats `MM / YY`; numeric inputmode.
- **Processing:** Pay click disables button, shows `Processing…` ~900ms (mock), then forwards. Production: real Stripe confirm; card errors render as Inline Alert · Error above the form.
- Out of scope: declined card UI, 3DS, wallets, ACH, saved cards.

### `confirmation.html` — Done
- Success only; failed payments never reach this URL. Receipt ID is client-generated in the prototype; production uses the Stripe payment intent ID or internal placement ID.

### `directory.html` — Directory (reader)
- **Default:** Pinned Zone (label `Pinned in Glendale today`, 2 pinned cards, fine print `* Paid placement, city-wide. Reviewed by our editor like every listing.`) → **top Slot CTA** directly under the zone → result meta (`All · 18 places`) → listing cards with an inline Slot CTA after the 4th card.
- **Top Slot CTA logic:**
  - Both pins sold (prototype default): *"Both pinned spots are taken today. Want the next open day? $10 puts your business up top — $25 adds the morning email. Advertise →"*
  - One pin sold: the open slot renders **inside the Pinned Zone** as the open-slot Slot CTA variant (*"One pinned spot is open today." / "Your business, top of this page, $10 a day. Claim the spot →"*).
  - Zero pins sold: no Pinned Zone; the open-slot Slot CTA sits alone at the very top of the results.
- **Category filtered:** pills are single-select with `All` default. The Pinned Zone **persists unchanged above filtered results** — pins are city-wide, not per-category; each pinned card's own category tag + the zone label carry that context. Result meta becomes `{Category} · {N} places`.
- **Search:** filters name, editor note, and category live on input (and Enter / Search click). Result meta becomes `"{query}" · {N} matches`. **Typing a query resets the category filter to `All`** — a query is a city-wide question, not a within-category one.
- **Mobile header:** at ≤600px the site header keeps only the two flow-relevant nav links (Directory, Advertise); Home and Submit Event/Subscribe hide (`nav-extra` class).
- **Empty result:** card with `No spots match "{query}."` + "browse everything" reset link (clears query + filter).
- **Card copy lengths:** organic cards hold the one-sentence discipline; **pinned cards may run a short paragraph (2–3 sentences)** — the placement buys a fuller story, not a different voice.
- Inline mid-list Slot CTA renders only when >5 results.

### `newsletter.html` — Newsletter placement (reader)
- Static mock of a Glendale 7xv1 edition excerpt: masthead/intro → abbreviated In the News → full **Local Business Spotlight** section (Pinned Spotlight block on top of 3 organic items + Advertise CTA) → signoff + dark footer with the `*` paid-content disclosure.
- **Max two Pinned Spotlights per edition**, ordered by purchase time; prototype shows one (typical case).
- **No pricing in email CTAs** — the Advertise CTA reads "We feature local spots every day — tell us about yours."

## 4. Copy

Voice rules per `brand-guide.md` / `general-writing-guide.md`. Highlights (full strings in the HTML):

### Pitch (`index.html`)
| Element | Copy |
|---|---|
| Kicker | `For local businesses` |
| H1 | `Your business, recommended.` |
| Lede | `Pinned to the top of your city's directory — and into the email your neighbors open every morning.` |
| Hero CTA | `Feature your business →` (anchors to `#tiers`) |
| Event callout (under hero) | `Promoting an event? That has its own flow →` (links to event-submission) |
| Section 01 | `01 · In the directory` / `Pinned above every listing in your city.` + `From $10 · per location · per day` + secondary button `Start with Directory →` (→ `advertise.html?tier=directory`) |
| Section 02 | `02 · The full placement` / `Top of the directory, and featured in the newsletter.` ("and" in terracotta) + includes-card (`Pinned at the top of the directory…` / `Featured inside the daily newsletter…`) + `From $25 · per location · per day` + primary button `Get both placements →` (→ `advertise.html?tier=newsletter`) |
| Trust band | `Why this works` / `Our readers opted in because they trust our recommendations.` / `A BaseLocal editor in your city reviews every placement before it runs — and polishes your copy into the voice readers already know. That's how the trust survives the ads.` |
| Tier section | `Pick a tier to continue` / `How do you want your business seen?` / `Both priced per location, per day. You'll pick your city and days on the next screen.` |
| Tier card 1 | `Directory` / `$10 / location / day` / `Pinned in the directory` |
| Tier card 2 | `Most businesses` badge / `Directory + Newsletter` / `$25 / location / day` / `Into the morning email` / blurb "Everything in Directory, plus your business featured inside the daily newsletter for each city." |
| FAQ | 7 entries: event redirect ("I'm promoting an event, not a business.") / who writes the copy / sold-out days / pricing across locations / who reviews / cancellation (48h) / review time (24h) |
| Bottom CTA | `Ready when you are.` / `Questions first? Email partner@baselocal.com — a human answers.` / `Pick your placement →` (anchors to `#tiers`) |

### Advertise fork (`choose.html`)
| Element | Copy |
|---|---|
| Kicker | `Advertise with BaseLocal` |
| H1 | `What are you promoting?` |
| Lede | `Two flows, one idea: flat per-day pricing, reviewed by a local editor before it runs.` |
| Card 1 | `An event` / `Get your event on the calendar.` / "Concerts, markets, fundraisers, classes — anything with a date. Pinned in the events directory, with an option to run inside the daily newsletter." / `Promote an event →` |
| Card 2 | `A local business` / `Get your business recommended.` / "A storefront, restaurant, or service locals should know about. Pinned at the top of your city's business directory, with an option to be featured in the daily newsletter." / `Feature your business →` |
| Helper | `Looking for a custom advertising package? We build tailored campaigns for advertisers with $1,500+/month budgets — reach out at partner@baselocal.com.` |

### Form (`advertise.html`)
- H1 `Tell us about your business.` / sub `Our local editor turns this into your directory line and newsletter copy — you'll see it before it runs.`
- Tier banner (newsletter): "Pinned at the top of the directory, plus featured inside the daily newsletter." Upsell (directory tier): "…your business is also featured inside the daily email readers already open."
- Sections: `01 About the business` (Business name ≤80 · Category single-pick from 8 · "What should readers know?" ≤500 · Address required with service-area helper · Website required · Hours optional) · `02 Your placement` (intro states the 2-per-city cap; Locations multi-select ~430; Days calendar) · `03 About you` (Full name, Your role, Email, Phone — all required).
- **Categories (8, fixed, shared with directory):** Eat & drink, Shop, Services, Wellness, Beauty, Fitness, Home & garden, Kids & pets.

### Payment / Confirmation
- `Review and pay.` / sub "Your placement is held until payment clears, then sent to a BaseLocal editor for review."
- Legal: "By paying, you agree to BaseLocal's advertising terms and confirm the business is real and yours to promote. Placements are reviewed before going live; declined placements are refunded in full."
- Refund line: "Charged once on submission. Cancel up to 48 hours before any day's run for a full refund of that day. Inside the 48-hour window, the day is locked in."
- Confirmation H1 `Paid. We've got it from here.` + 4-item next-steps checklist (review queue → editor drafts copy, you approve → live links + run calendar → edits until each run starts).

### Directory (`directory.html`)
- Kicker `Glendale directory` / H1 `What are you looking for?` / dek `Every listing checked by our Glendale editor. Paid pins are marked — every time.`
- Search placeholder `Try "plumber" or "coffee"`.
- Zone label `Pinned in Glendale today`; stamp `Pinned *`; zone fine print `* Paid placement, city-wide. Reviewed by our editor like every listing.`
- Bottom fine print: "Listings are curated — our Glendale editor adds the spots worth knowing about, paid or not. Spot something missing? Tell us."

### Newsletter (`newsletter.html`)
- Section: kicker `03 — On our radar` / `Local business spotlight` / dek `Nearby spots we'd actually send a friend to.` (existing live line)
- Pinned tag `Pinned spot *`; body in the organic-item format (bold lead-in + linked name + story).
- Advertise CTA: `Run a business around Glendale?` / `We feature local spots every day — tell us about yours.` / `Advertise with BaseLocal →` — **never pricing in email**.
- Footer adds: `* Content marked with an asterisk is paid advertising, reviewed by our editor before it runs.`

## 5. Data requirements

### Placement record

```
{
  id: string (server-generated)
  status: 'pending_payment' | 'pending_review' | 'copy_approval' | 'approved' | 'declined' | 'live' | 'expired'
  tier: 'directory' | 'directory_newsletter'
  unit_price_cents: 1000 | 2500
  total_cents: number   // locations.length × days.length × unit_price_cents — server recomputes, never trusts client

  business: {
    name: string (required, ≤ 80 chars)
    category: enum (one of the 8 categories, required)
    pitch: string (required, ≤ 500 chars)        // what the owner wrote
    address: string (required)                    // street address or service-area description
    url: string (required, valid URL)             // the listing's link target
    hours: string | null                          // optional free text
  }

  editorial: {
    directory_note: string | null     // editor-written; 2–3 sentences for pinned
    newsletter_copy: string | null    // editor-written; only for directory_newsletter tier
    copy_approved_at: timestamp | null  // owner sign-off before first run
  }

  schedule: {
    locations: string[]   // location slugs, ≥ 1
    days: string[]        // ISO dates, ≥ 1, each ≥ today + 3 days at submission
  }

  advertiser: { name, role, email, phone — all required }
  payment: { stripe_payment_intent_id, stripe_charge_id, paid_at }
  review: { reviewer_id, reviewed_at, decline_reason }
  created_at / updated_at
}
```

### Inventory ledger (new vs. events platform)

Per `(location_slug, date)`: `pins_sold: 0 | 1 | 2`. Hard cap 2.
- The booking calendar reads this to render Full days. **Race condition matters:** two advertisers can hold the same last slot in parallel — reserve at payment intent creation with a short TTL hold, release on abandonment (see Open Questions #2).
- The directory's top Slot CTA variant (both-sold / one-open / none-sold) reads the same ledger.

### Directory listing record (organic)

The directory needs base content independent of ads: `{ location_slug, name, category, note (one sentence, editor-written), address, url, is_active }`. Source: editors promote businesses already featured in newsletter spotlights (see Open Questions #5).

### Validation rules

| Field | Rule |
|---|---|
| `business.name` | 1–80 chars, trimmed |
| `business.pitch` | 1–500 chars, trimmed |
| `business.category` | one of 8 enum values |
| `business.address` | required, non-empty |
| `business.url` | required; must parse with http(s) scheme |
| `schedule.locations` | ≥ 1, all valid location slugs |
| `schedule.days` | ≥ 1, ISO, each ≥ server-today + 3 days, **and `pins_sold < 2` for every (location, day) pair at reservation time** |
| `advertiser.email` / `phone` | RFC 5322 minimal / 10+ digits |
| `total_cents` | server recomputes from tier × locations × days |

## 6. Payment / external integrations

Same Stripe Payment Intents pattern as the events platform spec (create record `pending_payment` → client confirms → webhook flips to `pending_review`), with one addition: **inventory holds**. Recommended sequence:

1. `POST /api/placements` validates fields **and** places a 15-minute hold on every (location, day) slot; returns `client_secret`. If any slot is full → 409 with the conflicting days, client re-renders the calendar.
2. `payment_intent.succeeded` → holds become sold, status `pending_review`, editor notified.
3. Abandonment / `payment_failed` → holds expire, slots release.

Refunds: editor declines → full refund. Self-cancel ≥48h before a day → that day refunded and **its slot released back to inventory**.

Emails: receipt on payment; copy-approval email (editor's draft, owner approves or requests one revision); live-day confirmation with links; decline email with refund.

Editor side (out of scope, flagged): review queue + a copy-drafting step — this flow has an editorial writing stage the events platform doesn't.

## 7. Open questions

1. **Copy approval loop.** Prototype copy promises "you'll see the final copy before it runs." How many revision rounds? What if the owner never approves before the first booked day — auto-run editor's version, push the day, or refund?
2. **Inventory holds.** 15-min TTL hold at payment-intent creation is the recommendation; confirm, and define the UX when a held slot is lost mid-checkout (events spec never needed this — the 2-cap makes it real).
3. **Pin ordering.** When both pins are sold for a day, who's first? Suggest purchase-time order, matching the newsletter "ordered by purchase time" rule.
4. **Multi-location businesses.** A chain buying 30 cities × 30 days at $25 = $22,500 self-serve. Fine, or should large orders route to a sales contact above some threshold?
5. **Organic directory content.** Who seeds the 10–20 organic listings per location at launch, and is the newsletter-spotlight archive the source? The directory is only credible if it's useful without ads.
6. **Renewals.** Pins are per-day with no auto-renew. Should owners get a "your pin ends tomorrow — extend?" email (likely the highest-impact revenue feature post-v1)?
7. **Category taxonomy.** 8 categories is deliberate (scannable pills). Confirm they cover real inventory — "Professional services" (lawyers, accountants) currently lands in "Services."
8. **Same business, both products.** A restaurant can buy an event placement and a business pin for the same day. Any bundling/conflict rules, or fully independent?
9. **Newsletter slot vs. Lead Sponsor.** A paid Pinned Spotlight and a Lead Sponsor module can coexist in one edition. Confirm the combined paid-density ceiling per edition.
10. **Sunday edition.** 7xv1's Sunday is a best-of recap — does a Sunday pin run in the recap's spotlight section, or is Sunday excluded from booking?
11. **Tax / invoicing.** Stripe Tax, as with events. Businesses will want invoices with their details — receipt email should include a downloadable invoice.
12. **Analytics.** Funnel events (pitch → tier → form → paid → approved) plus advertiser-facing results: do pinned businesses get a click report? ("Your pin was seen by N readers" is a strong renewal driver.)
13. **Accessibility audit.** Built to spec (44px targets, focus states, labels, reduced motion) — full WCAG AA audit on production code still required.

## Component inventory used

From `brain/brands/baselocal/design-system.md`:
- Existing: Buttons, Site Header, Step Indicator, Inline Alert, Form Section Header, Text Input, Textarea, Field Label / Helper / Error Text, Category Pill Selector, Location Multi-Select, Multi-Select Calendar, Order Summary Card, Confirmation Block, Newsletter components (Section Card, Top Nav, Masthead, Kicker, Section Heading/Dek, News Item, Advertise CTA, Newsletter Footer)
- Added for this feature via `extend-design-system` (June 10, 2026): **Site Footer** (formalized), **Directory Search Bar**, **Directory Listing Card** (+ pinned variant, Pinned Zone), **Slot CTA** (inline + open-slot), **Multi-Select Calendar "Full" state**, **Newsletter Pinned Spotlight**

The pitch page's browser-frame and email-frame mockups are page-specific illustrations (like the events pitch), intentionally not in the design system.
