# GLP-1 Weight-Loss Bridge Page — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `glp-1-weight-loss`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/glp-1-weight-loss/](https://base-iq.github.io/previews/baselocal/prototypes/glp-1-weight-loss/)

---

## 1. Goal

A single-scroll editorial bridge page that converts BaseLocal newsletter clicks (50+ women, US cities) into started intake on a GLP-1 telehealth partner. Medvi is the primary recommendation; Mochi, Remedy, Hers, and Fridays are alternates ranked in priority order. Simple App is offered as a non-medical fallback for readers who shouldn't take or don't want GLP-1.

The page only converts; the actual sale, intake, prescription, and fulfillment happen on partner sites.

## 2. User flow

Single-page scroll, two functional moments:

1. **Land** — user clicks a newsletter placement link, lands on this page. Hero loads instantly (no above-fold animation).
2. **Read → decide** — user scrolls through the editorial body, the partner recommendations, and (if applicable) the FAQ.
3. **Click out** — user clicks one of the partner CTAs and is sent to the partner's intake in a new tab. Each CTA carries a `?ref=baselocal` (or equivalent affiliate UTM — see § 6).

There are seven primary outbound clicks on the page:

| # | Where | Destination | Label | Type |
|---|---|---|---|---|
| 1 | Inline CTA mid-article | `#medvi` (anchor) | Skip ahead — see if Medvi is a fit → | Internal anchor |
| 2 | Featured pick (Medvi) | Medvi intake | See if Medvi is a fit → | Affiliate |
| 3 | Pick — Mochi | Mochi intake | See Mochi → | Affiliate |
| 4 | Pick — Remedy | Remedy intake | See Remedy → | Affiliate |
| 5 | Pick — Hers | Hers intake | See Hers → | Affiliate |
| 6 | Pick — Fridays | Fridays intake | See Fridays → | Affiliate |
| 7 | Pick — Simple (fallback) | Simple sign-up | Try Simple → | Affiliate |
| 8 | Bottom CTA primary | Medvi intake | See if Medvi is a fit → | Affiliate (duplicate of #2) |
| 9 | Bottom CTA secondary | `#medvi` (anchor) | Compare all five | Internal anchor |
| 10 | Bottom CTA alt link | Simple sign-up | Try Simple → | Affiliate (duplicate of #7) |

All affiliate links open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

## 3. States

The page has minimal state — it's a static editorial article with anchor jumps and outbound links. States to handle:

| State | Behavior |
|---|---|
| **Default** | Static page render, all sections visible at load |
| **Reduced motion** (`prefers-reduced-motion: reduce`) | Smooth-scroll on anchor jumps disabled. Button press-scale disabled. CSS transitions reduced to 0.01ms |
| **Mobile** (≤ 600px) | Single column. H1 at 28px / lede at 18px / drop cap at 48px / pull quote at 22px / pick cards at 24px 20px padding |
| **Tablet/Desktop** (≥ 600px) | H1 at 35px / lede at 19px / drop cap at 56px / pull quote at 26px / pick cards at 32px padding |
| **CTA hover** | Background → Deep Terracotta `#A84E3B` + box-shadow `0 4px 14px rgba(194, 96, 74, 0.35)` |
| **CTA active** | `transform: scale(0.97)` + box-shadow `0 2px 8px rgba(194, 96, 74, 0.25)` |
| **Anchor click** | Smooth-scroll to target (or instant if reduced motion) |

No loading, error, empty, or success states — the page does not fetch data or accept input.

## 4. Copy

Every visible UI string. Numbers in brackets indicate which section in `index.html` it appears in.

### Site header
- **Logo alt:** `BaseLocal`
- **Header meta label:** `Recommendation`

### Hero
- **Kicker:** `Weight loss · What we found`
- **H1:** `GLP-1 isn't a celebrity drug anymore. Here's what changed for women over 50.`
- **Lede:** `We've spent a few months looking at where weight-loss medication is delivering for our readers. The short version: it's working, the price has dropped to something normal, and most women starting it are over 45.`

### Article byline
- **Left (author):** `By the BaseLocal team`
- **Right (meta):** `Updated April 2026 · 5 min read`

> **Implementer note:** "Updated {Month Year}" should reflect the most recent edit. "5 min read" is approximate — recompute if the article changes substantially.

### Body — opening (drop cap on first letter)
- `A reader emailed us last fall with a very direct question: was the weight-loss medication everyone was talking about something she should bother looking into, or another thing she'd waste a year on. She was 58. She'd done Weight Watchers twice, Noom, the keto thing, and most recently a meal-kit subscription her daughter swore by. Nothing stuck.`
- `So we looked into it. What we found surprised us, and it's worth sharing — calmly, and with the parts most other places leave out.`

### Section: What GLP-1 is, in plain English
- **H2:** `What GLP-1 is, in plain English`
- **Body 1:** `GLP-1 stands for glucagon-like peptide-1 — a hormone the body already makes to help regulate appetite and blood sugar. The medication is a synthetic version, just stronger and longer-lasting.`
- **Body 2:** `What it does, practically: tells the brain you're full sooner, and keeps that signal active longer. The result is that you eat less without thinking about eating less. Readers describe the constant background noise about food as just… quieting down.`
- **Stat callout:** `Over **2 million Americans** are on a GLP-1 right now. The fastest-growing group: women aged 45 to 65.`

### Section: What changes after 50
- **H2:** `What changes after 50 — and why this finally works`
- **Body 1:** `Around perimenopause, the relationship between effort and results in weight management starts to break. A diet that worked at 35 stops working at 52. A workout routine that used to take five pounds off in a month now takes six.`
- **Body 2:** `This isn't laziness or lack of willpower. Estrogen helps regulate insulin sensitivity and fat storage; when it drops, the body holds more weight at the abdomen and resists losing it. Diet-and-exercise advice meant for someone in their 30s isn't what most women need by 50.`
- **Pull quote:** `GLP-1 doesn't burn calories or replace meals. It changes one signal — between your gut and your brain — that tends to start shouting at you somewhere around 50.`
- **Body 3:** `By turning down the appetite signal directly, GLP-1 makes a calorie deficit work in your favor without requiring discipline you've never needed before. That's the part our readers tell us is different.`

### Section: What it costs in 2026
- **H2:** `What it costs in 2026`
- **Body 1:** `Two prices to know.`
- **Body 2:** `Brand-name versions (Wegovy and Ozempic) are still expensive without insurance — $1,000 to $1,400 per month. Insurance coverage for weight loss is improving but inconsistent.`
- **Body 3:** `Compounded GLP-1 — same active ingredient (semaglutide or tirzepatide), made by licensed pharmacies — is what's changed the math. Through the telehealth services we cover, the all-in cost lands between $149 and $249 per month.`
- **Stat callout:** `Brand-name (Wegovy/Ozempic) without insurance: **$1,000–$1,400/mo**. Compounded GLP-1 through telehealth: **$149–$249/mo**, all-in.`

### Section: How to get it
- **H2:** `How to get it without going through your PCP`
- **Body 1:** `This is the part most readers don't know about. A handful of telehealth services have built end-to-end programs around GLP-1 — they handle the doctor consultation, the prescription, the pharmacy fulfillment, and ongoing monitoring.`
- **Body 2:** `You fill out an intake (medical history, current medications, weight goals), a licensed prescriber reviews it, and if you're a candidate, the medication ships to your door. No referrals. No PCP appointments. No insurance paperwork.`
- **Body 3:** `We spent the last few months looking at five of these services. Here's where we'd start.`
- **Inline CTA:** `Already sure you want to start? Skip ahead — see if Medvi is a fit →`

### Featured pick — Medvi
- **Section H2:** `Where we'd start: Medvi`
- **Pick rank:** `Our top pick`
- **Brand name:** `Medvi`
- **Tagline:** `Built for first-timers, with weekly check-ins through month three`
- **Pick badge:** `Best fit for most readers`
- **Price:** `From $179/month`
- **Price detail:** `Includes **medication, doctor consultation, and shipping**. No insurance required.`
- **Features:**
  1. `Licensed prescriber reviews your intake`
  2. `Compounded semaglutide or tirzepatide, your choice`
  3. `Weekly check-ins for the first 90 days`
  4. `Cancel anytime, no commitment`
- **Social proof:** `**60,000+ patients** started with Medvi in 2025.`
- **Best for:** `Best for first-time GLP-1 users who want hand-holding through the early weeks.`
- **CTA:** `See if Medvi is a fit →`

### Other options — section
- **H2:** `Other options worth knowing about`
- **Subhead:** `Different starting points. The four below earned a spot for specific reasons.`

### Pick — Mochi Health
- **Pick rank:** `Runner-up`
- **Tagline:** `More clinical onboarding, same compounded options`
- **Price:** `From $199/month`
- **Price detail:** `Includes **medication, doctor visit, and shipping**.`
- **Features:** `Licensed prescriber reviews intake` · `Compounded semaglutide and tirzepatide` · `Detailed health questionnaire (more thorough than most)` · `Optional dietitian add-on`
- **Best for:** `Best if you'd rather a more medical-feeling intake.`
- **CTA:** `See Mochi →`

### Pick — Remedy Meds
- **Pick rank:** `Best price`
- **Tagline:** `Lowest all-in cost we've seen`
- **Offer badge:** `$149/mo`
- **Price:** `From $149/month`
- **Price detail:** `Same active ingredient. Lighter support during the first weeks.`
- **Features:** `Licensed prescriber reviews intake` · `Compounded semaglutide` · `Monthly shipments` · `Self-service support model`
- **Best for:** `Best if price matters more than hand-holding.`
- **CTA:** `See Remedy →`

### Pick — Hers
- **Pick rank:** `Strongest brand`
- **Tagline:** `The platform you've probably already heard of`
- **Price:** `From $249/month`
- **Price detail:** `Includes **medication, doctor visit, and shipping**. Other women's health services available on the same account.`
- **Features:** `Licensed prescriber reviews intake` · `Compounded semaglutide and tirzepatide` · `Mental health, dermatology, hair on one account` · `Mobile app with progress tracking`
- **Best for:** `Best if you'd rather a familiar brand or a one-stop platform.`
- **CTA:** `See Hers →`

### Pick — Fridays
- **Pick rank:** `Newest experience`
- **Tagline:** `Sleekest UX of the five — and the least track record`
- **Price:** `From $189/month`
- **Price detail:** `Same active ingredient, same prescription model — just a newer company.`
- **Features:** `Licensed prescriber reviews intake` · `Compounded semaglutide` · `Polished mobile experience` · `Less long-term data than the others`
- **Best for:** `Best if you want the most modern interface and don't mind a younger company.`
- **CTA:** `See Fridays →`

### Section: If GLP-1 isn't right for you
- **H2:** `If GLP-1 isn't right for you`
- **Body 1:** `Some readers shouldn't take GLP-1 — pregnancy, breastfeeding, history of medullary thyroid carcinoma, certain pancreatic conditions. The intake on any of the services above will catch this and won't prescribe.`
- **Body 2:** `If GLP-1 isn't a fit and you still want a place to start, we'd point you to Simple. It's not medication — it's a habit-tracking and intermittent-fasting app — but it's the most thoughtful non-medical option we've seen for women starting in their 50s and 60s.`

### Pick — Simple
- **Pick rank:** `Non-medical alternative`
- **Brand name:** `Simple`
- **Tagline:** `Habit-tracking and intermittent fasting`
- **Price:** `From $14.99/month`
- **Price detail:** `Free 7-day trial. No medication, no doctor visits.`
- **Features:** `Built around intermittent fasting (no calorie counting)` · `AI-driven plan personalization` · `14-day plans you can stick with` · `Hydration, sleep, and meal logging in one app`
- **Best for:** `Best for readers who can't or don't want to use GLP-1.`
- **CTA:** `Try Simple →`

### Common questions
- **H2:** `Common questions`
- **Q1 H3:** `Is it safe at my age?`
  - `GLP-1 medications have been prescribed for diabetes since 2005 — over 20 years of safety data, much of it in patients over 50. The weight-loss application is newer (2021), but the underlying drug isn't. The telehealth services we cover all include a licensed prescriber and ongoing monitoring.`
- **Q2 H3:** `What are the side effects, honestly?`
  - `The most common are nausea and constipation in the first few weeks as the body adjusts. They tend to fade by week 4 to 6. Roughly 5% of patients stop because side effects don't improve. The check-in cadence at services like Medvi is built around catching this early.`
- **Q3 H3:** `Do I have to inject myself?`
  - `Yes, but it's a small pen with a tiny needle — most people describe it as easier than an insulin pen. Once-weekly injection. The first few are nerve-wracking; then it becomes routine.`
- **Q4 H3:** `What happens if I stop taking it?`
  - `Weight tends to return. GLP-1 isn't a cure — it's a tool that works while you're using it. Most people who keep weight off after stopping have built lasting habit changes during the time on the medication. Some readers stay on a maintenance dose long-term.`

### Bottom CTA
- **H2:** `Where would you like to start?`
- **Subtitle:** `We'd recommend Medvi for most readers. The four others fit specific situations.`
- **Primary button:** `See if Medvi is a fit →`
- **Secondary button:** `Compare all five`
- **Alt link:** `Want the non-medical alternative? Try Simple →`

### Disclosure
- **Para 1:** `BaseLocal may earn a commission when you sign up through links on this page. Our editorial picks are independent — partners do not pay for placement, and commissions never determine which products we recommend.`
- **Para 2:** `Compounded GLP-1 medications are made by state-licensed pharmacies and are not FDA-approved as new drugs. They use the same active ingredient — semaglutide or tirzepatide — as the approved branded versions. A licensed prescriber will determine whether the medication is appropriate for you based on your medical history.`
- **Para 3:** `Individual results vary. Nothing on this page is medical advice. If you have questions about whether GLP-1 is right for you, talk to a licensed prescriber.`

## 5. Data requirements

The page is static — no data fetched, no data submitted. All copy is hardcoded; all CTAs are static affiliate links.

The only "data" the page reads is in the URL (an optional UTM trail from the newsletter), which is not used by the page itself but should pass through to partner CTAs (see § 6).

## 6. External integrations

### Affiliate link contract

Each partner has a placeholder URL with `?ref=baselocal`. Production links must replace these with the real affiliate URLs (per partner contract — likely Impact Radius, ShareASale, or a direct partnership UTM).

| Partner | Placeholder | Replace with |
|---|---|---|
| Medvi | `https://medvi.com/?ref=baselocal` | TBD — request from partner |
| Mochi | `https://joinmochi.com/?ref=baselocal` | TBD — request from partner |
| Remedy | `https://remedymeds.com/?ref=baselocal` | TBD — request from partner |
| Hers | `https://forhers.com/?ref=baselocal` | TBD — request from partner |
| Fridays | `https://fridays.com/?ref=baselocal` | TBD — request from partner |
| Simple | `https://simple.life/?ref=baselocal` | TBD — request from partner |

### UTM passthrough

Newsletter placements should drive traffic with a UTM trail like `?utm_source=baselocal&utm_medium=newsletter&utm_campaign=glp1_bridge_2026q2`. Production should append the inbound `utm_*` parameters to outbound affiliate URLs so attribution flows end-to-end. This is **not** in the prototype.

### Tracking

Page-level events to instrument (production scope, not prototype):
- Page view
- Scroll depth (25 / 50 / 75 / 100%)
- Click on each outbound CTA — labeled by partner + placement (`featured-medvi`, `pick-mochi`, `inline-cta`, `bottom-cta-primary`, etc.)
- Anchor jumps (`#medvi` from inline CTA and from `Compare all five` button)

## 7. Open questions

- **Affiliate URLs:** Real partner affiliate links are placeholders. Need confirmed URLs from each partner before launch.
- **Pricing accuracy:** All prices in the prototype are representative ranges based on public data as of April 2026. Each partner needs to confirm their own price (and any current promotional offer) before launch — these are the most likely things to drift.
- **Social proof numbers:** "60,000+ patients started with Medvi in 2025" is a placeholder. Replace with a partner-confirmed figure or remove the social proof line if no figure is approved.
- **Featured-pick badge text:** "Best fit for most readers" was chosen for the Medvi badge. Alternatives: "Editor's pick" / "Where we'd start" / "Top pick." Confirm before launch.
- **Author byline:** Currently "By the BaseLocal team." If we want a named author for editorial credibility ("By Corry Belitsky"), swap before launch.
- **Updated date:** "Updated April 2026" is hardcoded. If the page goes live in a different month, update.
- **Compliance review:** Any GLP-1 mention needs legal/compliance sign-off, especially the safety claims, side-effect numbers (5%), and the 2-million-Americans stat. The disclosure block has a draft compounding disclaimer — confirm wording is sufficient.
- **Newsletter placement copy:** Out of scope here, but the placement that drives traffic should reference back to this page's hero framing for landing-page consistency. Likely lives with PlacementCopywriter.
- **A/B test scope:** No variants in this prototype. Likely candidates if testing later: which partner is featured (Medvi vs. Mochi), pull-quote vs. no pull-quote, FAQ above vs. below the picks, drop-cap vs. no drop-cap.
- **Logo color in header:** Currently terracotta. The brand guide allows dark on light backgrounds where terracotta might clash with nearby content. Confirm this is the right call given the kicker is also terracotta and might compete.
- **Mobile-only sticky CTA:** Not implemented. Common pattern for bridge pages — pin "See if Medvi is a fit" to the bottom of the viewport on mobile after the user scrolls past the featured pick. Worth considering before launch if mobile conversion underperforms.

---

**Out of scope for this spec:** the production newsletter placement copy, the partner-side intake flows, the affiliate tracking pipeline implementation, and any A/B testing infrastructure.
