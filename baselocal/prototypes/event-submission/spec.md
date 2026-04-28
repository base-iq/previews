# Event Submission Platform — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `event-submission`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/event-submission/](https://base-iq.github.io/previews/baselocal/prototypes/event-submission/)

---

## 1. Goal

Let event organizers (venues, nonprofits, businesses, local creatives) submit an event to BaseLocal's daily-newsletter audience in any of ~400 locations. Two paid tiers — **Directory** ($10/location/day) pins the event at the top of the location's events directory; **Directory + Newsletter** ($25/location/day) does the same and embeds the event card directly inside the daily newsletter for those locations and days.

The product is editorial, not a marketplace: every submission is reviewed by a BaseLocal editor in the relevant location before going live. Trust is the moat — both for readers and for the submitter, who's paying because BaseLocal's audience is real and curated.

## 2. User flow

Four screens. Each step's URL passes selection state to the next.

| # | Screen | File | Action forward |
|---|--------|------|----------------|
| 1 | **Pitch** | `index.html` | User clicks one of two tier cards → `submit.html?tier={directory\|newsletter}` |
| 2 | **Event details** | `submit.html` | User fills the single-page form → `checkout.html?tier=…&locations=…&days=…&total=…&event=…` |
| 3 | **Payment** | `checkout.html` | User enters card details and clicks `Pay $X →` → `confirmation.html?…` |
| 4 | **Confirmation** | `confirmation.html` | Terminal — user can submit another event or return to BaseLocal home |

A horizontal step indicator (`Pitch · Details · Payment · Done`) sits at the top of screens 2–4 to anchor progress.

## 3. States

### `index.html` — Pitch
- **Default:** as designed. No states beyond hover on tier cards.
- The pitch screen has no error or empty states — it's a static pitch.

### `submit.html` — Event details
- **Empty (default):** every field empty, no locations, no days, summary shows "Pick dates and locations to see your total." Continue button disabled.
- **Tier banner:** shows the tier carried from the pitch step. `Change tier` link returns to pitch and re-selects.
- **Validation errors:** required-field validation runs on the Continue button click. Show inline error text under each empty required field using the **Error Text** component (from design system). Production should also revalidate on blur.
- **Image upload:** prototype only previews the image client-side. Production needs to upload (S3 / Cloudflare R2) and store the URL on the submission record.
- **Description:** 240-char limit. Counter color shifts to terracotta at 90% used, red over limit.
- **Location search empty result:** "No locations match `{query}`."
- **Calendar past dates:** disabled (silver, no hover, not clickable). Back chevron hidden when viewing the current month.
- **Cost calculator:** updates on every change to `selectedLocations` or `selectedDates`. Math line: `{N} days × {M} locations × ${unit price}`. Continue button enables only when all required fields and at least one location and one day are populated.

### `checkout.html` — Payment
- **Default:** all fields empty, summary populated from query string.
- **Card formatting:** auto-spaces card number every 4 digits, formats expiry as `MM / YY`. Numeric inputmode on all card fields.
- **Processing:** on Pay click, button disables and shows `Processing…` for ~900ms (mock). Production replaces with real Stripe `confirmPayment` call.
- **Card error (production):** show **Inline Alert · Error** above the form with the Stripe message. Re-enable the button.
- **Out-of-scope here:** declined card, 3DS challenge, Apple Pay / Google Pay buttons, ACH, saved payment methods.

### `confirmation.html` — Done
- **Success:** as designed. Receipt ID is randomly generated client-side in the prototype; production should use Stripe's `pi_xxx` payment intent ID or an internal submission ID.
- **No failure state at this URL** — failed payment never lands here, it stays on `checkout.html`.

## 4. Copy

Every word follows BaseLocal's voice rules: direct, warm-not-cheesy, honest, story-driven, no banned hype words.

### Pitch (`index.html`)

| Element | Copy |
|---|---|
| Kicker | `For event organizers` |
| H1 | `Here's exactly where your event will go.` |
| Lede | `Two placements, both pinned, both reviewed by a real editor in your location.` |
| Section 1 H2 | `Pinned to the top of every directory you choose.` |
| Section 1 body | "BaseLocal runs an events directory in each of our 400 locations. Yours sits above everything else — for the days you select, in the locations you select." / "Every newsletter we send links to the directory, so the pin keeps working long after you submit." |
| Section 1 price pill | `From $10 · per event · per location · per day` |
| Section 2 H2 | `Or: embedded directly inside the email.` |
| Section 2 body | "Same pin in the directory, plus your event lives in the body of the daily newsletter our readers already open. No click-through required." / "This is how readers see most of what we recommend — restaurants, art, civic stuff. Now your event too." |
| Section 2 price pill | `From $25 · per event · per location · per day` |
| Trust band H3 | `Our readers opted in because they trust our recommendations.` |
| Tier section H2 | `Two ways. Same review process. Same audience.` |
| Tier card 1 | `Directory` / `$10 / location / day` / "Pinned in the directory" / "Top placement in each location you choose, on the days you choose. Linked from every email we send." |
| Tier card 2 | `Most submitters` badge, `Directory + Newsletter` / `$25 / location / day` / "Inside the email itself" / "Everything in Directory, plus your event embedded directly inside the daily newsletter for each location." |

