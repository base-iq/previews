# 12 Bills Worth a Second Look — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `bills-second-look`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/bills-second-look/](https://base-iq.github.io/previews/baselocal/prototypes/bills-second-look/)

---

## Goal

BaseLocal's evergreen newsletter monetization article: a 12-item "bills read-through" listicle housing the network's highest-payout offer categories (insurance, finance, home services) behind a native, curator-voice frame — "the twelve we re-check every year." One stable URL the daily newsletter can tease repeatedly with rotating angles, multiplying placement inventory beyond per-send slots.

## Page structure

Header structure mirrors the live advertorial at `baselocal.com/tibo-titanium-cutting-board/`:

1. **Site header:** brand lockup (wordmark · divider · "Advertorial" tag) left; "Advertiser disclosure" dotted-underline button right, opening a popover dialog (standard advertiser-disclosure text, close on ✕ / outside click / Escape).
2. **Front matter:** dateline ("Updated July 2026") → H1 → hero illustration, all with staggered `fadeInUp` entrance.
3. **Hero illustration:** custom inline SVG — terracotta scissors mid-cut through a paper bill, severed half dropping, two more bills tilted in the stack behind. Brand palette only (cream field, espresso ink, terracotta blades). `role="img"` + aria-label. Caption: "The annual read-through: twelve bills, one Saturday morning."
4. **Intro:** exactly one paragraph (two sentences) framing the read-through.
5. Twelve numbered sections, then closing, then disclosure block.

## Copy style rule

FinanceBuzz cadence, BaseLocal voice: **every paragraph is capped at two sentences; one is fine.** No paragraph in the body may exceed two sentences. Headers carry their own numbers ("1. The car insurance renewal you stopped reading"); there are no eyebrow labels above headers.

## Link pattern (no buttons)

Monetized sections contain **exactly two text links** and zero buttons:

1. **Inline link** — partner name linked inside the first or second paragraph (primary-link style: terracotta, bold, underline on hover).
2. **End link** — a standalone bold `cta-text` line closing the section, verb-led with trailing `→` (e.g. "Compare your rate before renewal →").

Editorial sections (8, 9, 11, 12) have no partner and therefore no links — they're the trust breaks. All partner links get `target="_blank" rel="noopener noreferrer"` (add `sponsored` at production).

## Section order and monetization map

| # | Anchor | Bill | Partner | End-link text |
|---|--------|------|---------|---------------|
| 1 | `#bill-1` | Car insurance | Progressive | Compare your rate before renewal → |
| 2 | `#bill-2` | Credit card interest | *TBD (balance transfer)* | See balance transfer cards → |
| 3 | `#bill-3` | Home & renters insurance | Lemonade | Get a new home quote → |
| 4 | `#bill-4` | Phone plan (55+) | T-Mobile | See the 55+ plans → |
| 5 | `#bill-5` | Home warranty | American Home Shield | Price a warranty plan → |
| 6 | `#bill-6` | Bank fees | *TBD (fee-free checking)* | Open a fee-free account → |
| 7 | `#bill-7` | Pet insurance | Spot | Check your pet's rate → |
| 8 | `#bill-8` | Internet | — editorial, no links | — |
| 9 | `#bill-9` | Streaming | — editorial, no links | — |
| 10 | `#bill-10` | Prescriptions / 50+ discounts | AARP | Browse the member discounts → |
| 11 | `#bill-11` | Electricity | — editorial, no links | — |
| 12 | `#bill-12` | The gym | — editorial, no links | — |
| — | closing | Car insurance repeat | Progressive | Start with the two-minute rate check → |

Partner logos render via `../../assets/partner-logos-media-kit/{file}.png` for Progressive, Lemonade, T-Mobile, AHS, Spot, AARP, placed directly under the section header.

## Newsletter integration

- Every section has a stable anchor (`#bill-N`) so sends can tease one bill and deep-link it.
- Suggested tease rotation: lead with a different bill each week; seasonal fits (electricity in summer, gym in January).
- Evergreen page; refresh figures and offer terms quarterly.

## States

- **Disclosure popover:** closed by default (`hidden`); opens via header button (`aria-expanded` synced); closes via ✕, outside click, or Escape (focus returns to button). Only client JS on the page.
- **Hero entrance:** dateline → H1 → illustration stagger at 0/80/160ms; collapses under `prefers-reduced-motion`.
- **Anchors:** `#bill-1`…`#bill-12`, `#disclosure`.
- Error/empty/loading: n/a (static page).

## Copy

Final strings in `index.html`. Register: calm curator, zero urgency devices. Key strings:

- **H1:** "12 bills worth a second look before the year ends"
- **Dateline:** "Updated July 2026"
- **Intro:** "Bills have a talent for going invisible… Below are the twelve we re-check every year, ordered by how much money tends to be hiding in each."
- **Stat callout label:** "Worth knowing" (one instance, Bill 4)
- **Closing:** "Pick one bill. Do it today." / "The whole list is a Saturday morning, but nobody needs the whole list."
- Link-text rotation: Compare / See / Get / Price / Open / Check / Browse.

## Data requirements

- Tracked affiliate URLs for the 8 monetized sections × 2 links each (all currently `#`).
- Verification of flagged figures: 55+ plan savings ($30–$45/mo), retention-call savings ($20–$30), off-peak utility savings (10–15%), AARP price (under $20/yr).

## Payment / external integrations

None on-page; conversions happen on partner sites.

## Open questions

1. **Balance transfer + checking partners** — Bills 2 and 6 have no confirmed partner. Confirm or convert to editorial (and retitle from "12 bills" if the count changes).
2. **Partner logo permissions** — confirm each partner allows editorial-context logo use.
3. **Figure verification** — all flagged numbers need sourcing before launch per the brand hype rule.
4. **Compliance language** — Progressive/Lemonade/T-Mobile may require specific disclaimers; the card section needs issuer-approved terms once a partner is chosen.
5. **Inline vs. end link tracking** — should the two links per section carry distinct sub-IDs so click position (in-copy vs. end-of-section) is measurable? Recommended.
6. **Geo variants** — inject city name into the intro/tease, or run brand-lite? Decide network-wide.
