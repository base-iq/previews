# Post-Signup Inbox Deliverability — Implementation Spec

**Brand:** BaseLocal (Tacoma)
**Feature slug:** `post-signup-inbox`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/post-signup-inbox/](https://base-iq.github.io/previews/baselocal/prototypes/post-signup-inbox/)

---

## Goal

After someone submits their email on the Tacoma landing page (single opt-in, no double confirmation), give them a single-screen experience whose only job is maximizing the chance our welcome email — and every edition after it — reaches their Primary inbox. Currently 40%+ of leads from Meta lead-forms never see an email; this flow exists to close that gap by capturing the high-intent post-signup moment and converting it into one concrete deliverability action: **find the welcome we just sent and move it from Promotions/Spam to your inbox.**

Why find-and-move (not "reply to us"): BaseLocal sends via a Beehiiv sending-domain that does *not* accept inbound mail, so the user can't reply to our welcome or send us a hi. An earlier iteration of this flow used a `mailto:` action — that was dropped when the Beehiiv constraint was confirmed. The find-and-move action is a valid deliverability signal that needs no receiving inbox on our side: a user manually moving a sender out of Promotions/Spam trains their mail provider to trust that sender for every subsequent email.

Light monetization may be folded in later. Out of scope for v1.

## User flow

1. **Landing page** — user submits email (existing flow, not built here). Form submits to backend, the welcome email is dispatched via Beehiiv, then redirects to `index.html?email={url-encoded-email}`. **Screen 1's copy assumes the welcome has been triggered** ("Your welcome email is landing now") — confirm the welcome is queued *before* the redirect in production so the on-screen claim is true.
2. **Screen 1** (`index.html`) — single screen. Confirms subscription via the masthead/edition framing, names the deliverability problem honestly, and walks the user through provider-tailored numbered steps to find the welcome and move it to their inbox.

There is no Screen 2. The action happens in the user's email app; we don't try to confirm completion back on our page.

## Screen — `index.html`

**Structure (top-to-bottom):**

1. **Masthead** — double-rule top border, centered BaseLocal full wordmark (dark), strap line `THE TACOMA EDITION · DAILY · FREE`, single-rule bottom border. Page-specific chrome (not a reusable design-system component).
2. **Edition bar** — `Your first edition` (left) · `Tomorrow, {date} · 6 a.m.` (right). 11px Lato 700 uppercase, gray on left, dark on right, hairline bottom border.
3. **Main callout** — pattern matches **Inline Alert · info variant** from the design system (warm white card, 3px terracotta left border, 4px right radius). Contains:
   - H1: `Find your welcome. Move it to your inbox.` (Bitter 700, 26px mobile / 28px desktop)
   - Body paragraph explaining the action + the 40% cost of skipping
   - Detected-provider chip: small pill — green dot + single text run `Tailored for {provider}` (provider name bolded). Provider names: `Gmail`, `Apple Mail`, `Outlook`, `Yahoo Mail`, `AOL Mail`, or `your mail app`.
   - Provider-tailored numbered steps: three steps per provider, terracotta numbered circles, hairline dividers between steps. See **Provider steps** table below.
   - Tail note: dashed-rule-separated paragraph below the steps at **body size** (Lato 400 16px charcoal — same scale as the main body copy, not footnote-small). Reassures that the first daily edition lands tomorrow at 6 a.m., and tells the user what to do if they can't find the welcome today (run through the same steps again after 7 a.m. with the first edition — same effect).
   - Troubleshoot note: a second body-size paragraph immediately below the tail note (no separating rule between the two — they read as a paired set, not two sections). Surfaces the two most common reasons someone never sees the welcome at all: a typo in the email address, or an inbox that's at quota. Points the user to the "Subscribed as" reference line below.
4. **"Subscribed as" reference line** — centered below the callout. `Subscribed as` in gray (Lato 400 15px) followed by the email address in dark bold (Lato 700 16px). Visible reference so the user can verify they typed the right address (per the troubleshoot note above).

**States:**

| State | Trigger | Behavior |
|-------|---------|----------|
| Default | Page load with `?email=` param | Provider detected; chip + steps rendered for that provider. All copy in voice. |
| Demo / no email param | Direct page load | Falls back to `reader@gmail.com` demo email so the URL is openable for testing. Production must always pass `?email=`. |
| Unknown provider | Domain not in mapped list (e.g., Workspace, 365, business) | Chip reads `Tailored for your mail app`; steps are the generic "other" variant. |
| Reduced motion | OS preference | Entrance fades cancelled; content visible immediately. |

## Copy

Every visible UI string. Banned-word scrubbed against `general-writing-guide.md` (no "actually," "dive in," "navigate," "seamless," "hidden gem," "don't miss out," etc.).

| Type | Text |
|------|------|
| Page title (browser tab) | `You're in · BaseLocal Tacoma` |
| Meta description | `Find your welcome email and move it to your inbox — so tomorrow's edition lands in your inbox too.` |
| Masthead strap | `The Tacoma edition · Daily · Free` |
| Edition bar (left) | `Your first edition` |
| Edition bar (right) | `Tomorrow, {Month D} · 6 a.m.` — dynamic; for prototype, hard-coded `Tomorrow, May 22 · 6 a.m.` |
| H1 | `Find your welcome. Move it to your inbox.` |
| Body | `Your welcome email is on its way — give it a couple of minutes, then check Promotions or Spam, where mail apps file new newsletters at first. Move it to your inbox once and BaseLocal will land in your inbox from then on. Otherwise about 40% of new readers never see one of our emails.` |
| Detected chip | `Tailored for {provider}` — provider is `Gmail` / `Apple Mail` / `Outlook` / `Yahoo Mail` / `AOL Mail` / `your mail app` (bolded inline) |
| Steps | See **Provider steps** below |
| Tail note | `Your first daily edition lands tomorrow at <strong>6 a.m.</strong> If you can't find the welcome today, run through these steps again after <strong>7 a.m.</strong> — moving the first edition works just as well.` |
| Troubleshoot note | `Still don't see it? Double-check the email below for typos, and that your inbox isn't full.` |
| Email confirmation line | `Subscribed as {their email address}` — "Subscribed as" in gray, address in dark bold |

### Provider steps

Three numbered steps per provider. Consistent shape: open → find/move → fallback. `<strong>` marks bold inline.

| Provider | Step 1 | Step 2 | Step 3 |
|----------|--------|--------|--------|
| Gmail | `Open Gmail and check your <strong>Promotions</strong> tab.` | `Find the welcome from BaseLocal and move it to <strong>Primary</strong> — drag on desktop, or long-press the email and tap <strong>Move to → Primary</strong> on mobile.` | `Not in Promotions? Look in <strong>Spam</strong> and mark it <strong>Not Spam</strong>.` |
| Apple Mail | `Open Mail and check your inbox.` | `If the welcome isn't there, check the <strong>Junk</strong> folder.` | `Tap the welcome and choose <strong>Move to Inbox</strong>.` |
| Outlook | `Open Outlook and check <strong>Focused</strong>.` | `If the welcome isn't there, check the <strong>Other</strong> tab. Right-click on desktop, or long-press on mobile, then choose <strong>Move to Focused</strong>.` | `Still not there? Look in <strong>Junk</strong> and mark it <strong>Not Junk</strong>.` |
| Yahoo | `Open Yahoo Mail and check your inbox.` | `If the welcome isn't there, open the <strong>Spam</strong> folder.` | `Find the welcome and mark it <strong>Not Spam</strong>.` |
| AOL | `Open AOL Mail and check your inbox.` | `If the welcome isn't there, open the <strong>Spam</strong> folder.` | `Find the welcome and mark it <strong>Not Spam</strong>.` |
| Other / unknown | `Open your mail app and check your inbox.` | `If the welcome isn't there, check <strong>Spam</strong> or <strong>Junk</strong>.` | `Find the welcome and mark it as <strong>safe</strong> (sometimes called "Not Spam" or "Move to Inbox").` |

### Validation / error states

None. There are no user inputs.

## Data requirements

| Field | Source | Required | Notes |
|-------|--------|----------|-------|
| `email` | URL query param | Yes (production) | URL-encoded; passed from the form submit handler. Demo fallback is `reader@gmail.com`. |
| Detected provider | Derived client-side from `email` domain | Auto | Maps known consumer domains to provider keys; everything else → `other`. Mapping lives in `flow.js`. |

**Provider mapping (the contract):**

| Domain(s) | Provider key | Chip label |
|-----------|--------------|------------|
| `gmail.com`, `googlemail.com` | `gmail` | Gmail |
| `icloud.com`, `me.com`, `mac.com` | `apple` | Apple Mail |
| `outlook.com`, `hotmail.com`, `live.com`, `msn.com` | `outlook` | Outlook |
| `yahoo.com`, `ymail.com`, `rocketmail.com` | `yahoo` | Yahoo Mail |
| `aol.com` | `aol` | AOL Mail |
| Everything else | `other` | your mail app |

## External integrations

None for v1. Single opt-in subscription is handled by the existing landing-page form; this prototype starts after that submission. There is no payment, no third-party service, no email sent or received from this page. The deliverability action happens entirely inside the user's existing mail app.

## Accessibility

- Tap targets — there are no interactive elements on this screen (no buttons, no form). Instructions are read-only text.
- `aria-labelledby` ties the callout landmark to its H1.
- `aria-live="polite"` on the detected-provider chip so screen readers announce the detection.
- Honors `prefers-reduced-motion`: entrance animations cancelled, content visible immediately.
- Contrast — all copy meets WCAG AA on its background per the brand's contrast notes (espresso on white, body on white, terracotta circle on white).

## Open questions

1. **Beehiiv `From:` address on the welcome.** The welcome email's `From` name and address determine what the user looks for in their mail app. Whatever the production `From` is, the body copy and step 2 should refer to it consistently — e.g. if the From-name is "BaseLocal Tacoma," the step copy reading "the welcome from BaseLocal" still works; if it's something else, audit.
2. **Dynamic edition date + send time.** `Tomorrow, May 22 · 6 a.m.` is hard-coded in the prototype, and the tail note's "after 7 a.m." fallback is hard-coded too. Production must compute dynamically: edition date is the next calendar day at the local send time; the "after" time in the tail note is "send time + 1 hour" (so it stays sensible if the send time ever changes). Edge cases: send-time changes; timezone for non-Tacoma readers.
3. **Workspace and 365 detection.** Domains served by Google Workspace or Microsoft 365 (custom domains, e.g. `name@startup.com`) currently fall to `other` and get the generic steps. We could MX-lookup to detect them, but that requires a server endpoint. For v1, accept the fallback; revisit if data shows a large share of business-email signups.
4. **Telemetry.** Should we instrument: time-on-page, scroll depth, the actual welcome-email open rate? The metric that proves this works is the welcome-open rate from this flow vs. baseline (no post-signup screen). The on-page user behavior is hard to instrument because the deliverability action happens in their email app, not on our site.
5. **Monetization slot.** P2 in the brief but explicitly out of scope for v1. When folded in, the most likely placement is a quiet line below the steps (or as a small line above the email confirmation line). Specific format (partner mention, weekend-edition tease, paid-tier soft-pitch) is a separate design question.
6. **Behaviour when the user is already a subscriber.** If the form re-submits an existing email, should this flow still show, or should it short-circuit to a "you're already subscribed" variant? Currently no detection.
7. **Provider override.** If auto-detection is wrong (e.g., a user has a custom domain that's actually on Gmail Workspace), the user has no way to switch the steps to their actual provider. A small "Different mail app? See steps for Gmail / Apple Mail / Outlook / Yahoo / Other" link could fix this in v2.
8. **Reply-to inbox option.** If a real receiving inbox (e.g. `hello@baselocal.com`) is set up later and Beehiiv's Reply-To is pointed at it, the original `mailto:` "send us a hi" variant could be A/B tested against this find-and-move design. Different deliverability signal, different action; would be a worthwhile experiment.

## Out of scope for v1

- Landing page form changes (existing form, untouched here).
- The welcome email itself — its content, subject line, and From-name are owned by Beehiiv and the newsletter system, not this prototype.
- A real receiving inbox + Beehiiv Reply-To configuration (see Open question 8).
- Referral / social-share infrastructure.
- A/B test instrumentation (see Open question 4).
- Monetization placement (see Open question 5).
- "Already subscribed" detection (see Open question 6).
- Provider override UI (see Open question 7).
