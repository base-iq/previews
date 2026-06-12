# Titanium Cutting Board Bridge Page — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `titanium-cutting-board`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/titanium-cutting-board/](https://base-iq.github.io/previews/baselocal/prototypes/titanium-cutting-board/)

---

## 1. Goal

An advertorial bridge page that presells the TIBO 4-in-1 titanium cutting board before sending traffic to the gettibo.com offer page. It replaces a third-party (Hoom-branded) advertorial that currently sits in the funnel and outperforms direct-to-landing-page traffic. This page keeps the proven presell mechanics — data-backed pain points each resolved by a product feature, social proof, risk reversal, light scarcity — but in BaseLocal's editorial voice and visual system, structured as a "scorecard" head-to-head: plastic vs. wood vs. titanium across six checks.

**Copy rhythm:** body paragraphs alternate one- and two-sentence blocks for scannability, with no uniform 3–4 sentence walls. The same holds inside the round problem/fix prose.

**No em dashes:** the page copy contains zero em dashes (—). They were replaced with colons, periods, commas, or parentheses as the context called for. En dashes (–) are retained only in numeric ranges (14–71M particles, 8–12 weeks). Verdict-card/explainer and tie-footnote quotes elsewhere in this spec predate that pass — the page (`index.html`) is the source of truth for exact punctuation.

**Honesty constraint:** BaseLocal did **not** physically test the boards. The page is a review of published research, food-safety guidance, and the manufacturer's specifications. All copy uses research-review language ("we pulled the research," "the research shows," "our review") — never first-person testing claims ("we tested," "three weeks of dinners"). The disclosure states this explicitly.

Audience: BaseLocal's readership (73% female, 50+), arriving from ads or email. Health-conscious home cooks for whom microplastics and kitchen bacteria are high-credibility concerns.

## 2. User flow

Single screen: `index.html`. No forms, no multi-step flow.

1. **Arrive** from ad/email → header, kicker, headline, lede (hero entrance animation).
2. **Skim or read** — the intro is a two-paragraph report summary (method + findings in one breath); a cream lead box fused to the scorecard's top edge carries the skimmer CTA; the scorecard table (`#scorecard`, with swatch column headers and a Final-score footer row) gives the whole argument at a glance; six "round" sections play out one table row each (see Round structure below): a "What's the problem?" container with prose + bullets, the image, a winner explanation, and a light left-aligned result.
3. **Convert** — any CTA opens the offer page in a new tab (`target="_blank"`). CTAs appear at: scorecard-lead inline link, Pick Card button, bottom CTA. (The per-round blocks intentionally carry **no** inline CTA — the repeated ask was dropped.)
4. **Secondary action** — bottom CTA's outline button anchors back to `#scorecard`.

Page section order: header (logo · date · category label) → front matter (kicker, H1, 15px lead-in, three-panel hero banner) → divider → intro (report summary) → scorecard lead + table (Final-score footer) + verdict callout → rounds 1–6 → divider → "The board we'd recommend" + Pick Card + 2 testimonials + owners image → FAQ → bottom CTA → disclosure.

**Round structure (each of the six), top to bottom:**
1. **Big-numeral header** — terracotta numeral + eyebrow ("Round N of 6 · {topic}") + H2.
2. **"What's the problem?" container** (`.problem-box`) — a single light cream box, left-aligned, holding: a terracotta "What's the problem?" label, problem prose, an optional **bulleted list** of the supporting facts/stats (`.problem-list`, used on rounds 1, 2, 5, 6), and an italic source line where a study is cited.
3. **Figure** (or figure-pair on Round 6) with caption.
4. **Winner explanation** — an `<h3 class="winner-head">` followed by prose proving the winner(s). On **tie rounds the heading names both winners** ("Why titanium and wood take this round" R1/R5, "Why titanium and plastic take this round" R4); solo rounds use "Why titanium takes this round" (R2, R3, R6). The prose explains *each* winning board's result, and the result of every losing board too: when both plastic and wood fail for different reasons (R2: wood's deep grooves vs. plastic's knife scars), each failure is spelled out; when they fail for the same reason (R3 single surface, R6 no sharpener), one explanation covers both.
5. **Light result** (`.round-result`) — a left-aligned line (thin top rule, no box, no stamp): a label ("After round N", "Final tally" on R6) then the three materials with this-round glyph + running tally ("✓ Titanium 5 of 5"). This round's passers render green/bold; the rest are muted. Fixed order: Titanium, Wood, Plastic.

