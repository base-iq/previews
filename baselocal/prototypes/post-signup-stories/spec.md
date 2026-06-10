# Post-Signup Stories (Monetized) — Implementation Spec

**Brand:** BaseLocal (Tacoma)
**Feature slug:** `post-signup-stories`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/post-signup-stories/](https://base-iq.github.io/previews/baselocal/prototypes/post-signup-stories/)

---

## Goal

A monetization-focused alternative to the live `post-signup-inbox` flow. The seconds after signup are the highest-attention moment in the subscriber lifecycle, and the current flow spends all of it on deliverability. This version converts the moment into immediate revenue while introducing the new reader to the product they just joined: a ranked "most-read this week" page with 2 organic local stories, 3 of the network's highest-performing affiliate placements written as stories (same editorial-affiliate mechanic as the newsletter's "In the News" placements), and 2 display-ad slots (Ezoic). Deliverability is compressed to a single provider-tailored sentence at the top.

The page doubles as product preview: "while your welcome lands, start here" frames the stories as a sample of the daily edition, which both pulls the reader into the monetized content and validates the subscribe decision.

## User flow

1. **Landing page** — user submits email (existing flow, not built here). Form submits, welcome email is dispatched via Beehiiv, then redirects to `index.html?email={url-encoded-email}`. Screen copy assumes the welcome has been triggered ("Your welcome email is on its way") — confirm the welcome is queued before the redirect in production.
2. **Stories screen** (`index.html`) — single screen, top to bottom:
   1. **Masthead** — double-rule top border, BaseLocal full wordmark (dark), strap `THE TACOMA EDITION · DAILY · FREE`, single-rule bottom border. Page chrome shared with `post-signup-inbox`.
   2. **Inbox nudge** — Inline Alert · info variant (design system). One sentence: confirmation + provider-tailored "where your welcome is and the one move that fixes it." No numbered steps in this version.
   3. **Lede** — H1 `While your welcome lands, start here` + dek naming the five most-read stories and tomorrow's 6 a.m. edition.
   4. **Ranked list** — five stories in most-read order, each with a rank circle (Ranked Card pattern, web rendering), Bitter headline, Bitter body paragraph, terracotta read-link. Positions 1–2 organic local stories; positions 3–5 affiliate placements, each headline carrying a gray `*` mark. **Each story is whole-card clickable** (design-system whole-card pattern): an overlay link covers the row with an `aria-label` summarizing the destination; the visible read-link is a styled `<span>`. Hover/focus "pop": card lifts 2px with a terracotta-tinted shadow (`0 8px 24px rgba(194,96,74,0.14)`), the card surface detaches from the hairline rules, the rank circle fills terracotta with a white numeral, and the read-link underlines in deep terracotta. Keyboard focus shows a 2px terracotta outline; under reduced motion the lift is removed (color/shadow feedback stays).
   5. **Ad slot A** — after story 2 (between the organic and affiliate stories), placeholder for an Ezoic display unit.
   6. **Disclosure** — `* Paid advertising. We earn something when you click — it's what keeps the daily edition free.` (Disclosure Block, 12px silver.)
   7. **Ad slot B** — bottom of page, second Ezoic placeholder.
   8. **Subscribed-as line** — `Subscribed as {email}` for typo self-checking.
   9. **Sign-off** — `See you tomorrow at 6.` (Bitter italic, centered.)