### Form (`submit.html`)

- Page title: `Tell us about the event.`
- Sub: `You can edit anything except dates and locations until your run starts.`
- Section 01: `About the event` — fields: Event name (max 80), Category (single-pick from 20 fixed taxonomies), Short description (240 chars), Start time, Venue, Event website (optional), Featured image (optional).
- Section 02: `When and where` — Locations (multi-select, ~400 across 11 regions), Dates (multi-day calendar, future only).
- Section 03: `About you` — Full name, Title, Company / organization, Email, Phone. All required.

**Categories (fixed list, single-select):**
Art & Culture, Career, Civic, Comedy, Dancing, Family, Festivals, Food & Drink, Fundraisers, Games & Entertainment, Groups & Meetups, Health & Wellness, Holidays, Markets, Music, Outdoor Recreation, Sales & Discounts, Sports, Theater, Workshops & Classes.

### Payment (`checkout.html`)

- H1: `Review and pay.`
- Sub: "Your event submission is held until payment clears, then sent to a BaseLocal editor for review."
- CTA: `Pay $X →`
- Legal: "By paying, you agree to BaseLocal's submission terms and confirm the event is real and yours to promote. Submissions are reviewed before going live; rejected submissions are refunded in full."

### Confirmation (`confirmation.html`)

- H1: `Submitted. We've got it from here.`
- Body: "A BaseLocal editor in {location / each location you picked} will review your event within 24 hours. You'll get an email when it's approved and live — and another receipt copy is on its way to your inbox."
- Next-steps checklist (4 items, see file).

## 5. Data requirements

### Submission record

```
{
  id: string (server-generated)
  status: 'pending_payment' | 'pending_review' | 'approved' | 'rejected' | 'live' | 'expired'
  tier: 'directory' | 'directory_newsletter'
  unit_price_cents: 1000 | 2500
  total_cents: number   // locations.length × days.length × unit_price_cents

  event: {
    name: string (required, ≤ 80 chars)
    category: enum (one of the 20 categories above, required)
    description: string (required, ≤ 240 chars)
    start_time: string  // 24h "HH:mm", required
    venue: string (required)
    url: string | null  // optional, must be valid URL if present
    image_url: string | null  // optional, uploaded asset URL
  }

  schedule: {
    locations: string[]   // location slugs, ≥ 1 required
    days: string[]        // ISO YYYY-MM-DD, ≥ 1 required, all future
  }

  organizer: {
    name: string (required)
    title: string (required)
    company: string (required)
    email: string (required, valid email)
    phone: string (required, E.164 preferred)
  }

  payment: {
    stripe_payment_intent_id: string
    stripe_charge_id: string
    paid_at: timestamp
  }

  review: {
    reviewer_id: string | null   // BaseLocal editor
    reviewed_at: timestamp | null
    rejection_reason: string | null
  }

  created_at: timestamp
  updated_at: timestamp
}
```

### Locations table

400+ location records, each with:
- `slug` (e.g. `tacoma`, `vancouver-wa`)
- `display_name`
- `region` (one of: Pacific Northwest, California, Mountain West, Southwest, Great Lakes, Plains, South, Florida, Mid-Atlantic, New England)
- `state`
- `is_active` (so locations can be hidden temporarily without deletion)

### Validation rules

| Field | Rule |
|---|---|
| `event.name` | 1–80 chars, trimmed |
| `event.description` | 1–240 chars, trimmed |
| `event.url` | optional; if present, must parse as valid URL with `http://` or `https://` |
| `event.image_url` | optional; if present, must be in our CDN domain |
| `schedule.locations` | ≥ 1; every entry must match a row in the locations table |
| `schedule.days` | ≥ 1; every entry is ISO date in the future (server-side compare against UTC today) |
| `organizer.email` | RFC 5322 minimal regex; deliverability check optional |
| `organizer.phone` | 10+ digits after stripping formatting |
| `tier` | one of two enum values |
| `total_cents` | server recomputes from `tier × locations.length × days.length`; never trusts client total |

## 6. Payment / external integrations

