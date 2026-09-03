# Placement Performance Split — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `placement-performance-split`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/placement-performance-split/](https://base-iq.github.io/previews/baselocal/prototypes/placement-performance-split/)

---

## 1. Goal

Split the current Placement Performance table (`/monetization/schedule` → Placement Performance tab) into two purpose-built screens. **Revenue Entry** is a worklist where partner-report totals are typed once per offer per day and automatically allocated across that offer's placements by click share. **Performance Summary** is the read-only recap the rest of the team looks at. Today one table does both jobs, which forces manual click-share math for every offer that runs in multiple groupings and makes data entry slower every time a new grouping (Morning Roundup, Welcome Page, Bridge Page, Local Daily News, …) is added.

This is internal admin tooling. Design language is the CommandCenter admin console (Inter, brand `#B8593A`, Tailwind neutrals — see `admin-console/tailwind.config.js`), **not** the consumer BaseLocal design system in Brain.

## 2. User flow

Screen names match the prototype's HTML files.

1. **Revenue Entry** (`index.html`) — default tab. Days render newest-first within the selected date range. Under each day, offers are grouped **by partner**, so one open partner portal maps to one contiguous group of cards. Each partner group header carries an **"Open portal ↗"** link (new `partners.portal_url` field, opens in a new tab) so the source report is one click away. Partner groups with waiting offers sort first; partner groups that are all-auto (CPC) sort last. Within a group, one card is *active* at a time; the rest are collapsed (done) or dimmed (upcoming).
   - **Finding an entry to edit:** a search field above the day list filters by offer or partner name across the whole range — matching days open automatically, showing only matching cards. Alternatively, any collapsed done-day bar expands on click into the same partner-grouped cards. Either way, clicking a done card reopens it for re-entry.
   - User types the partner-report revenue and conversions into the active card → the split preview recalculates on every keystroke.
   - "Save split · next offer" commits the allocation, collapses the card to its done state, and activates the next waiting card (same partner first, then next partner, then next day).
   - Clicking a done card reopens it prefilled; saving again **overwrites** the prior split.
   - Fully entered days collapse to a single ✓ bar with the day total; clicking expands them.
2. **Performance Summary** (`summary.html`) — read-only. Stat strip on top, then a By-date table: day band → section band per grouping/send (with delivered/opened counts where they exist) → offer rows → section subtotal. No inline editing anywhere on this screen.

## 3. Allocation algorithm (the core contract)

For one offer on one day, with entered totals `R` (revenue) and `C` (conversions):

