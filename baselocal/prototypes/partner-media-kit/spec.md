# Partner Media Kit — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `partner-media-kit`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/partner-media-kit/](https://base-iq.github.io/previews/baselocal/prototypes/partner-media-kit/)

---

## 1. Goal

A PDF-first media kit for national / direct-response advertising partners. It pitches BaseLocal as a performance partner by showing the product (the daily edition), the audience (50+ women, 49% network open rate), the craft (in-house copywriting, angle laddering, variation testing), and the partnership model (the pilot → iterate / scale / kill flow) — using real placements and real measured numbers. Deal structures and pricing stay deliberately open-ended; the deck closes on "start a pilot," not a rate card.

Primary use: attached to outreach emails and sent after intro calls. Secondary: printed for in-person meetings. It is **not** a public web page (that's the local-business `/advertise/` surface, separate scope).

## 2. User flow

A single scrollable document of fifteen 16:9 pages (one `index.html`), in fixed order. "Flow" here is reading order. Case studies are grouped at the end, directly before the close, each carrying the Partner Logo Strip:

| # | Page | Job |
|---|------|-----|
| 01 | Cover (`Doc. 01`) | Brand + premise + title block (window, pricing posture) |
| 02 | What we do (`Fig. 02`) | The product: daily curated email, city by city; seven daily themes |
| 03 | Who reads (`Fig. 03`) | Audience: 73% women stat hero + three trait cards |
| 04 | Reach & engagement (`Fig. 04`) | The numbers: 49% open rate hero, sparkline, stat grid |
| 05 | Why it works (`Fig. 05`) | Trust mechanics: banned-hype voice box (never / instead) |
| 06 | The edition, mapped (`Fig. 06`) | Placement inventory in context: 9-section edition map (June 2026 structure) |
| 07 | Where partners run (`Fig. 07`) | Slot table with roles: Pilot / Scale |
| 08 | Campaign anatomy (`Fig. 08`) | Craft: Spot 3-send Variant Ladder. Caption + source footer |
| 09 | How a pilot works (`Fig. 09`) | Pilot Flow: 4 stages → fork → Iterate / Scale / Kill |
| 10 | The Spot pilot, scored (`Fig. 10`) | Pilot Scoreboard: 5 real variations, indexed CTR, outcomes |
| 11 | Case study: Privacy & data brokers (`Fig. 11`) | Bridge-page capability: placement → bridge → partner flow. Logo Strip |
| 12 | Case study: Home warranty (`Fig. 12`) | "Feels like advice" register: fewer clicks, better clicks. Logo Strip |
| 13 | Case study: TribeTokes (`Fig. 13`) | Retail: a genuinely great offer (free bottle w/ purchase), 1,200+ clicks, ran twice. Logo Strip |
| 14 | Case study: SnoreStop (`Fig. 14`) | Real-problem products: 33 runs over six weeks, 17K+ clicks, no fatigue. Logo Strip |
| 15 | Working with us (`Doc. 15`) | Close: pilot-first, flexible structures, contact |

**Placement structure (June 2026)** shown on pages 06–07: Lead Feature (1, replaces Intro) · In the News (2) · Highlights (2) · Inline Feature 1 (1) · Local Spotlights (0) · We Got Your Back (5, pilot slot) · Events (0) · Inline Feature 2 (1) · City Report (0). Top 10 Weekly is a Scale surface.

## 3. States

A static document — no forms, no async states. The two render targets are the states:

- **Screen:** pages scale proportionally (container-query units against a 1280×720 reference). Dark screen-bar header with print hint. Pages stack vertically with shadows on a warm desk background.
- **Print / PDF:** `@page 13.33in × 7.5in, margin 0`; one page per sheet (`page-break-after`); screen bar hidden; shadows removed; `print-color-adjust: exact`. **Verify the exported PDF page breaks after any content change** — drift here is the main regression risk.
- **Motion:** none anywhere, by design (print-first). `prefers-reduced-motion` is trivially honored.
- **Edge cases:** missing partner logo file → broken image in the strip. Long partner names in the title block wrap within the value cell.

## 4. Copy

All visible strings, by page. Voice per `brain/brands/baselocal/general-writing-guide.md`; banned-word check done (the "What we never write" column on Fig. 05 quotes banned phrases deliberately, as exhibits).

- **Screen bar:** "BaseLocal · Partner media kit — 15 pages · Print to PDF with ⌘P / Ctrl+P (pages are pre-sized, no margins needed)"
- **Punctuation rule (applies deck-wide):** em dashes are rationed per the brand writing guide. Exactly three prose instances remain, each deliberate: the "$10k to a credit card — a true story" exhibit (Fig. 05), "Your funnel, our engagement — reviewed together." (Fig. 09), and "Our readers don't need snoring explained — plenty of them sleep next to it." (Fig. 14). Component-chrome dashes ("Fig. NN — Label", "As it ran — We Got Your Back") are structural formats, not prose. Don't add more without cutting one.
- **01 Cover:** title "How a million neighbors get their morning email." · standfirst (large, the cover's only subhead) "We write, test, and scale performance campaigns inside a morning email a million readers trust." · footer: caption "Every figure in this document is measured, network-wide, and sourced." + right side "Updated June 2026 · 01". No kicker, no title block — the Title Block component appears only on the closing page.
- **02 What we do:** lede title "A curated morning email, written city by city." · body paragraphs as built (placements line: "Recommendations run inside that editorial voice, written by us and sized to whatever the story needs. **The editions are local; the campaigns aren't.** One placement runs network-wide, in every city's email, the same morning.") · panel "Eight sends a week" + Mon–Sun theme rows + "+ Tue · Top 10 weekly recap" row · footer: no caption — just source "Formats: 7xv1 daily + Top 10 weekly." + folio 02
- **03 Who reads:** hero "73% / of readers are women" + sub · traits "They have time and money" / "They read, not skim" / "They act on recommendations" with details as built · caption "The 50+ woman decides most household purchases. Most channels have no idea how to talk to her." · source "Source: BaseLocal audience demographics, 2026."
- **04 Reach:** hero "49% / Average open rate, network-wide" + sub "Measured across every edition in every city." · panel "Unique opens · trailing 30 days" (sparkline end labels MAY 12 / JUN 10) · grid: 944K Active subscribers / 30.4M Emails delivered / 403 Cities & areas / 8× Sends per week (7 dailies + Tuesday Top 10) · footer: no caption — just source "Source: BaseLocal network analytics, June 2026." + folio 04. Prose elsewhere says "a million" readers/neighbors by design (944K rounds up in voice; the exact count appears only here).
- **05 Why it works:** lede title "Readers trust the recommendations because we never spend that trust cheaply." · voice box columns "What we never write" (4 banned examples) / "What runs instead" (4 real-copy examples) · caption "The left column is banned in our style guide. Literally." · source "Source: BaseLocal general writing guide, 2026."
- **06 Edition map:** section rows Lead feature / In the news / Highlights / Inline feature 1 / Local spotlights / We got your back / Events / Inline feature 2 / City report (paid segments: 1 / 2 / 2 / 1 / 0 / 5 / 0 / 1 / 0) · legend "Editorial" / "Recommendation slots" · lede title "Editorial carries the email. Placements ride inside it." · body notes Lead Feature + Inline Features as graduation slots · footer: no caption — just source "Format: 7xv1, current placement map, June 2026." + folio 06
- **07 Slots:** six slot rows — Lead feature ("The edition's lead module, right after the masthead: one placement, the morning's marquee.") / In the news / Highlights / Inline features ("Two dedicated modules mid-edition: one in the front half, one in the back.") / We got your back / Top 10 weekly — role tags: Scale ×4, Pilot (WGYB), Scale (Top 10 weekly) · caption "Pilots start small on purpose. Winning angles earn the louder slots." · source "Placement inventory, June 2026."
- **08 Campaign anatomy:** three ladder cards (Send 1 · The stakes "Heads up for pet parents" / Send 2 · The story "Nothing prepares you for a pet emergency" / Send 3 · The why "Pet parenting is more expensive than ever") with verbatim copy excerpts · bracket "One story, three angles, readable in any order. All copy written in-house, by us." · caption "Each send adds fuel to the same story, in whatever order the week deals it." · source "Campaign: Spot Pet Insurance, 2026. Copy verbatim."
- **09 Pilot flow:** stages "3–5 variations enter the pilot slot" / "1–2 winners emerge" / "Each winner runs 2–3 more times" / "Both sides read the results" with details as built · outcomes "Test more variations" (+ "↺ Returns to Stage 01") / "Winners graduate to higher-volume slots" / "We stop" · caption "The pilot risks one slot for one week. The decision is made on evidence, together."
- **10 Scoreboard:** title "Indexed to the pilot's median click-through" · five rows V1–V5 with verbatim lead-ins, multipliers 1.4× / 1.4× / 1.0× / 0.8× / 0.15×, downstream notes, tags Advanced / Advanced / Retired / Retired / Killed · footnote "The winning angle re-ran 20 more mornings, Feb–Mar, and click-through held. Rates indexed to the pilot median; absolutes shared in partner conversations. Source: Spot pilot, We Got Your Back placements, Dec 2025 – May 2026." · downstream cells use middots ("Strong · best conversion volume in the pilot") · caption "The 9× spread between the best and weakest angle is why we never run one version of anything."
- **11 Case · Privacy & data brokers:** lede title "Some offers need more than a few sentences." · quote tag "As it ran — We Got Your Back" + verbatim data-brokers excerpt · steps "The curiosity hook" ("A short item in the edition…") / "The explainer, in our voice" / "The reader arrives pre-sold" · logo strip label "Active & recent partners"
- **12 Case · Home warranty:** head meta "Tuned for the close, not the click" · lede title "Some placements read like advice." · verbatim "$12k HVAC bill" excerpt · rail: The angle "A factual contrast, not a pitch" / The register ""In case you didn't know…"" / The trade "Fewer clicks, better clicks" · logo strip
- **13 Case · TribeTokes:** head meta "Retail · two campaigns, one great offer" · lede title "Retail works when the offer is real." (lede leads with the free-bottle-with-any-purchase offer) · verbatim "Sleep gummies are free this week" excerpt · rail: The offer "Genuinely worth recommending" ("A free bottle with any purchase. When the deal is this good, honest copy is the whole job.") / The match "Proof picked for this audience" (73% women, most 50+) / The outcome "A hit, twice" ("1,200+ unique clicks in a single morning, strong enough that a second campaign followed.") · logo strip
- **14 Case · SnoreStop:** head meta "Health · six weeks, 33 runs" · lede title "The best offers solve a problem the reader went to bed with." · verbatim "Two sprays before bed, no more snoring?" excerpt (truncated before the discount line) · rail: The problem "Nightly, unsolved, familiar" ("Everyone knows this one. The copy spends zero words proving it exists.") / The angle "Simpler than everything they've tried" ("Mouthpiece, CPAP, nose strips: tried them all. Thirty years on the market does the safety work.") / The run "Thirty-three mornings, no fatigue" ("17,000+ unique clicks across six weeks, still running at our last count.") · logo strip
- **15 Close:** lede title "Start with a pilot. Decide with evidence." · body opens with the positioning beat "Most newsletter advertising is built on one-off sends. We're built the other way: the pilot exists to find offers worth running for the long haul." then "Deal structures are flexible: flat sponsorships, performance, hybrids…" · no contact line (the deck is hand-delivered; the sender is the contact) · info block: The goal "Partners, not one-off advertisers" / First step "A pilot: one slot, one week" / Creative "Written by BaseLocal, approved by you" / Structures "Flat, performance, or hybrid" / Reporting "Shared numbers, both directions" · caption "If the pilot works, your offer becomes something we genuinely recommend." **Positioning rule:** the partners-not-advertisers contrast is stated exactly once, here; earlier pages prove it structurally (pilot loop, run counts, partner vocabulary) and must not restate it.

## 5. Data requirements

All figures are hand-placed (no live wiring). Sources and refresh procedure:

| Figure | Value in deck | Source | Refresh before partner use |
|---|---|---|---|
| Active subscribers | 1.0M (1,005,515) | `engaged_audience_daily` latest row, `development-newsletter-cluster` (data through 2026-06-24); confirmed by Corry 2026-07-14 | Refreshed for July 2026; re-verify before each future send-out |
| Avg open rate | 49% | 49.4% per-send average, `analytics_email_metrics` trailing 30d (send_date > 2026-05-25), same cluster | Same. Weighted (unique_opens ÷ delivered) is 48.1% — deck uses the per-send average |
| Emails delivered / 30d | 31.9M | SUM(delivered) trailing 30d, same query window | Same |
| Cities & areas | 510 | COUNT(DISTINCT location_id) sent to in trailing 30d, `analytics_email_metrics` | Methodology changed 2026-07-14 (old 403 was an all-time snapshot count that no longer reproduces); confirmed by Corry |
| Sends per week | 15× (7 morning editions + 7 evening editions + Tue Top 10) | Corry, 2026-07-14 (was 8× before evening editions) | Fig. 02 schedule panel + Fig. 04 stat grid |
| Sparkline shape | illustrative (axis labels May 26 – Jun 24 match the stats window) | — | Replace with real daily series or keep clearly illustrative |
| Scoreboard multipliers | 1.4 / 1.4 / 1.0 / 0.8 / 0.15× | `monetized_placements` per `offer_copy_id` for offer "Spot - AdsByMoney"; per-row CTR averaged per variant, indexed to pilot median | Yes — and verify variant→row mapping |
| "Re-ran 20 more mornings" | 20 runs Feb 16 – Mar 21 | same table, copy_id 330 | Yes |
| "Zero tracked conversions" (V5) | copy_id 397, 0 conversions | same table | Yes — confirm conversion event definition for this offer |
| TribeTokes outcome | 1,272 unique clicks, single send 2026-04-18; "a second campaign followed" | `monetized_placements`, offer "TribeTokes - Linkby (CBD Gummies)" + Corry (two campaigns total) | **TribeTokes-specific caveat: the conversions column mirrors clicks for this offer — there is no true conversion data. Never cite TribeTokes conversions.** Deck cites clicks only. The offer (free bottle with any purchase) is the documented success driver. Second campaign isn't in the May 14 snapshot — locate or confirm its numbers before quoting anything beyond "a second campaign followed" |
| Home warranty case | qualitative only (no figures in deck) | `copy-examples/we-got-your-back/home-warranty.md` ("lower CTR, converts well") | Quantify from placements data if the partner asks |
| SnoreStop run | 33 placements, 17,768 unique clicks, 2026-04-02 → 2026-05-14 ("still running at our last count") | `monetized_placements`, offer "SnoreStop - GiddyUp" | Yes — campaign was live at snapshot end; refresh run count/clicks and re-check the "still running" claim |
| Placement map (Fig. 06–07) | 12 paid slots across 9 sections | June 2026 placement structure (per Corry, this session) | Confirm against the live format spec when `7xv1.md` is updated |
| Audience 73% / 50+ | brand guide | `brain/brands/baselocal/brand-guide.md` | Confirm current source |

**Query caveats (updated 2026-07-14):** network stats now pulled from `development-newsletter-cluster` (freshest dev clone; data through 2026-06-24). `corry-newsletter-cluster` has data through 2026-06-11. The `monetized_placements` table **no longer exists in any dev clone** (schema migrated) — case-study figures are frozen as documented and can't be re-derived without the Analyst's access path. Production is `prod-acct-newsletter-cluster` in the prod account (378131232780); its Data API is enabled but the `baseiq-prod` ReadOnly role is still denied `rds-data:ExecuteStatement` (verified 2026-07-14). Never include internal economics (RPS, LTV, CAC, CPL, revenue, validation rates, per-location costs) in any partner-facing version.

## 6. Payment / external integrations

None. The deck contains no links.

## 7. Open questions

1. **Partner logos** come from `previews/baselocal/assets/partner-logos-media-kit/` (20 logos, supplied by Corry June 2026), five per case page, grouped thematically: Fig. 11 privacy/services (Incogni, AARP, T-Mobile, Progressive, Fridays), Fig. 12 home/insurance/finance (American Home Shield, Lemonade, American Hartford Gold, Spot, Simple), Fig. 13 retail/beauty (Sephora, CVS, Laura Geller, Keranique, Timberland), Fig. 14 health (SnoreStop, Hers, Hume Health, MedVi, Remedy). Remaining open item: confirm permission to show each logo in a distributed PDF.
2. **No contact path in the deck** — removed by design (the deck travels with outreach, so the sender is the contact). If it's ever published somewhere standalone, a contact line needs to come back.
3. **Partners named publicly?** The deck names Spot Pet Insurance, TribeTokes, and SnoreStop, and quotes real placement copy and performance. Confirm all three are OK being case studies (or anonymize). The home-warranty case names no partner — keep it that way unless one signs off.
3b. **CBD category optics** — TribeTokes is a CBD/CBN product. Confirm the team is comfortable leading retail with that category in a partner-facing deck; the Laura Geller or titanium-cutting-board examples are swap-in alternatives from the archive.
3c. **`7xv1.md` in brain is stale** — it still documents the old Intro/Lead Sponsor structure and "0–2" Highlights. The new placement map (Lead Feature, Inline Features 1–2, fixed counts) should be written back to `brain/brands/baselocal/newsletters/email-formats/7xv1.md` by whoever owns that doc.
4. **"Conversions" definition** varies by offer payout event (CPC/CPL/CPA). Verify what V1's "best conversion volume" and V5's "zero tracked conversions" mean for those specific offers before a partner can ask.
5. **Stats refresh process** — who re-runs the queries and updates the deck before each send-out? Candidate: a small checklist in this folder, or Analyst-role ownership.
6. **Editorial ratio claim** ("two-thirds editorial") is computed from the placement map by item count; confirm it holds across daily themes before leaving it in.
7. ~~PDF generation~~ — resolved. `baselocal-partner-media-kit.pdf` lives in this folder and regenerates with the one-liner in §8. After publishing, it's downloadable at the stable URL `https://base-iq.github.io/previews/baselocal/prototypes/partner-media-kit/baselocal-partner-media-kit.pdf`.

## 8. Updating this deck over time

This folder is the whole project: `index.html` (all 15 pages, one file) + this spec. To update in a future session, say **"iterate on the baselocal partner-media-kit prototype"** — the `iterate-prototype` workflow resolves everything from here.

**Per-edit rules (any session):**
1. Edit `index.html` locally; the local URL picks it up. Don't push until told to publish. Publishing overwrites the same GitHub Pages URL — links already sent to partners stay valid.
2. Update the matching section of this spec **in the same edit batch**.
3. After any copy change, check page overflow (every `.page-inner` must have `scrollHeight ≤ clientHeight`) and do a print preview — page-break drift is the main regression.
4. Style guards: em-dash budget (three prose instances, named in §4 — don't add without cutting), banned-word grep (`general-writing-guide.md` list), partners-not-advertisers stated once (Doc. 15 only), one figure per page.
5. New components or token changes go through `extend-design-system`, never invented inline.

**Stats refresh checklist (before any partner send-out):**
1. `aws sso login --sso-session baseiq` (12h sessions).
2. Data lives in Aurora. **`database.md` in brain is stale on access** — there is no shared production cluster in the dev account anymore. Dev clones (profile `baseiq-dev`, Data API enabled, database `newsletter`): `development-newsletter-cluster` + secret `development/newsletter/db-credentials` is the freshest shared clone (data through 2026-06-24 as of the July 2026 refresh); `corry-newsletter-cluster` + `corry/newsletter/db-credentials` runs through 2026-06-11. Clusters auto-pause — retry `DatabaseResumingException` for a minute or two. True production is `prod-acct-newsletter-cluster` in the prod account (378131232780); its Data API is enabled and a `prod-acct/newsletter/readonly-credentials` secret exists, but the `baseiq-prod` ReadOnly role is denied `rds-data:ExecuteStatement` (verified 2026-07-14) — so a truly current refresh needs either a refreshed clone or the Analyst role's access path.
3. Re-run and update (values live on pages 04, 10, 13, 14 and in §5's table): network subscribers + engagement (`engaged_audience_daily` latest row, `analytics_email_metrics` trailing 30d). Case-study figures (Spot per-variant CTRs, SnoreStop, TribeTokes) were derived from `monetized_placements`, which **no longer exists in the clones** — those figures are frozen as documented (kept as-is in the July 2026 refresh, per Corry); re-deriving them needs the Analyst's access path. TribeTokes: clicks ONLY — see §5 caveat.
4. Update the "Updated {Month Year}" line on the cover and the Window row on Doc. 15 isn't dated — only the cover needs the date bump.
5. Wide-format logos: new logo files go in `previews/baselocal/assets/partner-logos-media-kit/`; the strip handles mixed aspect ratios (height 2.4cqw, max-width 8.5cqw, contain).

**PDF export (after every content change, before publish):**

```bash
cd ~/Documents/GitHub/previews/baselocal/prototypes/partner-media-kit
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="baselocal-partner-media-kit.pdf" \
  "http://localhost:8000/baselocal/prototypes/partner-media-kit/"
```

Then confirm 15 pages and spot-check the cover and any page that changed. The PDF is committed alongside the HTML, so the GitHub Pages URL `…/partner-media-kit/baselocal-partner-media-kit.pdf` always serves the latest export. A stale PDF next to fresh HTML is the failure mode — regenerate as part of every publish.
