# BaseLocal's Best (Business Directory) — SEO Page Template Spec

**Brand:** BaseLocal
**Page-type slug:** `directory`
**Prototype:** [https://base-iq.github.io/previews/baselocal/seo/directory/](https://base-iq.github.io/previews/baselocal/seo/directory/)

---

The SEO-first rebuild of the business directory (product design: the `business-spotlight` prototype — self-serve pins, editor curation, 8 fixed categories). That version rendered every listing client-side from JS constants with no schema, no canonical, and no crawlable category URLs; this rebuild makes the directory an indexable, **linkability-first** surface while keeping the product mechanics (Pinned Zone, Slot CTAs, editor curation) intact. Files: `index.html` (Tacoma root), `eat-drink/index.html` (category instance with expandable listings), `styles.css`. In the prototype, every category-index row links to the one built category instance; production links each row to its own category URL. All components per `brain/brands/baselocal/design-system.md`, including the two added for this template (Directory Changelog § 5.8, BaseLocal's Best Badge § 5.9) and the location-bar shell shared with the city hub.

## 1. Goal & target queries

**The honest scope:** category head terms ("best restaurants tacoma") are aggregator-locked and explicitly out of strategy. The directory's SEO jobs, in priority order:

1. **The backlink engine.** Every listed business gets a stable fragment URL and the **BaseLocal's Best badge** to embed on its own site, linking back to it. At ~400 markets × dozens of listings, this is the portfolio's most scalable link-earning mechanic — links land on exactly the pages that rank.
2. **"Best {category} {city}" queries** — the page family is named in the searcher's own language (decided in iteration: surface brand is **BaseLocal's Best**, category pages are "Best places to eat & drink in {city}" etc.). Aggregators still own the biggest head terms; the realistic wins are mid-tail and markets with thin aggregator coverage, and the differentiated page (checked, changelogged, no pay-to-play) is the only version of "best" worth ranking. Plus "{business name}" / "{business name} {city}" long-tail via the rows.
3. **Internal authority:** a crawlable taxonomy (root → 8 categories → fragments) that consolidates every business mention on the site into pages that can rank, and links up to the city hub.

Intent served on-page: "a place I can trust for {need} in {city}" — answered by curation-with-receipts (editor notes, verified stamps, the changelog), not star ratings.

**Differentiation from siblings:** the city hub keeps its editorial "New in {City}" teaser (its cards link into directory fragments); dining roundups (phase 2) stay editorial pages. The directory is the comprehensive reference — the only surface that lists everything.

## 2. URL pattern & naming (decided in iteration)

- Root: `/{state}/{city-slug}/best/` — **`best` beats `directory` as the slug**: it matches the "best {x} {city}" query family and the BaseLocal's Best program. Nobody searches "directory."
- Category: `/{state}/{city-slug}/best/{category-slug}/` — exactly 8, fixed slugs from the ad-flow taxonomy: `eat-drink`, `shop`, `services`, `wellness`, `beauty`, `fitness`, `home-garden`, `kids-pets`.
- **Surface naming:** program brand **BaseLocal's Best** — carried by the badge itself, rendered in the masthead (no text kicker; decided in iteration). Location-bar / breadcrumb label **Businesses**; the word "directory" never appears in reader-facing copy. Cross-template sync: the city hub's nav label and promo module adopt this naming at publish.
- **No individual business URLs — decided.** Businesses are deep-linkable rows (`/best/{category}/#{business-slug}`), events-Tier-1 style: all authority consolidates onto the pages that rank, no thin pages, no closed-business dead weight. A fragment for a retired business lands at the top of its category page — badge embeds never dead-end.
- Canonicals self-referencing; UTM strips; on-site search results and any query-param views are never indexable states.

## 3. Title & meta templates

- **Root title:** `{City}'s Best Local Businesses, Every One Checked | BaseLocal` — drop the suffix when > 60 chars (Tacoma drops it: 49)
- **Root meta:** `The {N} best local businesses in {City}, checked by our newsletter team — restaurants, shops, and services. Updated as the city changes; pins always marked.` (Tacoma: 156)
- **Category title:** `Best {Search Phrase} in {City} — {N} Checked Spots` + ` | BaseLocal` when ≤ 60 (eat-drink drops it: 56)
- **Category meta:** `The {N} best {search phrase} in {City} — {category nouns} our newsletter checked, with the story on each one.` (eat-drink: 137)
- **Category display names chase real queries** (h1 = `The best {search phrase} in {City}`):

| Slug | Search-phrase display name |
|---|---|
| `eat-drink` | places to eat & drink |
| `shop` | local shops |
| `services` | local services |
| `wellness` | wellness spots |
| `beauty` | salons & beauty spots |
| `fitness` | gyms & fitness studios |
| `home-garden` | home & garden pros |
| `kids-pets` | spots for kids & pets |
- **OG:** standard set; og:image = the location hero (city-hub decision) until a directory-specific image exists.

## 4. Page structure

Shell: site header → **location bar** (sticky, one row: section nav left in the label register — Lato 900 uppercase, tracked — deliberately distinct from the lowercase breadcrumb below; Get-the-newsletter CTA right; current section in Espresso, non-link) → main, which opens with the **breadcrumb trail above the h1** (decided in iteration: crumbs in the bar read as a second menu and blended with it — wayfinding belongs with the content, the bar is chrome). Full trail at every width; the shell standardizes on this and the city hub adopts it at publish. Breadcrumb extends to `› Businesses` / `› Businesses › {Category}` → footer.

**Root** (one h1, no skips):

```
h1  {City}'s best local businesses
    [lede (no-stars/no-pay-to-play line) · hero badge (the BaseLocal's Best lockup alone, linking to #badge) ·
     ledger stats strip · "● Updated {date}" stamp line · Directory Changelog ("What changed this month")]  ← not headings
h2  Find a spot            → search bar + category index (8 rows: count + newest-entry line)
h2  Pinned in {City} today → Pinned Zone (≤2 pinned cards + fine print; open-slot state lives here when unsold — see § 7)
h2  List your business     → ONE business-owner section: pin pitch + primary "List your business →" button +
                             secondary "Suggest a spot — free" · then the "Already on the list?" badge panel
                             (badge renders + embed snippet + rules line, anchor #badge)
    [light subscribe block — styled heading, not an h2]
```

**Category page:**

```
h1  The best {search phrase} in {City}
    [lede ("Not a ranking; a record.") · sibling-category browse line]  ← not headings
h2  Pinned in {City} today    → Pinned Zone (persists city-wide above filtered results — product rule)
    [result meta rule bar]
    → h3 per listing (expandable rows, newest additions first) · inline Slot CTA after ~4th row
h2  Listed here?              → one line: badge cross-link (root #badge) + list-your-business cross-link (root #list)
    [subscribe block — styled heading, not an h2]
```

**Listing row (category pages):** a native `<details>` — the summary is the Directory Listing Card's three lines (name+tag / editor note / address + verified stamp), the panel follows the Event Day-List expanded-row conventions: the **newsletter story excerpt** (quoted, with "From the {City} newsletter, {date}" source line), then an action row (Website ↗ when the business has one · Copy link). Every row carries a stable slugified `id` — the fragment contract badges and newsletter links rely on; a fragment in the URL auto-opens its row (same JS mechanic as the events hub). Panel content is server-rendered — **the story excerpts are what make category pages substantial content rather than thin lists.**

**Above-the-fold contract (375px, root):** h1, lede, the hero badge row, and the ledger stats visible before scroll; the changelog within one thumb-scroll. On category pages: h1, lede, and the pinned zone before scroll.

## 5. Structured data

- **Root:** BreadcrumbList (3) + CollectionPage (`about` City, publisher Organization). No ItemList — the root renders categories, not listings.
- **Category:** BreadcrumbList (4) + **ItemList of LocalBusiness** — `numberOfItems` = the category's true count; items = the rendered listings only (schema/content match). Per LocalBusiness: `name`, `address` (PostalAddress with street where known), `description` (the editor note), `url` (the business's own site, when it has one).
- **Deliberately no `aggregateRating`/`Review` schema** — we have no ratings; the honest-curator position is structural.

