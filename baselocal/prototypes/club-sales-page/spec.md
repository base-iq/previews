# BaseLocal Club — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `club-sales-page`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/club-sales-page/](https://base-iq.github.io/previews/baselocal/prototypes/club-sales-page/)

---

## Goal

A single-page sales surface for **BaseLocal Club** — the $7/month paid membership that strips ads from a reader's daily newsletter and adds two member-only weekly digests (Monday events, Thursday news). The page sells *less inbox + curation + community*, not "premium features." Target reader is the engaged 50+ subscriber who's been opening the daily for months or years, trusts the BaseLocal voice, and wants a quieter version of the relationship.

The page's argument is matter-of-fact, not promotional: it acknowledges that ads pay for the free product, names the readers who'd want the paid alternative, and lets the side-by-side mocks and the FAQ do the persuading.

## User flow

Long-scroll single page. Three CTAs at strategic moments — sticky nav, hero, pricing card, final block. All CTAs link to the same join destination (`#join` anchor in-prototype; real checkout out of scope).

1. **Nav bar (sticky).** BaseLocal wordmark + `Join the Club` button anchored to the pricing card. Stays visible through scroll.
2. **Hero.** Headline, lede with price, primary CTA, side-by-side mock of a free daily (with ads flagged) vs. the Club version (same content, ads removed, "We got your back" + sponsor sections removed).
3. **How BaseLocal works.** Plain-language explanation that ads fund the free product. Sets up Club as the alternative, not as a fix for a broken model.
4. **What you get.** Two-column section on desktop, stacked on mobile. Left: three pillars (no ads / two weekly emails / control). Right: two stacked mini-newsletter mocks showing the Monday events and Thursday news roundups — both modeled on the 7xv1 visual language.
5. **And this is just the start.** Espresso-background callout framing Club as a community with future perks. Wording stays vague ("members will be first," "in the works") to avoid promising specifics.
6. **Who it's for.** Three single-line self-identification statements with a terracotta left rule.
7. **Pricing card.** $7/month, cancel anytime, four-line recap of pillars, primary CTA, trust line below.
8. **FAQ.** Four common 50+ questions as `<details>` accordions: current newsletter, daily vs weekly, cancel, auto-renew.
9. **Final CTA.** Terracotta block, big white CTA, reply-to-any-email reassurance.
10. **Footer.** Espresso-on-cream, white wordmark, copyright.

## Screens & states

Single page. No sub-routes in this prototype.

- **Default state.** As described above.
- **Sticky nav.** Stays pinned to top through scroll. Background remains white; box-shadow not used.
- **FAQ accordions.** Closed by default; tapping a summary expands. `+` glyph rotates to `−` on open.
- **Hover/focus states.** Primary CTAs use the design-system pattern: hover = Deep Terracotta (`#A84E3B`); focus-visible = 3px Espresso outline at 3px offset. Accordion summaries become pointer cursor.
- **Reduced motion.** `prefers-reduced-motion: reduce` forces all transitions to 0ms.
- **Responsive breakpoints.** Mobile-first. Layout shifts at 760px — side-by-side mocks stack, pillars + emails-column stack.

No empty, loading, or error states — this is a static marketing page.

## Copy

Every string used on the prototype. Production may A/B-test individual lines but the register and length should match.

### Nav
- Wordmark: `BaseLocal` (logo, espresso variant)
- Nav CTA: `Join the Club`

### Hero
- Kicker: `Introducing BaseLocal Club`
- Headline: `Your local newsletter. Without the ads. On your schedule.` (the third clause is terracotta)
- Lede: `A calmer, cleaner way to stay connected to your town. $7 a month.`
- CTA: `Join BaseLocal Club`
- Price note: `Cancel in one click. No phone calls.`
- Mock labels: `Free · Your daily today` / `Club · Same day, no ads`
- Removed-section labels in Club mock: `"We got your back" — removed` and `Sponsor placements — removed`

### How BaseLocal works
- Kicker: `How BaseLocal works`
- H2: `Ads keep BaseLocal free for everyone.`
- Body (two paragraphs):
  - `Every day, more than a million readers across 400+ towns open a BaseLocal newsletter. That's possible because advertisers pay for it — and we're proud of that. Ads are what lets us put local news and events in your inbox, free, every day.`
  - `But we hear you. Some readers want fewer emails. Some don't want ads. Some just want the highlights.`
- Lead-in: `**That's why we built BaseLocal Club.**`

### What you get
- H2: `What you get.`
- Pillar 1: `No ads. Not one.` — `Every email is completely ad-free. No promotions, no sponsored sections, no "this is brought to you by." Just your local content.`
- Pillar 2: `The week in two emails.` — `Monday: the best events of the week, in one place. Thursday: the news that mattered, distilled into one read. Member-only.`
- Pillar 3: `You choose what lands in your inbox.` — `Daily emails? Keep them. Just the weekly roundups? Done. Only events, not news? Easy. Full control over frequency and content.`
- Emails column kicker: `Member-only roundups`
- Emails column caption: `Two new emails a week, built for the Club.`
- Tags: `Monday · Events` (terracotta), `Thursday · News` (espresso)
- Email mocks use real placeholder content modeled on the 7xv1 format. Final production should replace with the actual Club newsletter HTML.

