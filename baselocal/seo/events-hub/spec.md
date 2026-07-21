# Events Hub — SEO Page Template Spec

**Brand:** BaseLocal
**Page-type slug:** `events-hub`
**Prototype:** [https://base-iq.github.io/previews/baselocal/seo/events-hub/](https://base-iq.github.io/previews/baselocal/seo/events-hub/)

---

This is the upgrade spec for the existing `/{state}/{city}/events/` template — the network's highest-value SEO surface (positions 8–17 for "{city} events" across ~400 locations with no deliberate SEO). It replaces the current flat event dump. Files: `index.html` (Kitsap County, WA — normal week), `sparse.html` (same template at its quality floor), `styles.css`, and six navigable slice instances (`this-weekend/`, `today/`, `free/`, `live-music/`, `markets/`, `family/`) so the cluster can be clicked through end-to-end. The slices demonstrate the `events-date-slice` / category-slice page types — each with its own title/meta/canonical pattern (see their `<head>`s) — but their full generation spec is a separate page-type document; this spec governs the hub. In the prototype, links between cluster pages are relative so navigation works locally and on GitHub Pages; in production they are absolute clean URLs. All visual values come from `brain/brands/baselocal/design-system.md`, including the three components added for this template (Breadcrumbs, Sticky Filter & Utility Bar, Event Day-List Table).

## 1. Goal & target queries

Primary: `{city} events`, `{city} events calendar` (same SERP — one page serves both; never build a separate `/calendar/` URL). Secondary intents served by linked slice pages: `{city} events this weekend`, `events in {city} today`, `free events in {city}`, `live music {city}`, `farmers markets {city}`.

Intent: time-scoped local discovery — "what's happening here that's worth my time." The page satisfies it above the fold (h1 + freshness proof + filters + first pick), then earns links with reference-grade completeness (stats, verified stamps, the farmers-market seasons table, anchor-linkable sections).

Taxonomy position: child of the city hub `/{state}/{city}/`; parent of the date/category slices (`events-date-slice` page type, specced separately).

## 2. URL pattern

`/{state}/{city-slug}/events/` — lowercase kebab-case, trailing slash, apex host.

Canonical rules: self-referencing canonical on every instance; query strings (`?utm_module=...`) always canonicalize to the clean URL; the `www` host 301s to apex (per audit tasks 1–2). Slice URLs are real child paths, not parameters: `/events/today/`, `/events/this-weekend/`, `/events/free/`, `/events/live-music/`, `/events/markets/`, `/events/family/`.

## 3. Title & meta templates

- **Title:** `{City} Events This Week — Updated Daily | BaseLocal`
  - Drop the ` | BaseLocal` suffix when length exceeds 60 characters (state abbreviation is intentionally omitted from the title; it appears in the h1 and meta).
  - Kitsap instance: `Kitsap County Events This Week — Updated Daily | BaseLocal` (58 chars).
- **Meta description:** `{N} things happening in {City}, {ST} this week — concerts, markets, festivals, and free events, checked every morning by our local editors.`
  - `{N}` = live count of events in the next 7 days. Target 140–160 chars; if a long city name pushes it over, drop `, {ST}`.
  - "Editors" in external copy refers to the central QA/curation team — acceptable externally per brand decision; never implies per-market editorial staff operationally (see § 7 ownership rows).
- **OG:** og:title (title minus brand suffix), og:description (= meta), og:url (= canonical), og:type `website`, og:site_name `BaseLocal`, og:image (brand default until a per-city image exists — see Open questions).

## 4. Page structure

Landmarks: `header` (site header) → `nav` (breadcrumb) → `main` → `footer` (site footer). Heading outline (one h1, no skips, filter/day labels are NOT headings):

```
h1  Events in {City}, {ST}
    [freshness stamp · stat grid · editor's note]        ← not headings
    [sticky view bar · utility band w/ category select]  ← not headings
h2  This weekend in {City}          → h3 per curated pick (2–4)
h2  Free events in {City}           → h3 per event (3–4 + slice link)
h2  Live music in {City}            → h3 per event (3–4 + slice link)   ← category section, conditional
h2  Every farmers market in {City}  → (reference table, no h3s)         ← conditional
h2  All upcoming events, day by day → h3 per event, grouped under day labels
h2  More events near {City}         → (nearby-location links)
h2  Get {City}'s best events in your inbox → (signup form)
```

Above-the-fold contract (375px): h1, verified-this-morning stamp, and the filter bar must be visible without scrolling; the first curated pick within one thumb-scroll. The signup CTA lives in the header (persistent) and at the bottom — it never displaces events.

Control rules (decided in iteration): the **sticky view bar holds exactly four pills** (All this week / Today / This weekend / Free) and wraps rather than scrolls — it must never require horizontal scrolling. Categories live in a **native select** (design-system Select/Dropdown) inside a non-sticky utility band below the bar, alongside Print and Add-to-calendar; the select navigates on change (slice URL for the four indexable categories, `#all-events` anchor for the rest). Because the select is not crawlable, every indexable category slice must also have a plain `<a>` link in a section sub-line (see § 6).

Mapped to the prototype's markup in order: `.crumbs`, `h1`, `.stamp`, `.stat-grid`, `.editors-note`, `.filter-bar`, `.toolrow`, sections `#weekend`, `#free`, `#live-music`, `#markets`, `#all-events`, `.submit-strip`, `#nearby`, `#signup`.

## 5. Structured data

Two JSON-LD blocks in `<head>`:

1. **BreadcrumbList** — 3 items: BaseLocal → {City}, {ST} (city hub URL) → Events (no item URL on the current page, per Google guidance).
2. **ItemList** whose `itemListElement` are `Event` objects. `numberOfItems` = total events this week (not just those sampled). Per Event:
   - **Required:** `name`, `startDate` (ISO 8601 with timezone offset), `location` (Place with `name` + `address` PostalAddress — minimum locality/region)
   - **When available:** `endDate`, `description`, `offers` (price `0` for free events — this is what qualifies free events for rich-result labeling), `url` (event detail page), `image`, `eventStatus`, `eventAttendanceMode`
   - Source: the same events rows that render the page (Aurora `events` table via the pipeline). Never emit schema for events not rendered in HTML — schema/content mismatch is a spam signal.

Production note: the prototype embeds 6 sample Events; production emits every rendered event. Validate with Google's Rich Results Test in CI (see audit Task 5 acceptance).

## 6. Internal linking

**Out (this page links):** breadcrumb → home + city hub · view pills → `today/`, `this-weekend/`, `free/` slices · **category slice links (`live-music/`, `markets/`, `family/`) as plain anchors in section sub-lines** — the category select duplicates them for UX but carries no link equity · section sub-lines → slice pages with descriptive anchors ("All 20 weekend events", "Full markets calendar") · nearby block → 3–5 nearest network locations' events pages, chosen by distance, with anchor text `{City} events` · footer → city hub, latest-newsletter, submit, locations directory · submit strip → `/events/submit/`.

**In (what must link here):** city hub ("See all events" + this-week module) · every date/category slice (breadcrumb + "all events" link) · seasonal/evergreen guides for the city · the locations directory · newsletter web archive links where present. This page must never depend on `/locations/` alone for discovery.

Anchor-linkable stable IDs for citability: `#weekend`, `#free`, `#live-music`, `#markets`, `#all-events`, plus a per-event `id` on every listing row (see § Individual events) — these are public API; don't rename once shipped.

## Individual events — three-tier model (decided)

**Tier 1 — scraped one-off events (~95% of rows): no individual URL, ever.** They render as expandable rows on the hub and slices (behavior below). This preserves the current architecture's real strength — all event content consolidates authority onto the URLs that rank — and keeps the site free of expired-page dead weight. One change from the current site: the expanded card links out to the organizer/ticket page (`target="_blank" rel="noopener noreferrer"`). Linking to real sources is good UX and a natural link profile.

**Tier 2 — signature events: evergreen series pages** at `/{state}/{city}/events/{series-slug}/` ("Whaling Days 2026: schedule, parade route, parking"). Rolled forward annually — never year-stamped URLs. Sourced from a **signature-events registry**: data nominates candidates (year-over-year fuzzy title recurrence at the same venue + newsletter-click thresholds from `analytics_link_performance` + category signal), the QA team approves rows in the admin; quarterly refresh sweep. A series page exists only while someone maintains it annually. Separate page type — prototype and spec to follow.

**Tier 3 — submitted/paid events: detail page as a product feature.** Indexed while upcoming and above the content bar; the organizer gets a URL to share and link to (the backlink loop).

**Expiry lifecycle for any dated event URL (Tiers 2–3 instances, Tier 3 pages):** upcoming → indexed, in sitemap with `lastmod`. Passed → removed from sitemap immediately; page survives ~30 days as "this event has passed — here's what's coming" (catches post-event searches); then **301** to its series page if one exists, else the city events hub. Never mass-404. `eventStatus` in schema updates accordingly.

### Expanded-event row (Tier 1 behavior)

Each day-list row is a native `<details>`: the `<summary>` is the standard row (time / name / venue / price / caret), the expanded panel is a Warm Cream card containing the full description (1–3 sentences, pipeline-drafted in brand voice), then an action row: **Event website ↗** (external, noopener), **Add to calendar** (.ics), **Copy link** (copies the row's fragment URL). Every row carries a stable `id` (slugified event name; `-2`, `-3` suffixes on same-page collisions) — this is the deep-link target. On page load, a fragment in the URL auto-opens the matching row and scrolls it into view; hash changes do the same. No JS beyond that; collapsed content is server-rendered HTML inside `<details>`, so it is crawlable and contributes to the page's content depth. Curated picks deep-link to their row's fragment — the same mechanic newsletter links use.

### Newsletter deep-link mapping

Newsletter modules link the matching cluster page, not everything to the hub — reader lands on a page shaped like what they clicked, and slices earn their engagement signals:

| Newsletter module | Link target |
|---|---|
| Events (general) | `/events/?utm_module=events#{event-id}` — fragment auto-expands the card |
| Weekend preview | `/events/this-weekend/?utm_module=events` |
| Music | `/events/live-music/?utm_module=music` |
| Family module | `/events/family/?utm_module=events` |
| Signature-event mentions | the series page (Tier 2) |
| Paid event placements | the event's detail page (Tier 3) |

Fragment links to expired events land at the top of the hub — old emails never dead-end. UTMs are preserved for analytics and neutralized for SEO by the canonical rule (§ 2).

## 7. Data requirements

| Variable | Source | Required | Validation / missing behavior |
|---|---|---|---|
| City name, state, slugs | `locations` table | Yes | Page doesn't generate without them |
| Events (next 7 days): name, start datetime, venue name | events pipeline | Yes | Event rows missing any of these are excluded from render AND schema |
| Venue street address | events pipeline | No | Omit from venue line; schema address falls back to locality |
| Price / free flag | events pipeline | No | Missing → price cell shows "See details"; never guess "Free" |
| Per-event verified date | pipeline check timestamp | No | Stamp renders only when checked within 7 days; otherwise omitted — never fake it |
| Weekly counts (week, 30-day, free, venues) | computed from events rows | Yes | If any count is unavailable, drop that stat cell (grid is 1×N); never show 0 from a query error |
| Editor's note | pipeline-drafted weekly from the week's events, QA-reviewed centrally (pilot markets) | No | Missing or unreviewed → section omitted entirely; no generic filler |
| Curated weekend picks | pipeline-drafted (pilot, QA-reviewed) or top-3 by category diversity (fallback) | No | Fallback picks lose the `story` blurb — meta line only |
| Farmers-market table | curated per-market reference data with `last-checked` date | No | Section renders only where the reference data exists and was checked ≤ 60 days ago |
| Nearby locations | `locations` lat/long, active only | Yes (≥2) | Fewer than 2 active neighbors within 90 miles → section omitted |
| Subscriber count (submit strip, "78,000 neighbors") | engaged-audience data | No | Missing → copy drops the number ("the newsletter your neighbors read every morning") |

## 8. Generation rules

- **Exists when:** location is active AND ≥ 5 upcoming events in the next 14 days.
- **Thin-content guard:** 3–4 events → page renders but emits `<meta name="robots" content="noindex">` (preserve URL, drop from index). Under 3 → page 404s and leaves the sitemap. Guards are evaluated at each regeneration.
- **Category sections** (Free, Live music) render only with ≥ 3 qualifying events; category slice pages generate only with ≥ 4 (else the pill anchor-jumps or is hidden).
- **Update cadence:** regenerate daily (morning, before newsletter send) and on event ingest; the "Verified this morning" stamp must reflect an actual regeneration — if generation fails, the stamp shows the last true date, never today's.
- **Sitemap:** every indexable instance in the events section of the XML sitemap with `lastmod` = last regeneration.

## 9. States

- **Normal** (`index.html`): full section stack, 47-event week.
- **Sparse** (`sparse.html`): 5–7 event week — category sections, the category select, and the farmers-market table collapse (the select renders only when ≥ 2 category slices exist), day list shows empty-day states (each hands the reader forward: an in-page anchor or a nearby-market link), editor's note acknowledges the quiet week, nearby section gains prominence, submit strip copy leans on "quiet weeks are when listings get noticed." The sparse file carries `noindex` only as a prototype artifact — in production, sparse-but-≥5-events pages remain indexed.
- **Empty day within any week:** `day-empty` row per the design system — never a blank day, never a hidden day.
- **Below floor (<3 events):** page not generated (404 + sitemap removal). No "come back later" page — a thin page here embarrasses the brand.
- **Error:** if event data fails to load at generation time, serve the last good render; never generate an events page with zero events from a pipeline failure.

## 10. Open questions

1. **`.ics` and Print** — "Add to calendar" (subscribe-able ICS feed per city?) and print stylesheet are rendered as slots but unspecced. Both are linkability assets; need engineering sizing.
2. ~~Event detail pages~~ — **Resolved**: three-tier model (see § Individual events). Tier 1 events have no URL and expand in place; schema `url` for Tier 1 events is omitted (or points at the hub fragment); Tier 2/3 get real URLs with the expiry lifecycle.
3. **og:image** — brand logo is the placeholder; a per-city image (the city hub hero photo?) would perform far better in shares. Where does it come from?
4. **Subscriber count source** — "78,000 neighbors" needs a real per-location number from the engaged-audience tables, refreshed on regeneration; confirm the query and rounding rule.
5. **Category taxonomy mapping** — the pipeline's `event_categories` (22 rows) must map onto the four indexable slices + on-page filter set; needs a one-time mapping table.
6. **Farmers-market reference data** — who owns the per-market seasonal-hours dataset and its 60-day re-verification loop? (A QA/ops task, not scraping — there are no per-market editors.)
7. **Neighbor selection** — proposed: nearest 4 active locations by straight-line distance. Confirm, and confirm the one-line descriptors ("Across the Narrows") are editorial per-pair, not generated.