1. **Click basis per placement:** `unique_clicks` where available; **PB clicks** for placements without unique clicks (Welcome Page); **verified clicks** for Bridge Pages. Mixed bases within one offer are allowed by policy — show the amber "mixes click bases" note, never block.
2. **Postback holdout:** placements with matched postback data (`postback_log`) are **locked**: their PB revenue/conversions are taken as actuals and held out. `R_split = R − Σ locked_rev`, `C_split = C − Σ locked_conv` (both floored at 0).
3. **Proportional split:** `R_split`/`C_split` distribute across unlocked placements proportional to click basis.
4. **Exact reconciliation (largest-remainder method):** revenue allocates in integer cents, conversions in integer units. Floor each share, then distribute the remaining cents/units one at a time in order of largest fractional remainder (ties → larger click count). Allocated parts **always sum exactly** to the entered totals.
5. **Bundles allocate as single units.** A bundle (one offer across multiple slots of one edition, `placement_bundle_id`) is ONE allocation target whose click basis is its members' clicks summed. Storage follows current anchor-row mechanics (manual values on `bundle_is_anchor=true` row, members zeroed). Never distribute bundle revenue to member placements — bundles are the unit for copy-variation analysis. Uncombine stays available on the split row (× on the bundle chip) and uses the existing `bundle_action: "uncombine"` API.
6. **CPC offers auto-fill:** `revenue_per_placement = clicks × partner.click_adjustment_factor × campaign.commission_cents/100`, rounded to cents per placement; offer total is the sum. No manual entry, no override. Conversions are `—` for CPC.
7. **Partner click adjustment factor:** new numeric field on `partners`, default `1.00`. AtWave starts at `0.90` (our unique clicks run ~10% above AtWave's reported clicks). Editable in partner settings; applies wherever that partner's clicks feed a calculation.
8. **Overwrite semantics:** re-saving an offer (manual re-entry or postback updates arriving) recomputes and replaces the prior allocation. No versioning; `updated_at` reflects the change.

Validation: if the entered revenue is *below* the locked postback total, show the error state (see § States) and keep Save enabled only for valid values (`revenue ≥ 0`; empty conversions treated as 0).

## 4. States

**Revenue Entry**

| State | Behavior / copy |
|---|---|
| Active card, empty | Inputs empty, bars at click-share widths, allocations show "—". Reconciliation line: "{N} clicks across {M} placements · Waiting on the partner total". Save disabled. |
| Active card, typing | Allocations + bars update per keystroke. Reconciliation: "Splits to the penny ✓" (or "{locked} locked + {split} split = {total} entered" when a holdout exists). Save enabled. |
| Entered < locked PB total | Reconciliation right side: "Partner total is below the locked amount — check the report" (brand-red emphasis). |
| Mixed click bases | Amber note: "Heads up: this split mixes click bases (unique + PB). Close enough by policy — flagged so you know." |
| Done card | Collapsed: ✓, offer name, meta ("split 3 ways · $84.00 locked from postback"), total + conv. Hover tooltip: "Re-enter — new totals overwrite the old split." |
| PB-partial done card | Same as done + amber "PB partial" chip. |
| Auto (CPC) card | ✓ + blue "Auto" chip, formula in meta: "240 + 84 clicks × 0.90 × $1.75 CPC — AtWave counts run hot; the 0.90 factor is set on the partner." Not clickable. |
| Upcoming card | 60% opacity, "Needs data" chip, not interactive until active. |
| Day fully entered | Collapses to ✓ bar: "{Day} · all {N} entered · {total}". Click to expand into the same partner-grouped cards; expanded fully-entered days show a "Collapse ▴" control. Total is computed (manual entries + CPC auto totals). |
| Search active | Only matching offers render, inside their day/partner context; days with no matches hidden; done days auto-expand. Clearing the field restores the default view. |
| Search, no matches | "No offers match "{query}" between {range}. Try a partner name — every offer lists under its partner." |
| Nothing waiting in range | Page subtitle: "Nothing waiting — every offer in range is entered." |
| Bundle uncombine | Confirm dialog: "Split this bundle back into Lead and Feature 1? Each slot becomes its own line in the split." Uncombining a saved offer reopens it for re-entry. |

**Performance Summary**

| State | Behavior |
|---|---|
| Row not yet entered | Revenue/CPM/RPC/Conv/Conv Rate render "—"; row still shows clicks + PB columns. |
| Welcome Page rows | Unique Clicks shows "{n} (PB)"; CTR and CPM "—" (no delivered/opened). |
| Bridge Page rows | Clicks show "{n} (verified)"; CTR/CPM "—". |
| PB-locked row | "🔒 PB" tag next to partner name; PB columns populated. |
| Bundle row | Single row, module cell shows combined chip ("Lead + Feature 1"), "bundle" tag. |
| Section subtotal, conversions | Conv and Conv Rate show "—" when no row in the section has conversions (e.g. a Bridge Page section whose only offers are CPC). |
| Empty date range | (Not in prototype) Table body: "No placements in this range." |

Loading/error states for both screens follow existing admin-console patterns (spinner on Sync, inline retry) — intentionally not re-specified here.

## 5. Copy

Exact strings. Functional register — calm, specific, no marketing voice.

| Location | String |
|---|---|
| Tabs | "Revenue Entry" / "Performance Summary" |
| Search placeholder | "Find an offer or partner" |
| Search empty state | "No offers match "{query}" between {range}. Try a partner name — every offer lists under its partner." |
| Portal link | "Open portal ↗" |
| Entry page subtitle | "{N} offers waiting on partner numbers" / "Nothing waiting — every offer in range is entered." |
| Day progress | "{entered} of {total} entered" |
| Partner group state | "{N} waiting" / "all entered ✓" / "auto from CPC" |
| Field labels | "Revenue" / "Conversions" |
| Entry hint | "Type the {partner} portal totals once — the split below settles as you type." |
| Primary CTA | "Save split · next offer" |
| Reconciliation (ok) | "Splits to the penny ✓" |
| Reconciliation (holdout) | "$84.00 locked + $328.50 split = $412.50 entered" |
| Reconciliation (error) | "Partner total is below the locked amount — check the report" |
| Locked split row | "🔒 postback" + "{n} PB · held out" |
| Mixed-basis note | "Heads up: this split mixes click bases (unique + PB). Close enough by policy — flagged so you know." |
| Auto card meta | "{clicks} clicks × {factor} × {CPC} CPC — AtWave counts run hot; the 0.90 factor is set on the partner." |
| Done-card tooltip | "Re-enter — new totals overwrite the old split." |
| Uncombine confirm | "Split this bundle back into {slots}? Each slot becomes its own line in the split." |
| Day done bar | "{Day} · all {N} entered · {total}" |
| Summary subtitle | "Read-only — numbers come from Revenue Entry and postbacks" |

## 6. Data requirements

Reads (existing tables):
- `placements`: `campaign_id`, `module_id`, `publish_date`, `unique_clicks`, `email_format_id`, `bridge_page_id`, `signup_slot`, `placement_bundle_id`, `bundle_is_anchor`, `revenue_entered`, `conversions_entered`
- `campaigns`: `name`, `partner_id`, `revenue_event` (CPC/CPA/CPL), `commission_cents`
- `partners`: `name` + **new columns** `click_adjustment_factor NUMERIC(4,2) NOT NULL DEFAULT 1.00` and `portal_url TEXT NULL` (partner report portal, rendered as the group header link)
- `postback_log`: `matched_placement_id`, `payout_cents_resolved`, count per placement → locked actuals
- PB clicks per placement: existing `affiliate_click_events` distinct-count with bot filter + `PB_UNIQUE_CALIBRATION` (same as current report)
- Bridge pages: verified clicks from `bridge_page_clicks`

Writes (entry screen only):
- Per placement (or bundle anchor): `revenue`, `conversions`, `revenue_entered=true`, `conversions_entered=true` — allocated values, not the offer total
- The offer-level entered total is derivable (sum of allocations); persist it if an audit trail is wanted (open question #4)

Entry grain: **offer × publish_date**. One partner-portal total per offer per day fans out to that day's placements.

Validation: revenue ≥ 0, 2dp max; conversions ≥ 0, integer; entered revenue ≥ locked PB revenue (warn, don't block save — the partner report may legitimately lag postbacks; see open question #6).

## 7. External integrations

None new. Postback ingestion (`postback_log`), click sync, and the bundle combine/uncombine API already exist. The only schema changes are the two new `partners` columns: `click_adjustment_factor` and `portal_url`.

## 8. Open questions

1. **Where does combine ("Track as one") live now?** Uncombine is on the entry split row; creating a bundle probably belongs in the Scheduler where slots are assigned. Confirm before build.
2. **Historical bundles:** existing `bundle_prior_manual` snapshots and anchor-row data are untouched, but should old entries be re-normalized to the new allocation model, or left as-is with a cutover date?
3. **Partner sort order on the entry screen:** prototype sorts waiting-first, auto-last. Alternative: stable alphabetical. Confirm preference after real use.
4. **Audit trail:** should the entered offer-level total + timestamp be persisted (new table) so overwrites are traceable, or is `updated_at` enough?
5. **Late postbacks after manual entry:** when a postback lands for a placement that was already covered by a manual split, does the system auto-relock and re-split the remainder (prototype's stated behavior), and should that trigger any notification?
6. **Partner total below locked PB:** prototype warns but currently allows negative-remainder saves to floor at $0 split. Decide: block save, or allow and flag for review?
7. **Reversals / restatements:** negative adjustments from partner reports (clawbacks) have no entry affordance — out of scope here; needs a decision for production.
8. **Permissions:** should Revenue Entry be role-gated while Performance Summary is visible to everyone in the admin console?
9. **CPC discrepancies:** CPC offers auto-fill and are locked from manual override by design. If AtWave's monthly invoice disagrees materially, the only lever is the partner factor — is that acceptable, or is a one-off day-level correction needed?
