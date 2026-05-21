# Post-Signup Inbox Deliverability — Implementation Spec

**Brand:** BaseLocal (Tacoma)
**Feature slug:** `post-signup-inbox`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/post-signup-inbox/](https://base-iq.github.io/previews/baselocal/prototypes/post-signup-inbox/)

---

## Goal

After someone submits their email on the Tacoma landing page (single opt-in, no double confirmation), give them a focused two-screen experience whose only job is to maximize the chance our welcome email actually reaches their Primary inbox. Currently 40%+ of leads from Meta lead-forms never see an email; this flow exists to close that gap by capturing the high-intent post-signup moment and converting it into one small, concrete deliverability action: **the user sends a one-tap "hi" to our address via their mail app.**

Why a `mailto:` send (not a vCard download): the audience skews 50+ and not technically savvy, and the strongest deliverability signal across Gmail / Apple Mail / Outlook is the user *outbound-emailing* our address. The `mailto:` pattern works universally (mobile + desktop, every mail client), needs no file handling, and the user completes the action in a familiar app with a familiar verb — "Send."

Light monetization may be folded in later. Out of scope for v1.

## User flow

1. **Landing page** — user submits email (existing flow, not built here). Form submits to backend, the welcome email is dispatched, then redirects to `index.html?email={url-encoded-email}`. **Screen 1's copy assumes the welcome has been triggered** ("We just sent your welcome email — it should land any minute") — confirm the welcome is queued *before* the redirect in production so the on-screen claim is true.
2. **Screen 1 — "From the desk"** (`index.html`) — confirms subscription via the masthead/edition framing, names the deliverability problem honestly in one sentence, and offers a single primary action.
   - Primary action: **Send us a quick hi** (button). The button is a real `<a href="mailto:tacoma@baselocal.com?subject=Hi from Tacoma&body=Hi! 👋">` anchor — clicking launches the OS-default mail app with the message pre-filled. After 400ms (enough for the mail app intent to fire), the page navigates to `confirmed.html?email={email}&contact=sent`.
   - Secondary action: **Skip — I'll do this when the email arrives** (link). Navigates to `confirmed.html?email={email}&contact=skipped`.
3. **Screen 2 — "You're set"** (`confirmed.html`) — calm terminal confirmation. Shows an inline "Hi sent — you're set" chip if `contact=sent`. Shows a single provider-specific tip ("If we end up in Promotions, drag us to Primary," etc.). No further CTAs — this is where the user closes the tab.

## Screens

### Screen 1 — `index.html`

**Structure (top-to-bottom):**

1. **Masthead** — double-rule top border, centered BaseLocal full wordmark (dark), strap line `THE TACOMA EDITION · DAILY · FREE`, single-rule bottom border. Page-specific chrome (not a reusable design-system component).
2. **Edition bar** — `Your first edition` (left) · `Tomorrow, {date} · 6 a.m.` (right). 11px Lato 700 uppercase, gray on left, dark on right, hairline bottom border.
3. **"From the desk" callout** — pattern matches **Inline Alert · info variant** from the design system (warm white card, 3px terracotta left border, 4px right radius). Contains:
   - Eyebrow label: `FROM THE DESK` (terracotta, Lato 900 11px uppercase)
   - H1: `Make sure tomorrow's edition lands.` (Bitter 700, 26px mobile / 28px desktop)
   - Body paragraph explaining the mail-app-trust mechanic + the 40% cost of skipping
   - Detected-provider chip: small pill — green dot + single text run `Tailored for {provider}` (provider name bolded). Provider names: `Gmail`, `Apple Mail`, `Outlook`, `Yahoo Mail`, `AOL Mail`, or `your mail app`.
   - Primary CTA button: `Send us a quick hi →` (terracotta, 16px Lato 700, full-width on ≤480px). Anchor `href` is a `mailto:` link.
   - Skip link: `Skip — I'll do this when the email arrives` (muted gray, underlined)
4. **Email confirmation line** — small gray text below the callout showing the subscribed email address. Reassurance that we got it right.

**States:**

| State | Trigger | Behavior |
|-------|---------|----------|
| Default | Page load with `?email=` param | Provider detected; chip + CTA rendered. All copy in voice. |
| Demo / no email param | Direct page load | Falls back to `reader@gmail.com` demo email so the URL is openable for testing. Production must always pass `?email=`. |
| Unknown provider | Domain not in mapped list (e.g., Workspace, 365, business) | Chip reads `Tailored for your mail app`; CTA copy unchanged. |
| Hover / focus on CTA | Mouse or keyboard | Deep terracotta + glow shadow; arrow nudges right. Focus ring 2px terracotta with 2px offset. |
| Pressed CTA | Tap / click | Scale 0.97 + tighter shadow (per design-system CTA Press Effect). |
| CTA tapped | User action | Browser launches the `mailto:` (OS mail app opens with pre-filled message). 400ms later, the page navigates to `confirmed.html?email={email}&contact=sent`. |
| Skip tapped | User action | Navigates to `confirmed.html?email={email}&contact=skipped`. |
| Reduced motion | OS preference | Entrance fades cancelled; content visible immediately. CTA hover/active transitions reduce to 0.01ms. |

### Screen 2 — `confirmed.html`

**Structure (top-to-bottom):**

1. **Masthead + edition bar** — identical to Screen 1, providing visual continuity.
2. **Confirmation block** — centered. Optional "Hi sent — you're set" chip (success green, ✓ glyph) shown only when `contact=sent`. H1 `That's it. You're set.` (Bitter 700, 32px mobile / 36px desktop). One-line lede: `Tomorrow's edition lands at 6 a.m. We'll keep it short, smart, and worth a few minutes of your morning.`
3. **"One more tip" block** — warm-cream card with `ONE MORE TIP — JUST IN CASE` eyebrow. Title + body change based on detected provider. This is the *backup* path — even with the `mailto:` send, a few mail apps may still file the welcome under Promotions / Spam, and this tip tells the user what to do then.

**States:**

| State | Trigger | Behavior |
|-------|---------|----------|
| Sent | `?contact=sent` | Green chip shown above the H1. |
| Skipped | `?contact=skipped` (or chip param missing) | Chip hidden via `display: none`. Everything else unchanged. |
| Provider variants | `?email=` domain | Tip title + body swap per the **Provider tip copy** table below. |
| Unknown provider | Domain not mapped | Tip is the `other` variant: "If tomorrow's email isn't there, check Spam." |

## Copy

Every visible UI string. Banned-word scrubbed against `general-writing-guide.md` (no "actually," "dive in," "navigate," "seamless," "hidden gem," "don't miss out," etc.).

### Screen 1

| Type | Text |
|------|------|
| Page title (browser tab) | `You're in · BaseLocal Tacoma` |
| Meta description | `Send us a quick hi so tomorrow's edition lands in your inbox, not Promotions.` |
| Masthead strap | `The Tacoma edition · Daily · Free` |
| Edition bar (left) | `Your first edition` |
| Edition bar (right) | `Tomorrow, {Month D} · 6 a.m.` — dynamic; for prototype, hard-coded `Tomorrow, May 22 · 6 a.m.` |
| Callout eyebrow | `From the desk` |
| H1 | `Make sure tomorrow's edition lands.` |
| Body | `Your welcome email is landing now — likely in Promotions or Spam, where mail apps file most newsletters at first. About 40% of new readers never end up seeing one of our emails. Send us a one-word hi back and your inbox will trust BaseLocal from tomorrow on.` |
| Detected chip | `Tailored for {provider}` — provider is `Gmail` / `Apple Mail` / `Outlook` / `Yahoo Mail` / `AOL Mail` / `your mail app` (bolded inline) |
| Primary CTA | `Send us a quick hi →` |
| Skip link | `Skip — I'll do this when the email arrives` |
| Email confirmation line | `{their email address}` |

### Screen 2

| Type | Text |
|------|------|
| Page title (browser tab) | `You're set · BaseLocal Tacoma` |
| Meta description | `You're subscribed to BaseLocal Tacoma. First edition lands tomorrow at 6 a.m.` |
| Sent chip (when shown) | `Hi sent — you're set` |
| H1 | `That's it. You're set.` |
| Lede | `Tomorrow's edition lands at 6 a.m. We'll keep it short, smart, and worth a few minutes of your morning.` |
| Tip eyebrow | `Your last step` |
| Tip title + body | See **Provider tip copy** below |

### Provider tip copy (Screen 2)

Anchored to the welcome email that just arrived (concrete, present-tense action) rather than hypothetical "tomorrow's email." The move-to-Primary / mark-Not-Junk / mark-Not-Spam action is itself a strong deliverability signal — compounds with the hi-back.

| Provider | Title | Body (HTML — `<strong>` marks bold) |
|----------|-------|-------------------------------------|
| Gmail | `Find the welcome — move it to Primary.` | `Open your inbox. Gmail probably filed our welcome under <strong>Promotions</strong> — move it to your <strong>Primary</strong> tab (drag on desktop, or long-press the email and tap <strong>Move to → Primary</strong> on mobile). If it's not in Promotions, check <strong>Spam</strong> and mark it <strong>Not Spam</strong>.` |
| Apple Mail | `Find the welcome — move it to your inbox.` | `Open Mail and look for our welcome. If it's not in your inbox, check the <strong>Junk</strong> folder and tap <strong>Move to Inbox</strong> — Apple Mail learns from then on.` |
| Outlook | `Find the welcome — move it to Focused.` | `Open Outlook and look for our welcome. If it's not in <strong>Focused</strong>, check the <strong>Other</strong> tab and choose <strong>Move to Focused</strong> (right-click on desktop, long-press on mobile). Still not there? Look in <strong>Junk</strong> and mark it <strong>Not Junk</strong>.` |
| Yahoo | `Find the welcome — mark it Not Spam.` | `Open Yahoo Mail and look for our welcome. If it's not in your inbox, check the <strong>Spam</strong> folder and mark it <strong>Not Spam</strong> — Yahoo will trust us from then on.` |
| AOL | `Find the welcome — mark it Not Spam.` | `Open AOL Mail and look for our welcome. If it's not in your inbox, check the <strong>Spam</strong> folder and mark it <strong>Not Spam</strong> — AOL will trust us from then on.` |
| Other / unknown | `Find the welcome — and mark us as safe.` | `Open your mail app and look for our welcome. If it's not in your inbox, check <strong>Spam</strong> or <strong>Junk</strong> and mark it as safe — your mail app will trust us from then on.` |

### Validation / error states

None in v1. There are no user inputs on either screen.

## Data requirements

| Field | Source | Required | Notes |
|-------|--------|----------|-------|
| `email` | URL query param | Yes (production) | URL-encoded; passed from the form submit handler. Demo fallback is `reader@gmail.com`. |
| `contact` | URL query param | Optional | `sent` shows the success chip on Screen 2; `skipped` (or missing) hides it. |
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

## Mailto: contract

The primary CTA opens the OS mail app via a `mailto:` link with this content pre-filled. Constants live in `flow.js` — keep both in sync.

| Field | Value |
|-------|-------|
| `to` | `tacoma@baselocal.com` *(placeholder — see Open questions)* |
| `subject` | `Hi from Tacoma` |
| `body` | `Hi! 👋` |

The user sees the pre-filled message in their mail app, taps Send, and their mail provider records an outbound email to our address. That outbound is the deliverability signal that trains Gmail / Apple Mail / Outlook to deliver future mail from BaseLocal to the Primary inbox.

**Why these defaults work:** the subject is friendly and obvious; the body is a single word + emoji so the user has nothing to think about before tapping Send. We avoid asking the user to explain anything in their reply — explanation lives on the screen, not in their outbox.

**`to` field is a placeholder** — see Open questions.

## External integrations

None for v1. Single opt-in subscription is handled by the existing landing-page form; this prototype starts after that submission. There is no payment, no third-party service. The `mailto:` is a native browser/OS hand-off — no network call from our side.

## Accessibility

- Tap targets ≥ 44×44px on mobile (primary CTA is 48px tall; skip link has a 6px vertical padding to clear the 44px floor).
- Focus-visible outline on CTA (2px terracotta, 2px offset) and skip link (2px terracotta, 2px offset).
- `aria-labelledby` ties each landmark (callout, tip) to its heading.
- `aria-live="polite"` on the detected-provider chip so screen readers announce the detection.
- Honors `prefers-reduced-motion`: entrance animations cancelled, CTA transitions reduced to 0.01ms. Content is never gated behind animation.
- Contrast — all copy meets WCAG AA on its background per the brand's contrast notes (espresso on white, body on white, terracotta on white).

## Open questions

1. **`mailto:` recipient address.** Currently `tacoma@baselocal.com` — confirm with production sender setup. **This address MUST match the `From:` address on the production welcome email.** If they don't match, the user's outbound trains their mail app on one address while the welcome email arrives from another, and the deliverability lift evaporates.
2. **Mailbox to receive the inbound hi messages.** Real users will send real "Hi! 👋" messages to this inbox. Who reads / archives / auto-acknowledges them? Options: route to a `/dev/null` autoresponder, route to a real human inbox monitored daily, or set up an auto-reply ("Got it! Tomorrow at 6 a.m. — see you then.") which doubles as another deliverability signal.
3. **The `Tomorrow, May 22 · 6 a.m.` edition-bar date** is hard-coded in the prototype. Production must compute dynamically — the next day at the local send time (newsletter ships daily). Edge cases: send-time changes; timezone for non-Tacoma readers.
4. **Workspace and 365 detection.** Domains served by Google Workspace or Microsoft 365 (custom domains, e.g. `name@startup.com`) currently fall to `other` and get the generic tip. We could MX-lookup to detect them, but that requires a server endpoint. For v1, accept the fallback; revisit if data shows a large share of business-email signups.
5. **No-mail-client desktop edge case.** A Windows machine with no default mail handler will silently no-op on the `mailto:` click. The page still advances to Screen 2 after 400ms (so the user doesn't get stuck), but no hi was sent. Probably acceptable share of users to accept; consider showing a fallback only if telemetry shows this is meaningful.
6. **Telemetry.** Should we instrument: CTA click rate, skip rate, time-on-page, the actual welcome-email open rate broken out by hi-sent vs. skipped? This is the metric that proves the flow works — recommend wiring before sending real traffic. Note that we can't directly measure whether the user pressed Send in their mail app — the inbound hi to `tacoma@baselocal.com` is the closest proxy.
7. **Monetization slot.** P2 in the brief but explicitly out of scope for v1. When folded in, the most likely placement is a quiet line above the sign-off on Screen 2 — never on Screen 1 (don't compete with the deliverability action). Specific format (partner mention, weekend-edition tease, paid-tier soft-pitch) is a separate design question.
8. **Behaviour when the user is already a subscriber.** If the form re-submits an existing email, should this flow still show, or should it short-circuit to a "you're already subscribed" variant? Currently no detection.

## Out of scope for v1

- Landing page form changes (existing form, untouched here).
- The welcome email itself — its content, subject line, and From-name are owned by the newsletter system, not this prototype.
- An auto-responder on the `tacoma@baselocal.com` mailbox (see Open question 2).
- Referral / social-share infrastructure.
- A/B test instrumentation (see Open question 6).
- Monetization placement (see Open question 7).
- "Already subscribed" detection (see Open question 8).
