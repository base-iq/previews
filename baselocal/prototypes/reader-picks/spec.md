# Reader Picks (Sign-Up Leaders) — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `reader-picks`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/reader-picks/](https://base-iq.github.io/previews/baselocal/prototypes/reader-picks/)

---

## Goal

The Welcome Page monetization roundup: a monthly-refreshed list of the five offers BaseLocal readers **signed up for most**, ranked from the two numbers placement reporting already tracks — clicks and completed sign-ups (postback conversions). New subscribers hit the Welcome Page at peak curiosity and zero ad fatigue; this page converts that moment using engagement data competitors can't copy. The ranking claim is also the trust mechanism, so figures must be real at launch.

## Page structure

Header structure mirrors the live advertorial at `baselocal.com/tibo-titanium-cutting-board/`:

1. **Site header:** brand lockup (wordmark · divider · "Reader picks" tag) left; "Advertiser disclosure" popover button right (standard disclosure text; closes via ✕ / outside click / Escape).
2. **Front matter:** dateline ("June's list · Refreshed monthly") → H1 → lede, staggered `fadeInUp` entrance.
3. **Methodology note** (cream callout) — the trust anchor: "we see two numbers for every offer we run: clicks, and completed sign-ups"; refreshed monthly; drops are disclosed.
4. Five pick cards, whole-card clickable; No. 1 featured (terracotta border + badge).
5. **Dropped-off strip** — names what fell off this month and why. Never omit when a drop occurred.
6. Disclosure block restating the ranking basis and the prototype-figure caveat.

## Ranking basis

**Primary rank: completed sign-ups (conversions) for the month.** Cards may cite either total sign-ups or click-to-signup rate (CVR) in their stat line — the stat must state which. No retention/renewal/"kept" claims anywhere: BaseLocal does not track post-signup lifespan.

## Ranking slots (June placeholder lineup)

| Rank | Partner | Category | Rank epithet | Stat line basis |
|------|---------|----------|--------------|-----------------|
| 1 (featured) | Medvi | GLP-1 telehealth | Most sign-ups in June | Total conversions |
| 2 | Incogni | Data-broker removal | Best click-to-signup rate | CVR |
| 3 | Progressive | Auto insurance comparison | The two-minute win | Completed quotes |
| 4 | Spot | Pet insurance | The same-day decision | Category-top conversions |
| 5 | AARP | 50+ membership | The easiest yes | Conversion consistency (daily sign-ups) |

Lineup and epithets are placeholders; production order comes from monthly click/conversion data.

## Monthly refresh process (production contract)

1. First week of each month, pull clicks + postback conversions per active offer from placement reporting.
2. Re-rank by completed sign-ups; update dateline month, card order, epithets, stat lines, and the dropped-off strip.
3. Every stat line must be a measured, defensible figure — the brand's hype rule applies literally. If a stat can't be stated honestly for an offer, the card runs without one.
4. URL stays stable; anchors `#pick-1`…`#pick-5` refer to positions, not partners.

## States

- **Disclosure popover:** closed by default; button toggles with `aria-expanded`; Escape/outside click closes. Only client JS on the page.
- **Whole-card click:** overlay `pick-link` with `aria-label`; visible button is a styled `<span>` (card carries the link).
- **Hover:** card lift + button hover cascade; collapses under `prefers-reduced-motion`.
- A month with no dropped offer: omit the dropped strip entirely (never render filler).
- Error/empty/loading: n/a.

## Copy

Final strings in `index.html`. Register: data-backed curator; the page brags about its method, never the products. Key strings:

- **H1:** "What readers signed up for most last month"
- **Dateline:** "June's list · Refreshed monthly"
- **Lede:** "Clicking is curiosity; signing up is a verdict…"
- **Method note:** "We see two numbers for every offer we run: clicks, and completed sign-ups…"
- **Stat lines:** all carry `*` tied to the disclosure caveat while figures are placeholders.
- **Dropped strip:** names the fallen offer and the observable reason (sign-ups slid).

## Data requirements

- Monthly clicks + postback conversions per offer from BaseLocal placement reporting (already tracked — no new instrumentation).
- Tracked affiliate URLs for all five cards (currently `#`), `target="_blank" rel="noopener noreferrer sponsored"` at production.
- Partner logos from `previews/baselocal/assets/partner-logos-media-kit/`.

## Payment / external integrations

None on-page.

## Open questions

1. **Conversion event per category** — what counts as a "completed sign-up" varies (intake finished vs. quote completed vs. membership purchased). Confirm the postback event used for each partner so stat lines compare like with like.
2. **Placement on Welcome Page** — embedded section vs. linked card vs. post-signup step? Affects whether a condensed variant is needed.
3. **Refresh ownership** — who runs the monthly refresh (Analyst pulls numbers, this role updates copy)? Needs an owner or the premise collapses.
4. **Compliance** — GLP-1 card needs prescription/eligibility language review; conversion claims naming insurance partners may need carrier approval.
5. **Month one** — no prior list exists at launch; either omit the dropped strip or seed it honestly ("first edition — nothing has had the chance to drop off yet").