There is no second screen. Story links leave the page (organic → local story page; affiliate → the placement's bridge/offer page) per production link-handling rules.

## States

| State | Trigger | Behavior |
|-------|---------|----------|
| Default | Page load with `?email=` param | Provider detected; nudge sentence tailored to that provider; subscribed-as line shows the address. |
| Demo / no email param | Direct page load | Falls back to `reader@gmail.com` so the URL is openable. Production must always pass `?email=`. |
| Unknown provider | Domain not in the mapped list | Generic nudge variant ("check Spam or Junk and mark it safe"). |
| Ads unfilled | Ezoic returns no fill | Production: collapse the slot entirely (no placeholder, no reserved gap). The dashed placeholder exists only in the prototype. |
| Reduced motion | OS preference | Entrance stagger cancelled; content visible immediately. |

No user inputs → no validation or error states.

## Copy

Every visible UI string. Banned-word scrubbed against `general-writing-guide.md`.

| Type | Text |
|------|------|
| Page title (browser tab) | `You're in · BaseLocal Tacoma` |
| Meta description | `You're subscribed. While your welcome email lands, the five stories Tacoma readers opened most this week.` |
| Masthead strap | `The Tacoma edition · Daily · Free` |
| Inbox nudge (template) | `You're in. {provider sentence}` — see Provider nudge table below |
| H1 | `While your welcome lands, start here` |
| Dek | `The five stories Tacoma readers opened most this week. Your own edition arrives tomorrow at 6 a.m.` |
| Story 1 (organic) | H: `Point Defiance's sea otter pup gets a name this week — and the public picks it` · B: `The zoo narrowed 4,000 submissions to three finalists. Voting closes Friday, and the leading name has a distinctly Tacoma backstory.` · CTA: `Read the story →` |
| Story 2 (organic) | H: `Ruston Way's newest waterfront opening took over the old boathouse` · B: `Eight years empty, now a chowder house run by a Stadium District family. We stopped by opening weekend — the line says plenty.` · CTA: `Get the full story →` |
| Story 3 (affiliate*) | H: `Most people freeze when a child starts choking` · B: `Even trained medical professionals don't always get it right. One ER nurse lost her son despite doing everything she was taught — and she wants every parent and grandparent to know what she's since found.` · CTA: `Read her story →` |
| Story 4 (affiliate*) | H: `Tacoma drivers are quietly paying half what you pay for car insurance` · B: `Same coverage, same roads. The difference is a five-minute comparison most of us keep putting off — one reader cut her premium in half last month.` · CTA: `See how it works →` |
| Story 5 (affiliate*) | H: `Your name, address, and phone number are likely on a broker site right now` · B: `Data brokers collect and sell personal details by default. Removing yourself by hand takes months — there's a faster route.` · CTA: `See what's out there →` |
| Ad slot label (prototype only) | `Advertisement` |
| Disclosure | `* Paid advertising. We earn something when you click — it's what keeps the daily edition free.` |
| Subscribed-as line | `Subscribed as {email}` |
| Sign-off | `See you tomorrow at 6.` |

Prototype story copy is sample content: organic stories are plausible-but-fictional Tacoma items; affiliate stories are adapted from the winning-copy archive (`brain/brands/baselocal/newsletters/copy-examples/we-got-your-back/` — `er-nurse-choking`, `car-insurance`, `data-brokers`). Production pulls real most-read stories and live placements.

### Provider nudge

One sentence per provider, after the bolded `You're in.`:

| Provider | Sentence |
|----------|----------|
| Gmail | `Your welcome email is on its way — look in **Promotions** or **Spam** and drag it to **Primary**. One move fixes every edition after.` |
| Apple Mail | `Your welcome email is on its way — if it isn't in your inbox, check **Junk** and choose **Move to Inbox**. One move fixes every edition after.` |
| Outlook | `Your welcome email is on its way — if it isn't in **Focused**, check **Other** or **Junk** and move it over. One move fixes every edition after.` |
| Yahoo / AOL | `Your welcome email is on its way — if it isn't in your inbox, check **Spam** and mark it **Not Spam**. One move fixes every edition after.` |
| Other / unknown | `Your welcome email is on its way — if it isn't in your inbox, check **Spam** or **Junk** and mark it safe. One move fixes every edition after.` |

## Data requirements

| Field | Source | Required | Notes |
|-------|--------|----------|-------|
| `email` | URL query param | Yes (production) | URL-encoded; passed from the form submit handler. Demo fallback `reader@gmail.com`. |
| Detected provider | Derived client-side from `email` domain | Auto | Same domain→provider contract as `post-signup-inbox` (gmail/googlemail → Gmail; icloud/me/mac → Apple; outlook/hotmail/live/msn → Outlook; yahoo/ymail/rocketmail → Yahoo; aol → AOL; else → other). Mapping lives in `flow.js`. |
| Organic stories (2) | Most-read organic items for the subscriber's location, trailing 7 days | Yes | Source: Beehiiv click data via the content pipeline (Airtable/Aurora). Needs headline, 1–2 sentence body, destination URL. |
| Affiliate stories (3) | Top-performing network placements, trailing window | Yes | Same shape as organic items + affiliate destination URL + `affiliate` flag (drives the `*` mark). Placements are network-wide (not geo-targeted), matching the newsletter convention. |
| Ranking order | Derived | Auto | Display order is 2 organic then 3 affiliate, presented as a single most-read ranking. See Open questions 2. |

## External integrations

- **Ezoic** — two display units (slot A after story 2, slot B at page bottom). Prototype renders dashed placeholders; production loads Ezoic's script and collapses unfilled slots. Confirm Ezoic placement IDs, lazy-load behavior, and CLS handling (reserve height only if Ezoic requires it).
- **Affiliate tracking** — story CTAs 3–5 route through ClickMagick (the network's click-tracking convention) to the placement's bridge/offer page.
- **Beehiiv** — welcome email dispatch happens before redirect (unchanged from `post-signup-inbox`). No inbound mail; the sending domain doesn't receive.

## Accessibility

- No form inputs. Each story's tap target is the entire card (overlay link), far exceeding the 44px minimum.
- `aria-live="polite"` on the nudge so the provider-tailored render is announced.
- Ranked list is a semantic `<ol>` with an `aria-label`; rank circles are `aria-hidden` (position is conveyed by list order).
- `prefers-reduced-motion` cancels the entrance stagger; content is never hidden behind animation.
- Contrast per design-system notes (espresso/charcoal/terracotta on white all pass AA).

## Open questions

1. **Measurement against the live flow.** This version trades deliverability emphasis for revenue. A/B it against `post-signup-inbox`: welcome-email open rate, day-7 open rate, RPS on the post-signup page (affiliate clicks + Ezoic RPM), and manual-unsubscribe rate of each cohort. Decide the winner on blended LTV, not page revenue alone.
2. **Honesty of the "most-read" ranking.** Positions 3–5 are affiliate placements presented inside a most-read ranking. Affiliate items do earn high click counts, but if a given placement wouldn't genuinely rank, the framing conflicts with the brand's honesty principle. Decide the rule: (a) rank strictly by real clicks and let positions float, or (b) keep fixed 2+3 composition but soften the dek ("the stories readers opened most" → acceptable?). Legal/compliance should also confirm the `*` + disclosure treatment meets FTC native-advertising guidance at this density.
3. **Ezoic on a first-touch page.** Display ads at the moment of highest trust may depress the welcome-open and retention metrics that fund the network. Consider launching with affiliate stories only, adding Ezoic in a second test arm.
4. **Story sourcing pipeline.** "Most-read organic stories per location, trailing 7 days" doesn't exist as an endpoint today. Define where this page reads from (Aurora? Airtable? a static daily export) and the fallback when a location has thin click data (e.g., newly launched locations — fall back to network-wide most-read).
5. **Destination of organic story links.** The newsletter links to external local sources; this page implies BaseLocal-hosted story pages. Decide: external links (cheap, leaves the page) vs. hosted story pages (more Ezoic inventory, more build).
6. **Edition timing line.** `tomorrow at 6 a.m.` is hard-coded. Production should compute from the location's send schedule (same open question as `post-signup-inbox`).
7. **Already-subscribed re-submits.** Same as the live flow: no detection. If the form re-submits an existing email, this page still renders.
8. **Welcome-email content overlap.** The welcome email also carries a deliverability callout. If this page ships, confirm the two surfaces tell one consistent story (the page's one-liner vs. the email's full callout).

## Out of scope for v1

- Real Ezoic integration (script, placement IDs, consent management) — prototype shows placeholders only.
- The story-sourcing pipeline (Open question 4) and any backend/API work.
- Real affiliate links, ClickMagick wiring, and live placement rotation.
- Landing-page form changes; the welcome email itself.
- A/B instrumentation (Open question 1).
- Pagination ("page 2 of stories") — explored in creative direction, deferred; see Open question 3's test plan before adding more inventory.
- Already-subscribed detection; provider-override UI (inherited from `post-signup-inbox`).