The old two-column problem/fix block, the boxed/stamped verdict card, and the standalone "see it / fix it" Action Callout were all **removed**; their CSS was deleted. This was a readability overhaul: fewer heavy blocks, more paragraphs + bulleted lists, and a lighter left-aligned result replacing the centered verdict card.

## 3. States

Static content page; no form states.

- **Default:** all content visible immediately — no scroll-reveal animation. The only entrance motion is the hero block's staggered `fadeInUp` on load (kicker/H1/lead-in at 0/80/160ms). No JavaScript on the page.
- **Reduced motion:** `prefers-reduced-motion: reduce` collapses all animation/transitions to 0.01ms.
- **CTA hover/active:** primary buttons — Deep Terracotta + terracotta glow shadow on hover, `scale(0.97)` on press. Links underline on hover.
- **Scorecard on mobile (≤600px):** table scrolls horizontally inside `.fc-scroll` (min-width 560px), row-label column frozen (`position: sticky`), italic swipe hint shown.
- **Image failure:** every `<img>` carries descriptive alt text.
- **Edge cases:** none interactive. The `#scorecard` anchor must keep working if section order changes.

## 4. Copy

Exact strings. Functional UI is calm; voice lives in headings, body, and callouts.

| Element | Text |
|---|---|
| Page title | Plastic, wood, or titanium? Six checks, one winner · BaseLocal |
| Meta description | We reviewed the research on plastic, wood, and titanium cutting boards across six checks — microplastics, bacteria, cross-contamination, cleanup, knife wear, and sharpening. One material cleared all six. |
| Header (right side) | Updated June 2026 · HEAD-TO-HEAD — matches the data-removal-services bridge header template: logo left, date + category label right |
| Kicker | Kitchen · What we found |
| H1 | 22,504+ BaseLocal readers wanted a cutting board free of microplastics and bacteria. Titanium passed every check. |
| Scorecard table header (corner cell) | What we checked |
| Hero lead-in (15px, per template) | We didn't expect a cutting board to matter this much. Then we read what the studies say plastic and wood leave in your food, and found a titanium board (**TIBO** [link → offer]) that replaces plastic boards, wooden boards, knife sharpeners, and garlic graters all-in-one. |
| H1 style | Matches the data-removal-services bridge hero: Bitter 700, 28px mobile / 35px desktop, line-height 1.2, letter-spacing -0.3px (mobile) / -0.5px (desktop), margin-bottom 16px. |
| Hero visual | The three-panel verdict photo (`assets/boards-compared.png`: plastic ✗ / wood ✗ / titanium ✓) sits in the hero, directly under the 15px lead-in, as a **cropped banner** — `object-fit: cover`, height 180px mobile / 230px desktop, `object-position: center 58%` to keep the three circular ✗/✗/✓ badges centered while trimming board texture top and bottom. Captioned "Left to right: plastic shedding under the blade, wood holding what soaked in, brushed titanium." 24px gap above it (below the lead-in). It appears once (removed from its former spot after the verdict callout). |
| Head-to-head section | H2 "The scoresheet nobody hands you at the store" → two short framing paragraphs ("We scored all three materials on six checks: the things a cutting board has to get right, from keeping microplastics out of your food to keeping a knife sharp." / "Every result is backed by a published study, a federal guideline, or the manufacturer's spec.") → cream **scorecard-lead** one-liner ("Convinced? Titanium swept all six checks, and **TIBO** [link] is the board we'd recommend."), fused to the table's top edge → summary table → source/swipe captions → two-paragraph transition into the rounds ("That's the scorecard at a glance." / "Now let's get into the meat (pun intended!) of each round, with the evidence behind each result."). |
| Scorecard lead box (one-liner) | Convinced? Titanium swept all six checks, and **TIBO** [link → offer] is the board we'd recommend. (Cream box, fused to the table top.) |
| Table column order | **Titanium is the first value column** (featured: cream fill + terracotta top accent), then Plastic, then Wood. Reason: on mobile the table scrolls horizontally with the entire left column frozen (row-label cells **and** the "What we checked"/"Final score" corner cells are all `position: sticky; left: 0`, so the header stays aligned with its column during scroll); putting Titanium first keeps the winner (its full column of ✓ and 6-of-6 score) visible at load instead of hidden off-screen. Plastic/Wood are a swipe right. Desktop (≥720px) shows all four columns without scroll. No "Our pick" badge. |
| Table column headers | Material name + circular swatch dot (titanium: steel gradient / plastic: white-gray gradient / wood: tan gradient). |
| Table rows (in order) | No plastic in your food / Clean below the surface / Safe for meat and produce / Survives the dishwasher / Gentle on knife edges / Sharpens your knife — each shortened to fit **one line** (row-label cell is `white-space: nowrap`, frozen left on mobile) |
| Table footer (Final score row) | Plastic **1** of 6 · Wood **2** of 6 · Titanium **6** of 6 (green, larger) — 2px espresso rule above |
| Verdict callout | **Wood took two rounds and plastic one** — real wins, which is what makes the sweep meaningful. The sections below play out the scorecard a row at a time, evidence included. |
| Round transition (each round) | Oversized Bitter terracotta numeral (64px mobile / 76px desktop) left of: eyebrow "Round {N} of 6 · {topic}" + H2. Topics: What ends up in your food / Below the surface / Cross-contamination / Cleanup / Your knives / The tiebreaker |
| Round H2s | A plastic board sheds plastic with every slice / Wood wins on shedding, then loses in the grooves / Raw chicken, then tomatoes — the swap nobody makes mid-recipe / The dishwasher round / A metal board that's softer than your blade / The only board that maintains the knife it meets |
| Round light result (closes each round) | Left-aligned `.round-result` line. Label "After round N" (R6: "Final tally"), then `✓ Titanium {n} of {N}` / `Wood {n}` / `Plastic {n}` in fixed order, this-round passers green. **On ≤600px it stacks to one item per line** (label, then each material) so Plastic isn't orphaned on a second line. Running totals: R1 Ti 1 Wood 1 Plastic 0 · R2 Ti 2 Wood 1 Plastic 0 · R3 Ti 3 Wood 1 Plastic 0 · R4 Ti 4 Wood 1 Plastic 1 · R5 Ti 5 Wood 2 Plastic 1 · R6 (final) Ti 6 Wood 2 Plastic 1. |
| Tie co-passer notes (R1 / R4 / R5, in winner prose) | R1: "Wood clears this one too… this is the only round of the six wood survives, and titanium passes them all." · R4: "Plastic survives the rack too, its one win of the six. But every cycle softens a face that's already scarred…" · R5: "Wood is gentle on edges too, so it shares this one. Titanium matches it here and wins everywhere else." |
| Pick Card name | TIBO 4-in-1 Titanium Cutting Board |
| Pick Card tagline | One board standing in for four tools: both cutting surfaces, a knife sharpener, and a grater. |
| Pick Card features | Double-sided — medical-grade titanium for raw meat, a second surface for produce / Ceramic knife sharpener built into the handle / Garlic and ginger grater set into the board / Dishwasher-safe and non-porous — won't stain or hold odors / Juice groove and non-slip base |
| Pick Card name + intro | H2 "The board we'd recommend" → "TIBO's 4-in-1 is the board our review kept pointing back to: the one material that cleared every check above, in a design that folds four kitchen tools into one." |
| Pick Card social proof (product) | **4.8★** across **337 verified reviews** · 97% positive |
| Pick Card — links & CTA | Product name "TIBO" is linked to the offer; CTA button "Check availability →" (white label — `.prose a.btn-primary` override keeps it white, since `.prose a` would otherwise tint it terracotta). The first-party "22,504 readers" line and the "Best for" line were **removed**. |
| Offer badge | 50% launch discount · return shipping covered |
| Primary CTA (all instances) | Check availability → |
| Post-CTA note | Every order carries a 30-day money-back guarantee and a 1-year warranty. |
| Testimonial 1 | "I hesitated at the price. Three months in, the built-in sharpener alone has earned it back — my knives haven't been this sharp since I bought them." — Sarah M., Seattle, WA |
| Testimonial 2 | "I cook six nights a week. Prep moved faster the first night, and I've stopped juggling two boards between the chicken and the salad." — Jennifer K., Portland, OR |
| FAQ heading | A few honest questions |
| FAQ Q1 | Is titanium safe to cut food on? → Grade 2, 99%+ pure; same metal as surgical implants/dental hardware; no coating; nothing reactive for acidic food to pull out. |
| FAQ Q2 | Won't a metal board ruin my knives? → Glass/stainless would; Grade 2 titanium is softer than hardened blade steel; built-in sharpener covers gradual dulling. |
| FAQ Q3 | How do I know I'm getting real titanium? → Magnet test: titanium isn't magnetic; stainless knockoffs usually are. TIBO sells directly. |
| FAQ Q4 | What if it isn't for me? → Return it within 30 days for a full refund, with the return shipping covered. |
| Bottom CTA H2 | Six rounds. **TIBO** [linked] passed them all. |
| TIBO links | **Every** visible "TIBO" mention is a link to the offer (hero lead-in, scorecard-lead, Round 3, Round 6, pick intro, pick-card title, FAQ, bottom-CTA headline) — 8 in all; the only unlinked "TIBO" is image alt text. |
| Bottom CTA subtitle | The 50% launch discount applies while the current production run lasts. |
| Secondary CTA | Back to the scorecard |
| Disclosure | BaseLocal earns a commission when you buy through links on this page. It doesn't change what you pay. (Per client request, the research-vs-testing disclaimer, the 22,504-provenance note, and the "not medical advice / individual results vary" line were **removed** — only the commission disclosure remains.) |

