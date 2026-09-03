# News Updates Header — Exploration Board

**Brand:** BaseLocal
**Feature slug:** `news-updates-header`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/news-updates-header/](https://base-iq.github.io/previews/baselocal/prototypes/news-updates-header/)

---

## Goal

Exploration board — not a buildable feature spec. Ten variations of the top block (utility line + masthead) for the **News Updates** second-send format (the afternoon companion to the 7×v1 morning roundup), each rendered in a desktop frame (670px email) and a mobile frame (375px). Goals: (1) shrink the schedule/upgrade utility line, (2) merge the date + update number into the masthead to cut header height, (3) make the send read as a sibling of the morning roundup.

Once a direction is picked, the winning header gets folded into the News Updates format spec (`brain/brands/baselocal/newsletters/email-formats/`) and this board is retired.

## Fixed copy across all variations

- Utility line: `Prefer fewer emails? Choose your schedule. Upgrade.` — **only "Upgrade" is a link** (to the Insiders' Club upsell); the rest of the line is plain text.
- Tagline: `All the news we can't fit in the morning roundup` — **required in every variation** (round-1 feedback).
- Sample meta: Traverse City · Wednesday, July 1 · Update No. 12

## Round 2 — surviving variations

Round-1 feedback: only 1, 5, and 7 survived; the tagline "All the news we can't fit in the morning roundup" is required in every direction. Current board:

1. **Folio rule · refined** — city/date/number in one hairline-ruled row above the title; micro utility line on the paper. Round-2 fix: more air between folio and title, and the tagline closes the masthead with its own hairline + a full beat of space before the lead-in.
5. **Single-row lockup · with the tagline** — title left, meta right, tagline tucked under the row inside the lockup; the 2px ink rule closes the masthead.
7A. **Left-anchored editorial · polished** — terracotta kicker, title left; the round-1 floaty italic meta becomes a stacked small-caps block (date over terracotta update number) seated on the title's baseline.
7B. **Left-anchored editorial · folio hybrid** — title + tagline as one left-anchored lockup; date + update number drop into their own hairline folio row below.

Killed in round 1: meta-flanks-title, morning-edition match (no H1), update stamp, dateline-in-tagline, utility ribbon, companion banner, no-masthead.

All variations use only Newsletter Component tokens (Paper `#FAF6F4`, Ink `#2C2421`, Accent `#C2604A`, Muted `#6B6258`, Hairline `#EDE6E1`; Bitter/Lato).

## Open questions

- Which direction wins (or which hybrid)? Board exists to answer this.
- Email-client fidelity: variations use flexbox for layout; the production version must be rebuilt with email-safe tables/inline styles in the sending platform.
- Should the utility line appear in *every* News Updates send, or only for free-tier readers?
- Does "Update No. N" reset per city or count globally? Copy assumes per-city.
- The winning masthead should be added to design-system.md § Newsletter Components via `extend-design-system` before the format ships.