**Stripe Checkout** is the prototype's plan. The mock at `checkout.html` should be replaced with a real Stripe Elements card form (or a redirect to Stripe Checkout Session).

**Recommended:** Stripe Payment Intents API, with the form submitting to `/api/event-submissions` to:
1. Create the submission record with `status='pending_payment'`.
2. Return a `client_secret` for a Payment Intent of `total_cents` USD.
3. Client confirms with `stripe.confirmCardPayment(client_secret, …)`.
4. Stripe webhook (`payment_intent.succeeded`) flips submission to `pending_review` and triggers the editor-review notification.
5. On `payment_intent.payment_failed`, flip back to `pending_payment` and surface the error to the user.

**Refund flow** (out of prototype scope but specified for handoff):
- Editor rejects → server creates a refund of the full `total_cents` and sets `status='rejected'`.
- User-initiated cancel ≥ 48 hours before a day's run → full refund of that day.
- User-initiated cancel < 48 hours before a day's run → that day is locked in (non-refundable). Future days still ≥ 48 hours out remain cancellable for prorated refund.

**Email:**
- Confirmation email immediately after payment success (receipt + "we're reviewing").
- Approval email when an editor approves (with live links).
- Rejection email if rejected (with refund confirmation).

**Editor side (out of scope but flagged):**
- Editors need a queue UI to review `pending_review` submissions, approve/reject, and edit copy or image as needed before publishing.

## 7. Open questions

These are explicit holes for whoever builds the production version.

1. **Account creation.** Currently submission is fully anonymous (one-time form, contact info on the submission). Should repeat submitters get an account so they can edit existing events, view history, get bulk-submit tools? My instinct is yes for v2, no for v1.
2. **Image hosting.** Where do uploaded images live? CDN URL? Resizing? File size cap (suggest 5MB)? Format restrictions (suggest JPG, PNG, WebP)?
3. **Image moderation.** Any auto-moderation before the editor sees it, or fully manual review?
4. **Approval SLA.** Spec says 24 hours — is that a hard SLA? What if the editor is unavailable? Auto-escalation?
5. **Pricing for nonprofits.** Mentioned as a future consideration — no nonprofit discount in v1, but the data model should leave room for a `discount_code` or similar.
6. **Calendar lookahead limit.** Should submitters be able to pick dates a year out? Two years? Setting a max prevents weird far-future placements.
7. **Conflicting placements.** What if two paid submissions exist for the same location + day? Both get pinned (stacked), or first-paid wins? Suggest stacking (both featured, ordered by paid_at).
8. **Refund mechanics — confirmed.** 48-hour cancellation window per day. Each day is independently cancellable up to 48 hours before its scheduled run; refunds are prorated per cancelled day. Inside the 48-hour window for a given day, that day is non-refundable but other days (still ≥ 48 hours out) remain cancellable.
9. **Locations list source of truth.** Prototype hardcodes ~400 locations. Production should pull from an admin-managed locations table, with grouping metadata.
10. **Time zones.** Each event has a start time and a date — is the time stored in the location's local time zone (implied) or UTC? Affects "is this date in the past?" logic at midnight rollovers.
11. **Multi-day events that span midnight (e.g. an overnight festival).** Currently each "day" is a single calendar date; is that the right model, or should an event have a single date range?
12. **Newsletter slot capacity.** Each newsletter has a finite "Featured event" slot. What happens if 5 organizers pay for newsletter placement on the same day in the same location? Cap inventory? Stack? Bid-up pricing? **This is the most important business question.**
13. **Tax / invoicing.** Stripe handles US sales tax via Stripe Tax — needs to be enabled. Receipt should reflect tax line.
14. **Analytics.** What events should we track for the funnel (pitch viewed → tier picked → form started → form submitted → paid → approved)? GA4? Server-side?
15. **Accessibility audit.** Form has been built to spec on touch targets, focus states, and labels — but a full WCAG AA audit on real production code is still required.

---

## Component inventory used

All from `brain/brands/baselocal/design-system.md`. No design-system extension was needed for this build.

- Buttons (primary, secondary, sizes)
- Site Header
- Step Indicator
- Inline Alert (info variant)
- Form Section Header
- Text Input, Textarea, Select, Date / Time inputs
- Field Label, Helper Text, Error Text
- Category Pill Selector
- Location Multi-Select (search, sticky group headers, chips, "Select all in {Group}")
- Multi-Select Calendar (with Today / Tomorrow / This weekend / Next 7 days / Clear quick picks)
- Order Summary Card (sidebar desktop, sticky bottom mobile)
- Confirmation Block (with next-steps checklist)
- Site Footer

The mock browser-frame device and the annotation callouts on `index.html` are prototype illustrations specific to this page (akin to screenshots) and intentionally not added to the design system.