**Statistics used (with sourcing status):**

| Claim | Source | Status |
|---|---|---|
| 14–71M microplastic particles/yr; ~50 g/yr from one polyethylene board | Yadav et al., *Environmental Science & Technology*, 2023 | Published study — verify exact figures against the paper before launch |
| ~200× more fecal bacteria on cutting boards than a toilet seat | NSF International household germ study | Widely reported; **exact citation flagged in-page for verification** |
| 1 in 6 Americans (~48M) sickened by foodborne illness yearly | CDC foodborne illness estimates | Stable public figure |
| USDA: discard boards with deep, hard-to-clean grooves | USDA FSIS cutting board guidance | Stable public guidance |
| 4.8★ / 337 verified reviews / 97% positive | TIBO landing page | Manufacturer claim — keep consistent with live offer page |
| 22,504 readers referred to the offer | BaseLocal newsletter (first-party) | Verify the current count before each republish; disclosed in the disclosure block as a referral/click figure, not a purchase count |
| 50% launch discount, 30-day guarantee, free return shipping, ~4% return rate, 8–12 week production runs, $50–100/yr sharpening savings, Grade 2 / 99%+ purity | Manufacturer (gettibo.com / Hoom advertorial) | Manufacturer claims — attributed as such in copy |

## 5. Data requirements

