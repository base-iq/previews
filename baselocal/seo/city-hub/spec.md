# City Hub — SEO Page Template Spec

**Brand:** BaseLocal
**Page-type slug:** `city-hub`
**Prototype:** [https://base-iq.github.io/previews/baselocal/seo/city-hub/](https://base-iq.github.io/previews/baselocal/seo/city-hub/)

---

This is the upgrade spec for the existing `/{state}/{city}/` template — the taxonomy root for every market and the highest-intent, cheapest cluster in the strategy (cluster 3). It targets the subscribe-intent query `{city} newsletter`, where the "Daily {City}" clone network currently outranks BaseLocal's own city pages in several markets. Their page is a naked subscribe wall (headline + email field, real content teased behind "subscribe to read"); this template beats it by proving the product **on the page** — a citable stat dashboard, a sample of the week in the newsletter's own voice, and vetted new-spot spotlights — so the page satisfies the searcher, earns links, and converts, all without gating anything.

Files: `index.html` (Tacoma, WA — a normal week) and `styles.css`. Thin-market and new-market behavior is specified, not demonstrated — see the launch-mode callout (§ 7) and States (§ 9). The stylesheet shares its tokens and the Breadcrumbs / Stat Grid / curated-pick / Site Header / Site Footer treatments with the sibling **events-hub** prototype, plus Directory Listing Card and Slot CTA — all from `brain/brands/baselocal/design-system.md`. In the prototype, cross-cluster links are absolute `https://baselocal.com/...` clean URLs (they resolve to the live site); the events-hub and slice pages this hub links down to are specced separately.

## 1. Goal & target queries

**Primary:** `{city} newsletter`, `{city} {state} newsletter` — navigational, subscribe-intent ("I want my city's daily newsletter"). **Secondary (discovery that lands here):** `{city} local news`, `things to do in {city}` (broad), and brand-adjacent `daily {city}`. Head-term event queries (`{city} events`) are **not** this page's job — they belong to the events hub, which this page links down to.

Intent: subscribe-intent first. The page must (a) prove the newsletter is worth an email address before the fold, and (b) be genuinely useful on-page — a real city reference — so it earns links and satisfies the discovery searcher who didn't come to subscribe. It sits at the top of the city taxonomy: breadcrumb parent of the events hub and every slice/guide beneath it.

**Differentiation from the events hub (decided in iteration):** the two templates must not share surfaces. The events hub owns the comprehensive day-by-day timetable, the expandable event rows, the farmers-market reference table, and all `Event`/`ItemList` schema. The city hub's "This week" section is 3–5 **curated picks written in newsletter voice** — a sample of the product, which is exactly what a subscribe page should show — and each pick deep-links to its row's fragment on the events hub (three-tier model: one-off events never get their own URL). An earlier draft duplicated the timetable, the markets table, and the Event schema here; all three were removed as near-duplicate surfaces competing with this page's own child.

## 2. URL pattern

`/{state}/{city-slug}/` — lowercase kebab-case, trailing slash, apex host. E.g. `/wa/tacoma/`.

Canonical rules: self-referencing canonical on every instance; query strings (`?utm_module=...`) always canonicalize to the clean URL; the `www` host 301s to apex (audit tasks 1–2, **shipped** — verified live 2026-07-21). This is the taxonomy root — it does not itself have a state-level parent page today (`/wa/` 404s; audit finding #15 is an open taxonomy decision, tracked there, not here).

## 3. Title & meta templates

- **Title:** `{City} Newsletter — Local News & Events, Daily | BaseLocal`
  - Drop the ` | BaseLocal` suffix when the whole string exceeds 60 characters. Tacoma renders at 58 chars, Shelton at 59 — both keep the suffix.
  - The word "Newsletter" is deliberately first-after-city: it is the exact head of the target query. This replaces the current generic `{City}, {ST} | BaseLocal` title (verified live on `/wa/tacoma/` 2026-07-21 — the events title fix from the audit did not extend to hubs).
- **Meta description:** `Wake up to what matters in {City}. The free morning newsletter {N} neighbors read for local news, the week's best events, and picks worth your time.`
  - `{N}` = the market's subscriber count (rounded, see § 7). Target 140–160 chars; Tacoma = 151. If a long city name pushes it over, drop the trailing clause "and picks worth your time."
  - **Launch-mode variant** (market below the count-display threshold, § 7): `Wake up to what matters in {City}. Just launched — the free morning newsletter for {area} news, local events, and spots worth your time.` A small subscriber number is never published; newness is framed as the draw.
- **OG:** og:title (title minus brand suffix), og:description (= meta), og:url (= canonical), og:type `website`, og:site_name `BaseLocal`, og:image = the **location hero image** (below; brand-logo fallback when the location has none). Fixes audit finding #11 (no OG anywhere) for this template.

## 4. Page structure

Landmarks: `header` (site header — logo, Locations, Advertise) → **location bar** (two `nav`s in one band: breadcrumb + location sections) → `main` → `footer` (site footer). Heading outline (one h1, no skips; day labels, stat labels, and the freshness stamp are **not** headings):

```
h1  The {City} newsletter
    [lede · location hero image with Stat Grid overlapping its bottom edge · provenance line · primary subscribe]  ← not headings
h2  This week in {City}              → h3 per curated pick (3–5, newsletter voice, deep-linked to events-hub rows)
h2  New in {City}                    → h3 per spotlight (Directory Listing Cards) · Slot CTA   ← conditional
h2  The {City} business directory    → (promo module: value line, category chips, directory link)
h2  Most read in {City}              → h3 per story (top 5 by reader clicks, external sources)  ← conditional
h2  Explore {City}                   → (internal-link cards: down-links + nearby cities)
h2  Get tomorrow's {City} newsletter → (closing subscribe block)
```

**No FAQ section and no about line (decided in iteration).** An earlier draft carried a four-question FAQ + `FAQPage` schema; both were removed — Google restricted FAQ rich results to government/health sites in 2023, and every answer duplicated what the page already shows (free → lede + fine print; cadence → provenance line; what's in it → the picks). A one-line about/trust replacement was then also cut as filler. Brand-trust content lives at `/about/` (linked from the footer), not on this template.

**Directory module.** Promotes the business directory (see the `business-spotlight` prototype spec — per-location, editor-curated, paid pins always disclosed), which ships before or with this template. **Live state (default, shown on `index.html`):** one value line, the 8 fixed category chips (Eat & drink / Shop / Services / Wellness / Beauty / Fitness / Home & garden / Kids & pets — same taxonomy as the ad flow; decorative until category URLs exist, see Open questions), and a "Browse the {City} directory →" link to the location's directory URL. **Fallback state (spec-only):** where a location's directory isn't yet live or populated, the link is replaced by a "readers hear first" line anchoring to `#subscribe` — nothing on the page may link to a URL that would 404.

**Location bar (decided in iteration — replaces the current site's Overview/Events/Latest-edition/Subscribe tabs).** A single band under the site header serving as the location's persistent navigation shell, shared by every location surface (city hub, events hub, slices, directory, latest edition). Left: the breadcrumb trail (`BaseLocal › {City}, {ST}`) — the trail's terminal doubles as the "Overview/you are here" marker, so no separate Overview tab exists, and the visible trail keeps the BreadcrumbList schema honest. Right: section links — **Events · This weekend · Directory · Latest edition** — rendering only surfaces that are live for the location (Shelton shows Events · Latest edition; no this-weekend slice below its generation threshold, no unpopulated directory) — followed by the **"Get the newsletter" CTA button**. The CTA lives here, not in the site header, because subscribing is a per-location action (you join {City}'s newsletter); the sitewide header stays location-agnostic (logo · Locations · Advertise) and identical across the whole site. On the child surfaces, the breadcrumb extends (`… › Events`) and the current section renders bold non-link (`aria-current="page"`). Links wrap on mobile — never horizontal scroll. **The bar is sticky on this template** (`position: sticky; top: 0`; ~57px desktop): it is the page's action bar, keeping section navigation and the subscribe CTA one tap away through a ~5-screen scroll. On narrow viewports it compacts to two rows (~84px): the trail collapses to the bold location name beside the CTA (the full `BaseLocal ›` trail returns at 601px+; BreadcrumbList schema is unchanged), with section links on the second row — all four fit one line at 375px. Production adds the design system's `.is-stuck` warm shadow (Sticky Filter & Utility Bar convention); in-page anchors carry `scroll-margin-top` to clear the pinned bar. **One-sticky-bar rule:** a template pins at most one bar — on the events hub the filter bar keeps the sticky slot and this location bar stays static there. This shell is a cross-template requirement: the events hub and directory adopt the same bar (supersedes their standalone breadcrumb rows) — coordinate via the publishing-infrastructure internal-linking requirement (strategy item 7). the h1 is `The {City} newsletter` — sentence case, aligned to the head of the target query. The city/state entity is carried by the breadcrumb immediately above, the title, and the schema; there is no kicker (a `{City}, {ST}` eyebrow duplicated the breadcrumb verbatim and was removed in iteration). A bare `{City}, {ST}` h1 was likewise rejected: it reads as a directory label and answers the subscribe-intent query with a map pin.

**Above-the-fold contract (375px):** the h1, the one-line lede, the hero photo, and the Stat Grid overlapping it are visible before scroll; the provenance line and primary subscribe block sit within one thumb-scroll, and the location bar's "Get the newsletter" CTA keeps subscribe one tap away at all times. Order is deliberate: lead with proof (the dashboard) per the chosen "living dashboard" direction, then ask — the opposite of the competitor's ask-first wall, but with the ask never more than a scroll away.

**Masthead composition (decided in iteration):** every fact renders exactly once — the update cadence only in the provenance line, the entity only in breadcrumb/title/schema. Order: h1 → lede → hero photo with the Stat Grid pulled up over its bottom edge (`.stat-grid.overlap` — the photo and the numbers read as one unit, the city quantified) → the provenance line (`By the BaseLocal team · ● Checked this morning, before the 6 AM send.`) → primary subscribe. **The Stat Grid is pure content proof** (events this week · free things to do · new spots · local stories — the lifetime story count is a citable depth number no clone network can match). **Audience proof lives only in the reader pill inside the subscribe card** (`● {N} {City} readers`, centered between the card's heading and form — social proof at the point of decision). When the location has no photo, the grid follows the lede directly with no overlap.

Mapped to the prototype markup in order: `.loc-bar` (site chrome), then within `main`: `.hero-img` + `.stat-grid.overlap`, `.stamp` (provenance), `.signup.primary.top` (`#subscribe`), `#this-week` (`.pick` blocks), `#new` + `.slot-cta`, `#directory` (`.dir-promo`), `#most-read` (`.read-list`), `#explore`, `.signup.bottom`.

The **Most read** section reuses the ranked-story pattern from the live welcome page (`/{state}/{city}/welcome/`) and the newsletter's Ranked Card register — rank numeral in Bitter Terracotta, story headline, one-paragraph blurb in voice, source line — restyled as a hairline-divided list so it reads as a leaderboard, distinct from the New-in-{City} cards above it.

## 5. Structured data

Two JSON-LD blocks in `<head>` (both validated):

1. **BreadcrumbList** — 2 items: BaseLocal → {City}, {ST} (current page carries no `item` URL, per Google guidance). Fixes audit finding #13 for this template.
2. **CollectionPage** — `name`, `description`, `url` (= canonical), `image` (the location hero, when present), `isPartOf` the BaseLocal `WebSite`, `publisher` `Organization` (name/url/logo), and `about` a `City` with locality/region. Describes the hub as the city's collection page.

**Deliberately no `FAQPage` schema** (FAQ rich results have been restricted to government/health sites since 2023 — see § 4) and **no `Event`/`ItemList` schema on this page.** Event rich results belong to the events hub; an earlier draft duplicated the ItemList here and was removed — the hub must not compete with its own child for event queries (see § 1 differentiation note).

Source of each value: `locations` table (city/state/slugs, subscriber count) and the location hero asset.

## 6. Internal linking

**Out (this page links):** location bar → home (breadcrumb) + Events, This weekend, Directory, Latest edition (live surfaces only). **Down** → events hub (`/events/`), this-weekend slice (`/events/this-weekend/`), free slice (`/events/free/`), the events hub's farmers-market section (`/events/#markets`), the business directory (`/directory/` — pattern pending confirmation), guides (`/guides/`), latest-newsletter web archive (`/latest-newsletter/`) — each with a descriptive anchor ("All 47 events this week, day by day", not "click here") — plus each curated pick's deep link into its events-hub row fragment. **Sideways** → 2–4 nearest active network markets, anchor text `{City}` with a one-line distance descriptor. New-spot spotlights link out to the business's own site, and Most-read stories link out to their source publications (both `target="_blank" rel="noopener noreferrer"` — linking real sources is good UX and a natural outbound profile). Slot CTA → `/advertise/`. Footer → events, this-weekend, latest edition, subscribe, locations directory, about, advertise, submit.

**In (what must link here):** the events hub and every slice/guide beneath the city (breadcrumb "up" + "See the {City} hub"); the `/locations/` directory; the homepage's market links (audit finding #14 — homepage currently links no cities); newsletter web-archive pages. This hub is the discovery root for the city — it must not depend on `/locations/` alone (that dependency is exactly audit finding #14).

Stable anchor IDs for citability (public API — don't rename once shipped): `#this-week`, `#new`, `#directory`, `#most-read`, `#explore`. The page hosts no per-event fragments of its own — each curated pick links to its row's fragment **on the events hub** (`/events/#{event-id}`, that template's stable-id contract), so a pick's deep link lands on the expandable row with full details and actions.

## 7. Data requirements

| Variable | Source | Required | Validation / missing behavior |
|---|---|---|---|
| City name, state, slugs | `locations` table | Yes | Page doesn't generate without them |
| Subscriber count `{N}` (meta + reader pill) | engaged-audience data per location | No | Renders as the subscribe-card pill `● {N} {City} readers`, rounded (nearest 100 below 10k, nearest 1k above). **Launch-mode callout (market < ~90 days or below count threshold — confirm):** the pill reads `● Newly launched this month` instead of a small number, and meta uses the launch variant (§ 3). Everything else — including the New spots cell — shows its real numbers; new markets never hide data. Missing data entirely → pill omitted |
| Location hero image | per-location CDN asset (`locations/{id}/website-*.png`, 1400×600 — same asset the current hub renders) | No | Missing → no banner (the grid follows the lede, no overlap); og:image and CollectionPage `image` fall back to the brand logo. Rendered with explicit `width`/`height` and `fetchpriority="high"` — above the fold, never lazy |
| Most-read stories (top 5; minimum 3 to render): headline, one-paragraph blurb, source URL + name | newsletter click data, last 30 days (`analytics_link_performance`), **local/news stories only — affiliate and sponsored items never appear here** | No | Fewer than 3 qualifying stories (e.g. new market with no click history) → section omitted entirely |
| Stat cells (events this week, free things to do, new spots, local stories) | events + business pipelines; **local stories = lifetime published story count for the location from the stories/newsletter DB** | No | Grid is 1×N — drop any cell whose count is unavailable or zero; never render a `0` from a query error |
| Curated picks (3–5): name, weekday + time, venue, free/price flag, one-sentence story | pipeline-drafted from the week's events, QA-reviewed (pilot markets); fallback = top 3–4 by category diversity | Yes (≥1 to render the section) | Fallback picks lose the story line (meta line only); a pick missing name/time/venue is excluded; each pick's link target is its events-hub row fragment |
| New-spot spotlights (name, category, one-sentence note, address/link) | business-spotlight archive (pilot markets) | No | Section (and its `<h2>`) omitted entirely when no vetted spotlights exist this month — no generic filler. Notes held to one sentence (Directory Listing Card organic rule) |
| Nearby markets | `locations` lat/long, active only | Yes (≥2) | Fewer than 2 active neighbors within range → the nearby cards fall back to down-links only; the `Explore` section always has the hub's own children to show |
| Directory module | location directory URL + live/populated flag; static value copy + fixed category taxonomy (shared with the ad flow) | Yes | Live (default): "Browse the {City} directory →" link. Not yet live/populated for this location: fallback teaser with `#subscribe` loop instead of the link — never link a URL that would 404 |

## 8. Generation rules

- **Exists when:** the location is active **and** its newsletter is live. Unlike the events hub, the city hub is **not** gated on event volume — the subscribe offer and city identity stand on their own, so the hub is the one page that should exist (and stay indexable) for every live market. This is the strategic point of the page: it always gives `{city} newsletter` searchers a real destination.
- **No noindex floor.** The city hub never noindexes on thinness (contrast the events hub, which noindexes 3–4 events and 404s below 3). A thin market still deserves to answer the subscribe query.
- **Module-level collapse, not page-level:** each section below the hero collapses independently when its data is thin (see § 7). The h1 block, subscribe, and directory module are always present.
- **Update cadence:** regenerate daily (morning, before the newsletter send) and on event/spotlight ingest. The "Checked this morning" stamp must reflect an actual regeneration; on generation failure, show the last true date, never today's.
- **Sitemap:** every live-market hub is in the XML sitemap with `lastmod` = last regeneration (audit task 3).

## 9. States

- **Normal** (`index.html`): full stack — location hero, 4-cell stat grid (47 events · 18 free · 12 new spots · 3,600 stories), subscribe card with reader pill, 4 curated picks, 3 new-spot cards, live directory module, 5 most-read stories, full Explore grid, two subscribe blocks.
- **Thin / new market (spec-only, no demo file):** all stat cells render their real numbers — including New spots; a zero/unavailable cell drops (1×N grid). Picks collapse to however many exist, with the section sub-line owning the quiet week; "New in {City}" and "Most read" are omitted below their minimums; the directory module uses its fallback state where unpopulated; Explore leans on nearby markets. Launch mode swaps only the pill (§ 7). Crucially, **no noindex** — the page stays a full, indexable answer to `{city} newsletter` in every market.
- **No events at all this week:** the "This week" section falls back to a single forward-looking line linking the events hub ("Nothing on the calendar yet — see what's coming →"); the page still generates (the newsletter still ships).
- **Error:** if pipeline data fails at generation time, serve the last good render; never generate a hub with a broken stat grid or an empty picks section from a pipeline failure.

## 10. Open questions

1. ~~og:image~~ — **Resolved:** the per-location hero already served by the current hub (`locations/{id}/website-*.png` on CloudFront) is the og:image, CollectionPage `image`, and on-page banner; brand logo is the fallback. The events-hub spec's open question #3 can adopt the same asset.
2. **Subscriber count source, rounding & launch threshold** — the `{N}` needs a real per-location engaged-subscriber number refreshed on regeneration; confirm the query, the rounding rule, and the **launch-mode threshold** (proposed: market age < 90 days or below a count floor — the pill swaps to "Newly launched this month", § 7). Also confirm the **local-stories count query** (lifetime published stories per location).
3. **"New in {City}" sourcing** — the spotlight archive is a pilot-market editorial input today. Confirm the feed, the one-month recency window, and the vetting step (central QA, not per-market staff). Network-wide, this section is simply omitted where no vetted data exists.
4. **Nearby-market selection & descriptors** — proposed: nearest 2–4 active locations by straight-line distance. Confirm, and confirm the one-line descriptors ("Across the Narrows", "15 minutes east") are editorial per-pair, not generated.
5. **Curated-pick sourcing** — proposed: reuse the events-hub weekend-picks pipeline (pipeline-drafted, centrally QA-reviewed in pilot markets; category-diversity fallback elsewhere). Confirm the two templates draw from one picks feed rather than maintaining two.
6. **Latest-newsletter link target** — `/{state}/{city}/latest-newsletter/` is assumed to exist as a web archive of the most recent edition. Confirm the route and that it's a stable, always-current URL (not a dated permalink).
7. **State-level breadcrumb** — the breadcrumb is 2-level (home → city) because `/wa/` 404s today (audit #15). If state hubs are introduced, the breadcrumb and BreadcrumbList gain a middle item; specify then.
8. **Directory URL pattern & category URLs** — the prototype links `/{state}/{city}/directory/` as the proposed canonical path (the `business-spotlight` spec places directories inside each location's navigation but doesn't fix it — confirm). Also decide whether the 8 categories get crawlable URLs; if so, the module's chips become real category links instead of decoration. The generator additionally needs a per-location live/populated flag for the fallback rule (§ 4).
9. **Most-read data source** — proposed: top local/news links by unique clicks from `analytics_link_performance`, trailing 30 days, affiliate/sponsored rows excluded (the welcome page mixes them in; this SEO surface must not). Confirm the query and the exclusion flag.
