# Data Removal Services — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `data-removal-services`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/data-removal-services/](https://base-iq.github.io/previews/baselocal/prototypes/data-removal-services/)

---

## Goal

An education-first bridge page for BaseLocal's newsletter. It explains what the data-broker industry is and why it matters to the reader (using public fraud and industry statistics), shows how a reader can push back, and only then recommends three data-removal services, with Incogni as the pick. Traffic arrives from a placement whose CTA is "compare data deletion services," sent across 410+ local editions to an audience that skews 50+ and 73% female, privacy-concerned but not technical. The reader lands to *understand the problem first*, so no product is named until the recommendation cards. There is **no side-by-side comparison table** (deliberately cut as too much information for a first touch); the stacked Offer Cards carry the options. No checkout, account creation, or data collection on-page — every CTA links out to the partner.

> Note: the page no longer follows the GLP-1 "comparison table" structure. It leads with data and education, then options.

## User flow

Single page, top to bottom:

1. **Header (nav)** — BaseLocal wordmark (links to baselocal.us), the date `Updated June 2026` centered, and the `Recommendation` eyebrow on the right (three items, space-between). On screens ≤600px all three shrink slightly to stay on one row.
2. **Hero** — kicker, H1, then directly the **2-sentence lead-in (15px, one step below body)** that hands off into the visualization. The date is **not** here (it lives in the nav), so the H1 flows straight into the lead-in. **No header image** (deliberately data-led: the Stat Hero is the header's visual).
3. **Stat Hero** (§3.25) — directly below the lead-in: the big `$7.7B` figure + sparkline (FBI IC3 elder-fraud losses, 2020 to 2025); the lead-in's "nearly 700% increase since 2020" sets it up. A **Front-Matter Divider** (§3.21, a short centered 64px rule) then closes the front-matter block (kicker, H1, dateline, lead-in, chart) before the article body begins.
4. **Introduction** (prose, plain paragraphs, no drop cap) — reader-direct opener (why people over 50 are the prime target: long paper trails make for richer profiles) → a paragraph that reassures (not your fault, but the exposure is yours to shrink) and previews the rest (how the industry works, then how to take back control). Does not re-explain what a broker is; the header lead-in already did that.
5. **Inside the industry built on your information** (H2) — a **staged walkthrough**. A short lead-in, then a slim **flow map** ("How your information moves": 1 your details → 2 data brokers → 3 whoever pays → 4 back to you) as a one-glance overview, then four numbered **stage H3s** (terracotta step badge beside each sentence-case H3) that expand the map, each with prose plus one visual or list:
   - **1 · Where your information comes from** — prose + the **Action Callout** (§3.27, "see it / fix it"): a Whitepages link to prove your data is out there, paired with the Incogni offer as the fix (first product mention). (The earlier sources→profile illustration was removed as repetitive with the prose.)
   - **2 · How brokers turn it into a product** — prose + a **bulleted list** of what a profile contains + the $280B / 5,000-brokers scale (rich body text) + legality/opacity note + the **breaches Chart Callout** (the file refills as companies are breached).
   - **3 · Who's buying** — prose + a **bulleted list** of buyers (advertisers, people-search, background/risk firms, scammers). (No callout here; it moved to Stage 1.)
   - **4 · What it costs you** — the threats/tactics list, then a **financial-loss Stat Callout** (avg ~$38K/victim 60+, 12,400 over $100K each) and an inline Incogni CTA, before handing off into "How you can push back."
   Visuals are distributed one per stage, separated by prose and lists. The flow map and the stage H3s intentionally cover the same four steps (map = overview, stages = detail).
6. **How you can push back against data brokers** (H2) — three actions: opt out yourself, share less, let a service keep watch (the last frames why ongoing monitoring is the real product), then a transition to the options.
7. **Where we'd start** (`#pick`) — three stacked **Offer Cards** (§3.24): Incogni featured, then DeleteMe and Aura. Whole card clickable to its affiliate URL.
8. **Do these tools really work?** (prose) — impact evidence, centered on Incogni (Deloitte assurance report, 245M+ removals, 60–90 day cadence) + a Stat Callout + an honest "not invisible" caveat + source line.
9. **Safety / FAQ** — four **education-focused** questions (what a broker is, how they got your data, legality, whether removal stops scams).
10. **Bottom CTA** — primary "Get started with Incogni →" + secondary "See the three options" (→ `#pick`).
11. **Disclosure** — affiliate disclosure + pricing-can-change + sourcing/context note.

**Outbound destinations** (open in new tab, `rel="noopener noreferrer"`) — Incogni is on a **CPC deal**, so its offer is linked from 10 spots across the page. Every in-body **`Incogni` word mention** outside the offer cards is itself a link, including several editorial **inline CTAs** (prose only — the linked `Incogni` word is the click target, no separate arrow buttons). The Incogni link locations: intro editorial CTA; Stage 1 fix-it text + its `Remove your information →` link; the post-chart inline CTA; the Stage 4 inline CTA; the "Where we'd start" value paragraph; the "Do these tools really work?" prose; the featured Offer Card overlay; the bottom-CTA subtitle; and the bottom-CTA button. DeleteMe and Aura are linked once each (their Offer Card overlay). The prove-it callout also links to a people-search site (`nofollow`):

| Service | URL |
|---|---|
| Incogni (pick) | `https://secure.money.com/pr/h0c9dcffc56d?apxa3=1053` |
| DeleteMe | `https://secure.money.com/pr/yac641ee9125?apxa3=1054` |
| Aura | `https://secure.money.com/pr/ta3ec7bc5112?apxa3=1055` |

## States

Static page — no application state.

- **Default** — the only state; static HTML.
- **Stat Hero** — big `$7.7B` figure + label/sub paired with a sparkline (SVG viewBox 280×110; path spans the full width so the line reaches both edges). Flex row on desktop, stacked on mobile; framed by hairlines, no box. Year labels (`2020`/`2025`) render as an HTML axis row under the sparkline, not inside the SVG. `role="img"` + plain-language `aria-label` on the sparkline.
- **Breaches bar chart** — in-body bar chart, **de-chromed** (no cream box): a full-width `.chart-open` figure framed by top/bottom hairlines like the Stat Hero, so the chart fills the content width and the data stays legible on mobile. Inline SVG viewBox 480×188 scaling to width; one bar per year 2020–2025, value labels (13px) above each, 2025 emphasized (17px Bitter terracotta); `role="img"` + `aria-label`. Bespoke illustration, not a formal design-system component.
- **Flow diagram** — four token-built nodes with connector arrows. **Desktop:** row layout with terracotta right-pointing arrows between nodes. **Mobile:** nodes stack with vertical spacing and the connector arrows are **hidden** — the terracotta step numbers (1–4) that **straddle the top border** of each node carry the sequence instead (the rotated-arrow treatment read as a stray vertical tick, so it was removed). No node is otherwise highlighted. Node titles are forced to one line; sub-lines are written to wrap to ~three lines so the cards align. Not yet a formal design-system component (bespoke illustration); flag for formalization if reused.
- **Action Callout** (§3.27) — two-step "see it / fix it" card: top accent bar, equal columns with a centered divider on desktop, stacked (divider becomes horizontal) below a 460px container via container query. See-it link is a quiet inline underline (people-search, `rel="noopener noreferrer nofollow"`); fix-it link is a bold action link to the Incogni offer (new tab). Responsive via container query, so it stacks correctly even in a narrow column.
- **Offer Card hover (pointer devices):** card lifts (`translateY(-2px)`) with a terracotta-tinted shadow (deeper on featured); the featured card's primary CTA cascades to hover color; whole card clickable via overlay `.offer-link`.
- **Reduced motion:** transitions/animations collapse; card-lift and CTA press-scale disabled; smooth scroll → instant.
- **Links:** all outbound open in a new tab with `rel="noopener noreferrer"`.

## Copy

> Copy constraints applied: **no em dashes** anywhere; the word "actually" and "apparently" are not used. **Only the H1 is title case** (the client's exact wording, a deliberate exception); every other heading on the page is sentence case.
>
> **Body style: short, scannable paragraphs.** Everything below the header (the front matter) is set in one-to-two-sentence paragraphs for scannability. The header (kicker, H1, dateline, lead-in) is exempt. FAQ answers are left whole (the Q&A format already scans). Copy strings below are grouped by section; each `/`-or-line break in the prose marks a separate paragraph in the build.

### Hero
- **Page title:** `The data broker industry, explained · BaseLocal`
- **Kicker:** `Privacy · What we found`
- **Kicker:** `Privacy · What we found`
- **H1:** `There's a Multi-Billion-Dollar Industry Built on Information You Never Agreed to Share. Here's How It Works.`
- **Date (in the nav, not the article header):** `Updated June 2026`
- **Lead-in (2 sentences, 15px — one step below body, sized to sit ~3 lines on desktop, into the viz):** `Data brokers collect your address, phone number, and buying habits from public records, store loyalty cards, and the apps on your phone, then package it into a profile they sell. Advertisers buy it, but so do scammers, and that profile is what's led to a nearly 700% increase in fraud losses since 2020.`

### Stat Hero (directly below the lead-in)
- figure: `$7.7B`; label: `lost to fraud by Americans 60+ in 2025`; sub: `up from about $1.0B in 2020`
- sparkline: rising line, 2020 to 2025
- source: `Source: FBI Internet Crime Complaint Center (IC3) Elder Fraud reports, 2020 to 2025. Verify figures before launch.`

### Introduction
- **Opener (reader-direct), five short paragraphs (no drop cap); leads with "Data brokers" to pick up the lead-in's thread:**
  1. `Data brokers don't value everyone the same.`
  2. `If you are over 50, you are the target, and not by accident.`
  3. `The profiles for sale are most complete for people with long histories: years of addresses, phone numbers, mortgages, memberships. The longer your paper trail, the more a stranger can know before they ever call.`
  4. **Inline CTA (editorial, soft):** `That is why a whole industry now exists to help people take their information back. Incogni is where many readers start: it finds the brokers holding your details and files the removals for you.` (the word `Incogni` links to the offer; prose only, no button. Deliberately soft this early so it doesn't pre-empt the "Where we'd start" recommendation.)
  5. `None of this is your fault, and almost none of it was your choice.`
  6. `What you can change is how much of your information stays out there. We'll show you how this industry works, then walk through the ways to take back control of your information.`

### Inside the industry built on your information (expanded, educational)
- **H2:** `Inside the industry built on your information`
- **Opener:** `Collecting and selling your personal data is not a side hustle. It is one of the most profitable industries in the world, with its own buyers, sellers, and going rates. Almost none of it happens with your knowledge, and almost all of it is legal.`
- **Map intro:** `Here is the whole cycle, start to finish.` (before the map)
- **Bridge into the stages:** `Let's go deeper on each step.` (after the map, before Stage 1 — gives a break so the map's node "4" and Stage 1's badge "1" don't collide)
- **Flow map** (`How your information moves`): four numbered nodes (row with right-pointing arrows on desktop; stacked on mobile with arrows hidden, the step numbers carrying the sequence) — `1 Your details` (Public records, store cards, apps, and breaches) → `2 Data brokers` (Bundled into one profile and put up for sale) → `3 Whoever pays` (Advertisers, people-search sites, and scammers) → `4 Back to you` (Targeted scam calls, fraud, and public exposure). Step numbers straddle each card's top border. Serves as the section overview; the four stage H3s below expand it.

**Stage 1 — Where your information comes from** (numbered step-badge H3):
- Prose: `It doesn't come from one place. Brokers pull it from the ordinary paper trail you leave just by living: a mortgage filing here, a loyalty signup there, an app that wanted your location.`
- Connector: `You don't have to take our word for it.`
- **Action Callout (§3.27)** — moved here from Stage 3 (the sources→profile illustration was removed as repetitive with the prose). See-it `Look yourself up on Whitepages and your address, phone number, and relatives turn up in seconds.` (Whitepages inline link, placeholder); fix-it `Incogni is a service that does the opting-out for you. It files removals across the data brokers and re-checks so your details don't return. It comes with a 30-day money-back guarantee and 24/7 support.` + link `Remove your information →` (first product mention).

**Stage 2 — How brokers turn it into a product** (numbered H3):
- Prose: `On their own, those scraps are harmless. Stitched together, they become a profile detailed enough to impersonate you.`
- Lead-in `A finished profile can include:` + **bulleted list:** `Your name, age, and current address` / `Past addresses and phone numbers` / `Relatives and known associates` / `What you buy, own, and search for`
- Scale: `By recent estimates the trade moves about $290 billion a year worldwide, run by more than 4,000 data brokers. Most of it is legal, and most of them will never tell you they hold a file on you.` (bold the two figures)
- `The file never goes stale, either. Every new breach refills it.`
- **Breaches bar chart (de-chromed, full-width `.chart-open`):** title `Reported U.S. data breaches, by year`; bars 2020–2025 (`1,108 / 1,862 / 1,802 / 3,202 / 3,152 / 3,322`), 2025 solid terracotta; footnote `2025 set a record, nearly three times the count five years earlier.`; source line `Source: Identity Theft Resource Center, 2020 to 2025.` (no reader-facing "verify" language on the page).
- **Inline CTA (after the chart, editorial prose):** `Every record year hands the brokers more to sell. Incogni re-files your removals every 60 to 90 days, so the listings that creep back keep getting pulled down.` (the word `Incogni` links to the offer; no arrow link). Placed here because the re-filing pitch is earned by the record-breach chart directly above it.

**Stage 3 — Who's buying** (numbered H3):
- Prose: `Once a profile exists, it sells to almost anyone.`
- **Bulleted list:** `Advertisers, to aim products at you` / `People-search sites, to publish your profile for anyone to look up` / `Background-check and risk firms, to vet you for businesses` / `Scammers, to make a fraud sound like it already knows you`
  (The Action Callout was moved to Stage 1; Stage 3 is now prose + the buyers list only.)

**Stage 4 — What it costs you** (numbered H3):
- Intro (one paragraph): `This is where the fraud comes in. The richer your profile, the more dangerous and convincing scammers can be. Some common tactics include:`
- **Bulleted list of threats/tactics:** `Imposter calls` (know your name, address, relatives, so a fake family emergency sounds real) / `Government impersonation` (Social Security, Medicare, IRS) / `Account takeover` (your facts answer security questions) / `Phishing texts and emails` (name a real purchase, bank, or street) / `New accounts in your name` (credit cards, loans you never applied for)
- Closing paragraph: `Each one works because it sounds like it already knows you. Older adults are targeted most, and lose the most.`
- **Stat Callout (financial loss):** `About $38,000 was the average loss reported by fraud victims over 60 in 2025, and 12,400 of them lost more than $100,000 each.` (bold lead figure `About $38,000`. Uses the per-victim cut so it doesn't just repeat the header's $7.7B aggregate; same FBI IC3 source.)
- **Inline CTA (editorial prose):** `You can't undo a long history, but you can shorten what's for sale today. Incogni removes your details from the brokers feeding these profiles and keeps them off.` (the word `Incogni` links to the offer; no arrow link). Hands off into the push-back section.

### How you can push back against data brokers (H2)
Reworked to a tight, scannable list (the three actions were long paragraphs; now one bold-led line each).
- Intro (one line): `Luckily, you have more say than it feels like. There are three ways to take your information back.`
- **Bulleted list:**
  - `Opt out yourself.` Free, but it means filing with hundreds of brokers and checking back every couple of months.
  - `Share less going forward.` Skip optional email fields, turn off needless app permissions, and keep your number off forms that don't require it.
  - `Let a service keep watch.` Paid tools file the opt-outs and keep re-filing, so a one-time scrub doesn't quietly undo itself.
- Transition: `That last one is what most readers ask about. Here are the three we'd recommend, and where we'd start.`

### Where we'd start (Offer Cards)
- **H2:** `Where we'd start`
- **Value paragraph (benefits + supporting data, two short paragraphs, "Incogni" links to the offer):** `A removal service does the part you realistically won't. It files opt-outs across 400+ broker sites, then keeps re-filing every few weeks as your data creeps back, so the cleanup holds.` / `Fewer listings means fewer spam and scam calls aimed at you, and less for an impersonator to work with. For most readers, Incogni is where we'd start, but we've included two other options to compare.` (the "400+ broker sites" figure is a supporting data point — verify before launch)
- **Incogni (featured):** badge `BaseLocal pick`; tagline `Fully automated removal at the lowest price we found, with a family plan that covers everyone under one roof.`; chips (green) `Fully automated` · `420+ broker sites` · `Family plan` · `30-day money-back guarantee`; price `Starts at $7.99/mo`; CTA `Get started with Incogni →`
- **DeleteMe:** tagline `Real privacy specialists handle the removals by hand and send a plain-language report every quarter.`; chips `Human experts` · `20% reader discount` · `Quarterly report`; price `Starts at $10.75/mo`; CTA `See DeleteMe →`
- **Aura:** tagline `Data removal bundled with up to $5M in identity-theft insurance, a VPN, and antivirus, built to cover your whole household at once.`; chips `VPN + antivirus` · `$1M+ insurance` · `60-day money-back guarantee`; price `Starts at $9/mo`; CTA `See Aura →`

### Do these tools really work? (impact)
- Para: Incogni was the first removal service to publish an independent assurance report (Deloitte, 2025); covers 420+ brokers; re-files every 60 to 90 days; 245M+ removal requests processed across users.
- **Stat Callout:** `245 million+ removal requests processed, and the first Deloitte-audited assurance report in the category. Most people see their first listings drop within about a week, with fuller results over four to six weeks.`
- Caveat para: `None of that makes you invisible, and no honest service will claim it does…`
- The standalone `See what Incogni covers →` link was removed. Instead, the **`Incogni` word itself is linked** to the offer wherever it appears in body copy.

### FAQ — `A few honest questions` (education-focused)
- `What is a data broker, exactly?` — collects your info from public records, purchases, apps, and other businesses; bundles it into a profile; sells it.
- `How did they get my information?` — property/voter records, court filings, loyalty programs, app permissions, resold data; you almost never agreed to the selling.
- `Is any of this legal?` — mostly yes; opt-out rights exist in a growing patchwork of state laws, burden is on you, enforcement is thin.
- `Will removing my data stop scams?` — lowers your odds, not to zero; treat it as one strong layer, not a force field.

### Bottom CTA & disclosure
- **H2:** `Where would you like to start?` — subtitle `We'd point most readers to Incogni. The other two fit specific needs.` — buttons `Get started with Incogni →` / `See the three options` (→ `#pick`)
- **Disclosure:** `BaseLocal earns a commission when you sign up through the links on this page. It has no impact on your costs for these services.` / `Pricing and features were accurate as of June 2026 and can change at any time. Confirm the current terms on each service's own site before you buy.`

## Data requirements

None collected on-page; static. Dynamic values are all **display copy** that must be reconciled against sources before launch: the IC3 chart series, the industry-size and broker-count stats, the breach stat, the Incogni impact figures, and the three prices. Affiliate URLs carry the partners' tracking parameters — preserve them exactly; do not strip or re-encode.

## Payment / external integrations

No payment on-page. Three affiliate partners via tracked outbound links: **Incogni** (`affiliate_id=1127`, `source=baselocal`), **DeleteMe** (custom `/offers/base-local/` page, `_ef_` params), **Aura** (Impact `irclickid` "Protect Yourself" offer). Keep URLs intact in production; if cloaked/redirect links are adopted, preserve `target="_blank"` + `rel="noopener noreferrer"`.

## Open questions

1. **Statistics — sourced and validated June 2026 (citations below); re-confirm at launch since figures update annually:**
   - **Stat Hero / lead-in** — ✅ FBI IC3 Elder Fraud (age 60+) losses: 2020 $966M → 2025 >$7.7B (201,266 victims). "Nearly 700% increase since 2020" = 697% ($966M → $7.7B), accurate. Intermediate years ($1.7B / $3.1B / $3.4B / $4.885B) match the published IC3 series. Source: [2025 IC3 Annual Report](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf). No single-year % is cited (sources disagree: ~37% vs ~59%).
   - **Stage 4 financial-loss Stat Callout** — ✅ same 2025 IC3 Elder Fraud data: average reported loss for victims 60+ ≈ **$38,000** ($7.7B ÷ 201,266 victims = $38,256), and **12,400** victims lost more than $100,000 each. Source: [2025 IC3 Annual Report](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf), [HousingWire](https://www.housingwire.com/articles/fbi-seniors-cybercrime-2025/).
   - **Industry size** — ✅ updated to "**about $290 billion a year worldwide**" (2025 global data-broker market estimates run ~$287B–$303B; $290B is mid-range). Labeled *worldwide* on the page (US-only is ~$132B). Broker count updated to "**more than 4,000**" (Privacy Rights Clearinghouse: ~750 registered across state registries; estimated 4,000+ active in the US). Sources: [Grand View Research](https://www.grandviewresearch.com/industry-analysis/data-broker-market-report), [Protegrity](https://www.protegrity.com/blog/the-hidden-market-for-your-personal-data/), [Privacy Rights Clearinghouse](https://privacyrights.org/data-brokers).
   - **Breaches chart** — ✅ all six ITRC U.S. data-compromise counts confirmed against the 2025 Annual Data Breach Report: 2020 1,108, 2021 1,862, 2022 1,802, 2023 3,202, 2024 3,152, 2025 3,322 (record). Footnote "nearly three times the count five years earlier" (3,322 vs 1,108 = 3.0×) is kept per client decision — note ITRC's own headline frames it as "79% jump over five years," so expect that this framing differs from ITRC's. Source: [ITRC 2025 Annual Data Breach Report](https://www.idtheftcenter.org/post/2025-annual-data-breach-report-record-number-compromises/).
   - **Incogni impact** — ✅ Deloitte ISAE 3000 Independent Limited Assurance Report (Aug 2025): 420+ brokers, re-files ≤60 days (public) / ≤90 days (private), 245M+ removal requests since Jan 2022, first in the category. Source: [Incogni / Deloitte report](https://blog.incogni.com/deloitte-independent-limited-assurance-report/).
2. **Pricing & chip claims:**
   - ✅ Incogni `$7.99/mo` (Individual, annual), family plan, 30-day money-back — confirmed ([incogni.com/pricing](https://incogni.com/pricing)).
   - ✅ DeleteMe `$10.75/mo` ($129/yr), quarterly report — confirmed ([security.org](https://www.security.org/data-removal/deleteme/)). The "widest coverage" tagline claim was **removed** (couldn't verify it beats Incogni's audited 420+). The `20% reader discount` chip is a **partner/affiliate offer** (client confirmed true) — re-confirm it matches the live money.com offer.
   - ⚠️ Aura `$9/mo` — public Individual rate is currently $10/mo; client confirmed $9 as the partner/annual rate. Re-confirm against the live offer. The insurance chip was changed from `$5M` to `$1M+` because $1M/adult is what the entry plan includes (the $5M is the 5-adult family-plan total, which the tagline still states correctly). Source: [aura.com/pricing](https://www.aura.com/pricing).
3. **Headline casing:** resolved — only the H1 is title case (client's exact wording); all other headings are sentence case, per the brand guide.
8. **"Prove it" people-search link:** the callout currently points to `whitepages.com` as a placeholder. Vet the destination before launch — pick a site that shows enough for free to land the point (e.g., FastPeopleSearch shows more than Whitepages' gated results), and weigh the tradeoff of sending readers (and their search) to a data broker. Keep `rel="nofollow"`. Consider linking to the partner's own free scan instead.
4. **Header / date:** the header is text-only and data-led (no image, by choice): kicker, H1, and the 15px lead-in flowing into the Stat Hero. The date lives in the **nav** (logo / Updated June 2026 / Recommendation), not the article header. Set the real updated date at launch. (Social Proof Strip §3.26 and the reader-count chip remain in the design system but are intentionally unused here.)
5. **Logo link target:** header wordmark links to `https://baselocal.us` — confirm that's wanted from a conversion page (vs unlinked).
6. **No comparison table:** the side-by-side feature table was intentionally removed for this first-touch page. The Feature Comparison Table component still lives in the design system (§3.23) for a future deeper-comparison page if wanted.
7. **FAQ / education accuracy:** the legality, opt-out, and "stops scams" claims are general — check against current US state-law language and the partners' SLAs before launch.
