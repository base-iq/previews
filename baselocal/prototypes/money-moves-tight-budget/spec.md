# 19 Costs to Cut When Money Gets Tight — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `money-moves-tight-budget`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/money-moves-tight-budget/](https://base-iq.github.io/previews/baselocal/prototypes/money-moves-tight-budget/)

---

## Goal

A BaseLocal-branded advertorial listicle matching the format of the FinanceBuzz "money moves on a tight budget" lander that BaseIQ currently buys traffic to (`financebuzz.com/money-moves-tight-budget-yaez`). Same page mechanics — numbered savings listicle, one affiliate CTA per section, stat callouts, closing urgency block — rebuilt on BaseLocal's design system with original copy in BaseLocal's voice. Intended as a paid-native / paid-social landing page owned by BaseLocal instead of a third party.

The reference page's structure was replicated; its copy was **not** (it's FinanceBuzz's copyrighted content). All text on this page is original.

## User flow

Single screen: `index.html`. No multi-step flow.

1. Reader arrives from a paid-native ad. Header shows the BaseLocal wordmark + "Recommendations" label.
2. Hero: advertiser-disclosure link → kicker → H1 → byline → lede.
3. Intro paragraph (drop cap) sets the contract: pick one or two cuts, not all nineteen.
4. Nineteen numbered `cut` sections. Each affiliate cut ends in one primary CTA (external partner link, opens partner flow). Three "editorial" cuts (16–18) have no CTA by design — they build trust between monetized sections.
5. An inline CTA after Cut 3 offers skimmers a jump back to the fastest cut (car insurance, Cut 2).
6. Bottom CTA block repeats the car insurance offer (highest-value conversion, mirroring the reference page's closing repeat) with an anchor link back to Cut 1.
7. Disclosure block at `#disclosure`, linked from the top of the page.

## Section order and monetization map

| # | Category | Partner category | CTA label |
|---|----------|------------------|-----------|
| 1 | Credit card interest | Balance transfer card | See the balance transfer card → |
| 2 | Car insurance | Insurance comparison | Compare your rate → |
| 3 | Debt over $30k | Debt relief | See if your debt qualifies → |
| 4 | Mortgage | Refi / HELOC comparison | See today's rates → |
| 5 | Timeshare fees | Timeshare exit | Check your contract → |
| 6 | Vet bills | Pet insurance | Check your pet's rate → |
| 7 | Bank fees | Fee-free checking | Open a fee-free account → |
| 8 | Online shopping | Coupon browser extension | Add the free extension → |
| 9 | Subscriptions | Subscription tracker | Find what you're still paying for → |
| 10 | Gutter cleaning | Gutter guards | Get a free gutter estimate → |
| 11 | The roof | Roofing quotes | Book a free roof inspection → |
| 12 | Home security | Security systems | Price a system → |
| 13 | Appliance repairs | Home warranty | Get a warranty quote → |
| 14 | Drafty windows | Window replacement | Price new windows → |
| 15 | Membership discounts | AARP affiliate | See the member discounts → |
| 16 | Coffee run | — editorial, no CTA | — |
| 17 | Lottery tickets | — editorial, no CTA | — |
| 18 | Premium gas | — editorial, no CTA | — |
| 19 | Phone plan | MVNO comparison | Compare phone plans → |
| — | Closing block | Car insurance (repeat of #2) | Compare your rate → |

Ordering is by approximate money at stake, with the roof (11) deliberately placed mid-list and framed as "the one homeowners keep skipping" — the honest version of the reference page's "#11" curiosity hook.

## States

Static content page. No forms, no client JS.

- **Default:** all content server-rendered / static.
- **Anchor states:** `#cut-1` … `#cut-19`, `#disclosure` are stable anchors used by in-page links (and available to ad variants for deep-linking).
- **Reduced motion:** smooth scrolling and button transitions collapse under `prefers-reduced-motion: reduce`.
- **Error/empty/loading:** n/a (static page). Partner-side states live on partner pages.

## Copy

All visible strings are final in `index.html` and written to `general-writing-guide.md`. Key strings:

- **H1:** "19 costs to cut when money gets tight"
- **Lede:** "Prices climbed faster than paychecks again this year, and the hard part isn't wanting to trim. It's knowing which line items give real money back. We went through the budget the way we'd go through our own and found nineteen."
- **Byline:** "By the BaseLocal team" / "Updated July 2026 · 9 min read"
- **Stat callout label:** "Worth knowing" (replaces the reference page's "DID YOU KNOW?" register)
- **Closing block:** "Start with the two-minute one" / "Car insurance comparison is the fastest cut on this list. Everything else can wait until tomorrow."
- **CTA labels:** see monetization map above. All verb-led with trailing `→` per design-system button rules; never "Click here".
- **Post-CTA notes** (cuts 1, 3, 6) carry compliance-adjacent caveats in calm register.

## Data requirements

None client-side. Production needs per section:

- Final partner + tracked affiliate URL for each of the 16 monetized CTAs (all currently `href="#"` placeholders).
- Verified figures for the two stat callouts and all in-copy dollar claims (each flagged with an "Illustrative figure — verify" source line or listed in Open questions). BaseLocal's honesty rule: no figure ships unverified.
- UTM/clickid passthrough convention for outbound partner links (mirror the inbound campaign parameters used on the current FinanceBuzz buy).

## Payment / external integrations

None on-page. All conversions happen on partner sites via affiliate links.

## Open questions

1. **Partner list.** Which partners does BaseIQ actually have affiliate relationships with for each of the 16 monetized categories? Sections without a live partner should be converted to editorial cuts (like 16–18) or removed — dropping the count from 19 accordingly.
2. **Affiliate URLs + tracking.** Placeholder `#` links need tracked partner URLs, `target="_blank" rel="noopener noreferrer sponsored"`, and outbound click tracking.
3. **Unverified figures.** $1,200 avg timeshare maintenance, ~60¢/dollar lottery return, ~$470/yr premium-gas figure, $1,500/yr latte math, roof repair vs. replacement costs, insurance savings claim, balance-transfer intro window length ("well past a year"), AARP price ("under $20"). Verify or soften each before launch.
4. **Headline variant.** The reference page uses a curiosity-gap headline ("Most People Ignore #11"). Current H1 is the honest-voice version; a softer hook variant (e.g. appending "— starting with the one nobody checks") could be A/B tested if it clears the brand's no-clickbait bar.
5. **Hero image.** The reference page leads with a photo. Brand photography rules require real editorial imagery (no stock); omitted from the prototype. Decide whether the paid-native placement needs one.
6. **Compliance review.** Credit card, debt relief, and insurance sections typically require partner-approved language (APR ranges, "rates and fees" links, debt-relief disclaimers). Current copy is intentionally range-free where possible; partner contracts may require specific disclosures.
7. **Geo-personalization.** BaseLocal is a local brand; the reference page is national. Should city name / local framing be injected (e.g. via query param) to match brand positioning, or does this page intentionally run brand-lite for cold traffic?