None dynamic — fully static page. Implementation needs:

- **Outbound CTA URL:** all offer links (CTA buttons + every linked "TIBO") point to the gettibo.com tracking URL `https://gettibo.com/offer-01-s/?lpid=1135&source_id=DL&utm_source=34143&utm_term=1135&aff_id=34143&oid=1135&affid=34143` (empty `req_id`/`utm_medium`/`sub_id`/`device_type`/`country_name` params are placeholders the tracking platform fills per click). HTML-encodes `&` as `&amp;` in `href`.
- All CTAs: `target="_blank" rel="noopener noreferrer"`.
- Images served from local `assets/` (11 files, sourced from the Hoom advertorial CDN). `knife-wear-chart.png` and `board-in-hand.png` are downloaded but unused — available for iteration.
- Fonts: Bitter 400/700 + Lato 400/500/700/900 via Google Fonts.
- Logo: `../../assets/logos/baselocal-full-dark.svg` (28px height per design system).

## 6. Payment / external integrations

None on this page. Checkout, payment, and fulfillment all live on the gettibo.com offer page. The only integration point is the outbound tracking link (see §5).

## 7. Open questions

1. **Tracking link** — the gettibo.com tracking URL is now wired into every CTA and TIBO link. Confirm the `req_id`/`gu_id` per-click params get populated correctly by the tracking platform in production (they're empty in the static markup).
2. **NSF "200×" statistic** — flagged in-page; needs the exact NSF citation (or replacement with a different sourced figure) before launch.
3. **ES&T study figures** — confirm the 14–71M particles and ~50 g/yr numbers against the published paper (Yadav et al. 2023) rather than secondary reporting.
4. **Testimonials** — reused from the Hoom advertorial (lightly trimmed). Confirm rights to reuse, or swap for reviews sourced from the TIBO landing page.
5. **Review counts** — landing page showed 337 reviews / 97% positive at build time; re-check at launch so the bridge never overstates the offer page.
6. **Compliance** — does this page need an "Advertorial" label in the header (the Hoom control carries a footer disclaimer)? Current design uses BaseLocal's standard disclosure block only.
7. **Image rights** — product photography reused from the Hoom/TIBO CDN with the advertiser relationship implied by the affiliate offer; confirm the network permits reuse on our domain.
8. **Analytics** — no pixel/event wiring in the prototype. Production likely wants view + CTA-click events; out of scope here.