### And this is just the start
- Kicker: `And this is just the start`
- H2: `BaseLocal Club is a community in the making.`
- Body:
  - `As it grows, members will be first to know — and first in line — for new perks, member-only experiences, and ways to connect with neighbors in your town.`
  - `We have a lot in the works.`

### Who it's for
- H2: `Built for readers who want it a little different.`
- Line 1: `You love your local newsletter, but your inbox is full.`
- Line 2: `You'd rather pay than scroll past ads.`
- Line 3: `You want to stay connected — on your own terms.`

### Pricing card
- Price: `$7` (Bitter 56px) + `/month`
- Cancel line: `Cancel anytime.`
- Checklist (terracotta checkmarks):
  - `Every email, completely ad-free.`
  - `Two member-only roundups each week.`
  - `Full control over frequency and content.`
  - `First in line for what's coming next.`
- CTA: `Join BaseLocal Club`
- Trust line: `No commitment. Cancel in one click.`

### FAQ
- H2: `A few things you'll probably ask.`
- Q1: `What happens to my current newsletter?` — `Nothing changes about the content you already read — same writing, same recommendations. Club just removes the ads and adds the two weekly roundups.`
- Q2: `Can I still get my daily?` — `Yes. Keep the daily as-is, or switch to weekly only. You can change your mind any time.`
- Q3: `How do I cancel?` — `One click in your account. No phone calls, no forms, no "are you sure?" loops.`
- Q4: `Is this auto-renewing?` — `Yes, monthly. We'll email you a few days before each renewal. Cancel before your next charge and you won't be billed again.`

### Final CTA
- H2: `Try BaseLocal Club. Cancel anytime.`
- Body: `$7 a month. One click in or out.`
- CTA: `Join BaseLocal Club`
- Reply line: `Questions? Reply to any BaseLocal email and a real person will answer.`

### Footer
- Wordmark: white variant
- Tagline: `© BaseLocal · A calmer way to know your town.`

## Data requirements

This prototype is static — no data is read or written. Production page will need:

- **Checkout integration.** All four `Join BaseLocal Club` CTAs need to route to the real checkout flow (Stripe / payment provider TBD).
- **Account-aware nav.** Logged-in subscribers should see a different state (e.g. "Manage subscription" instead of "Join the Club"). Out of scope here.
- **City personalization.** Headline, mocks, and city references currently use Glendale/Tacoma as placeholder. In production the page should adapt to the visitor's known city when available, with a generic fallback.
- **Pricing.** $7/month is the only plan shown. If an annual plan is offered, it should be added per the brief's note ("$70/year saves $14"). It is intentionally **not** in the prototype since the outline said don't show it unless built.

## Payment / external integrations

Out of scope for this prototype. Notes for the implementer:

- **Stripe (or equivalent)** for the $7/mo subscription. Monthly auto-renew, one-click cancel from a managed customer portal.
- **Pre-renewal email.** A reminder email a few days before each charge is part of the FAQ's promise — implementer should confirm this is hooked up in the billing system, not assume the platform does it by default.
- **Beehiiv / email platform.** Club membership must flag the subscriber in Beehiiv so they receive the ad-free daily variants and the new Monday/Thursday segments. This is the central engineering dependency.

## Open questions

1. **Annual plan.** Will the launch include `$70/year` as a second option? If yes, add the toggle to the pricing card.
2. **Headline city personalization.** Should the headline include the reader's city, or stay generic? "Without the ads" vs "Without the ads, Glendale."
3. **Ad-free daily — implementation.** Does the Beehiiv pipeline already support a Club variant of each daily, or does that need to be built as a separate Airtable → Beehiiv flow? This is the biggest unknown.
4. **Monday events / Thursday news — content source.** Are these auto-generated from the same Airtable that powers the daily, or curated separately? The brief implies a "best of the week" curation — needs editorial process defined.
5. **Cancel flow.** "One click" is a real promise. Confirm the chosen billing provider supports it without a "Are you sure?" loop. If not, the FAQ copy needs to soften.
6. **Reply-handling.** "Reply to any BaseLocal email and a real person will answer" — who staffs that? Volume implications at scale need owner.
7. **Logged-in state.** What does this page show to an existing Club member? Redirect to a manage-subscription view, or render a different hero?
8. **Account creation.** Does joining the Club require an account first, or does payment create one? Affects checkout flow.
9. **Mocks → real previews.** The Monday/Thursday email mocks on this page are stylized for the sales page. Production should consider whether real recent issue HTML is embedded instead (more trust, more maintenance).
10. **Trust signals.** No testimonials, member count, or social proof on the page today. Worth testing once any of those exist.