## 6. Internal linking

**Out:** location bar → city hub, events, this-weekend, latest edition · root → 8 category pages (the index rows are the primary distribution) · category → root, sibling categories (browse line), city hub via breadcrumb · listings → the business's own site (`target="_blank" rel="noopener noreferrer"` — real outbound links, natural profile) · Slot CTAs and the **List-your-business CTA** (the only primary button outside search/subscribe — the page's clearest business-owner action) → the advertise flow · the free suggest-a-spot line → the submission flow.

**In:** the city hub's directory promo module + its "New in {City}" spotlight cards (deep-link to listing fragments) · newsletter business-spotlight modules → the featured business's fragment · the ad flow's "see a live directory" links · **badge embeds from businesses' own sites** → listing fragments.

**Stable anchor IDs (public API):** root `#stats`, `#changelog`, `#categories`, `#pinned`, `#badge`; category pages: one slugified `id` per listing (`-2` suffixes on collisions). Never rename after ship — badge embeds depend on them.

## 7. Data requirements

| Variable | Source | Required | Validation / missing behavior |
|---|---|---|---|
| Listing record: name, category (8-enum), one-sentence editor note, address, url, is_active | directory records (editors promote from the spotlight archive) | Yes (name, category, note) | No note → not listed (curation is the product); no url → row renders without Website action; no street address → locality-only in schema |
| Story excerpt + date | newsletter spotlight archive (~25K stories network-wide) | No | Missing → row renders unexpandable (three-line card only); rows with stories sort above rows without within the same recency band |
| Per-listing verified date | editor check timestamp | Yes | Stamp renders when checked ≤ 90 days; overdue listings surface in the editors' re-check queue, stamp shows last true date — never faked |
| Changelog entries (add / retire / re-check + editorial clause) | directory record lifecycle events; clause pipeline-drafted, QA-reviewed | Yes (root) | Latest 4–6; empty month → component omitted |
| Ledger stats (total, added this month, categories) + "Updated {date}" stamp line beneath | computed from records; the date = latest regeneration with a real record change | Yes (root) | Any unavailable stat drops its cell; never a 0 from a query error; the date is never faked forward |
| Category counts + newest lines (root index) | computed | Yes | Newest line omitted if the newest entry is > 90 days old (don't advertise staleness) |
| Pinned placements (≤2/city/day) | ads system | No | Zone renders only with ≥1 pin **or** an open-slot CTA; fine-print disclosure always accompanies the zone |
| Badge embed snippet | static template + location/category/fragment interpolation | Yes (root) | — |

## 8. Generation rules

- **Root exists when** the location's directory is live and holds ≥ 10 active listings (below: the city hub's directory module stays in teaser state and the root doesn't generate — nothing links to it).
- **Category page indexes at ≥ 6 listings.** 3–5 → renders with `noindex` (rows still reachable and deep-linkable); < 3 → not generated, its businesses render on the root under a compact "More spots" section, and the root's category-index row anchor-jumps instead of linking.
- **Retired businesses:** removed from render + schema immediately; their fragments fall back to the category top; the retirement is a changelog entry. Never a 404, never a ghost listing.
- **Update cadence:** regenerate on any record change and daily with the newsletter cycle; verified stamps and the changelog must reflect actual events — the changelog is never backfilled or padded.
- **Sitemap:** root + indexable category pages, `lastmod` = last regeneration.

## 9. States

- **Normal root** (`index.html`): full stack — hero badge row, 3-stat ledger + updated stamp, 4-entry changelog, search, 8-category index, pinned zone (1 pin + open slot shown), one consolidated List-your-business section (CTA row + badge panel), subscribe.
- **Normal category** (`eat-drink/index.html`): pinned zone, 5 expandable listings (of 86 — prototype note in-page), inline Slot CTA, badge/list cross-link line, subscribe.
- **Thin category (spec-only):** per § 8 — noindex band at 3–5, fold-into-root below 3.
- **New market:** directory launches only at the § 8 floor, so there is no "empty directory" state; until then the city hub's teaser carries the promise.
- **Search:** client-side over server-rendered rows; zero-result state offers the category index and the submit loop ("Know a spot we're missing? Tell us →"). Search never produces an indexable URL.

## 10. Open questions

1. **Category noun lists for metas** ("restaurants, cafés, bars, and markets" etc.) — editorial, write once; the search-phrase display names are decided (§ 3), confirm the noun lists.
2. **Badge asset hosting** — `baselocal.com/badges/baselocals-best.svg` (+ dark/small variants) needs a real route and cache policy; snippet in the prototype assumes it.
3. **Badge enforcement** — the spec says retired businesses lose badge rights; is there any monitoring/outreach loop, or is the fragment fallback (category top) the only mechanism?
4. **Re-check cadence** — 90-day stamp window proposed; confirm the editors' queue exists operationally (central QA, no per-market staff).
5. **Sort order** — "newest additions first" proposed for category pages (freshness surfaces, matches the changelog identity); alternative is neighborhood grouping once listings pass ~40/category. Decide before build.
6. **Story excerpt rights/length** — excerpts are quoted from our own newsletter (no rights issue), but confirm the length cap (2–3 sentences) and whether they link to a newsletter archive page when one exists.
7. **`/advertise/` routing** — Slot CTAs point at the pitch page per the business-spotlight CTA routing rule (specific → pitch, generic → fork); confirm unchanged.
8. **Naming sync** — city hub (nav label, promo module heading/copy) and the ad-flow's directory references adopt the BaseLocal's Best / Businesses naming and `/best/` URLs; the business-spotlight spec's "$10 pins you in the directory" copy needs the same pass.
