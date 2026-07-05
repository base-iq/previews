# Analytics Overview — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `analytics-overview`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/analytics-overview/](https://base-iq.github.io/previews/baselocal/prototypes/analytics-overview/)

---

## Goal

A team-only business dashboard that tracks the **Roadmap to $1M / $0.50 RPS**. It answers one question at every scroll depth: **are we pacing to this month's revenue target, and if not, which lever is off?** A revenue-and-pacing hero sits on top; three drivers (RPS, Engagement, Acquisition) decompose the revenue equation `revenue = subscribers × RPS`; a separate Guardrails layer watches the limits we can't cross while scaling. A Month/Year scope toggle re-paces every element against either the current month or the annual roadmap, and a month stepper looks back at finished months.

Audience: internal team only. Not customer-facing.

## Placement & navigation

- Add a nav entry **"Analytics Overview"** under the **Monetization** section of the CommandCenter admin console.
- Route to the new page. Team-only visibility (same gate as other internal monetization tooling).
- This is a **read + light-write** page: read for all analytics; the only write is the editable targets (see Data requirements → Targets).

## Metric definitions — source of truth

**Every metric on this page is defined in `brain/brands/baselocal/kpis.md`. Do not re-derive; reference and reuse the production definitions.** Key ones used here:

- **RPS** — monthly revenue ÷ Avg Active Subscribers ((Begin+End)/2). North-star.
- **Engagement Rate** — Engaged ÷ Active. **Engaged Subscribers** = lifetime clicks ≥ 2 (Beehiiv segment, forward-only from May 2026).
- **Net New / retention** — `Ending Active = Prior Active + Total New − Manual − Cleanups − Location Cuts − Other Lost`.
- **Acquisition funnel** — Meta Spend → Meta Leads → (Validation Rate) → New Meta Subscribers; + New Other (organic) = Total New; Blended CAC, Organic Share.
- **Per-send** — Open Rate, SCTR, OCTR, Spam Rate, Manual Unsub Rate (all delivered-denominated).
- **CAC Payback** — Cost per New Subscriber ÷ RPS. **LTV per sub** — RPS × Manual Lifetime.

## User flow / structure

The page is a single scroll, top to bottom:

1. **Header** — title "Analytics Overview" + current date; **Month / Year** scope toggle; **month stepper** (‹ ›); **Edit targets** button.
2. **Revenue & pacing hero** — the current month's revenue vs target, a daily cumulative chart with a run-rate projection, and three sub-stats (made/day, needed/day, the daily gap).
3. **The drivers** — three cards (RPS · Engagement · Acquisition). Each shows value, "of target", a pacing line with the colored gap, a mini pacing chart, and a "Details ↓" link. Weekly/Monthly grain toggle. Cards enlarge in place on click.
4. **The deep dives** (layer header) — three sections, one per driver, each a card with an in-card toolbar: section name · segmented tab switcher · (the primary metric tab is styled distinctly, followed by a "why it's moving" label and the explainer tabs).
5. **Guardrails** (separate layer header) — its own section; toolbar left shows a live status ("N guardrails on watch"). Tabs: Warnings + the individual limits.

### Screen: Hero (Revenue & pacing)

- **Kicker**: "{Month} revenue" (or "2026 revenue" in Year scope, or "{Month} revenue — final" for a finished look-back month).
- **Headline**: `{made} of {target}` (e.g. `$37.4k of $400k`).
- **Subline**: `Pacing to {projection} — {gap}` where the gap is colored (amber = short, green = ahead/on pace). Finished months read `Finished {final} — {delta} vs target`.
- **Chart**: cumulative revenue by day. Solid = actual to today; dashed terracotta = run-rate projection to month-end; dashed gray = the straight-line target pace. Daily x-axis. Hover any day → white tooltip card: `Day N · {Mon} N` / Target pace ${amount} / Actual (or Projected) ${amount}.
- **Sub-stats** (3): made/day so far · needed/day from here · the daily gap (amber when behind, green when ahead).
- **Year scope**: chart becomes cumulative months Jan–Dec vs the roadmap staircase (sum of monthly targets); projection from the current month to year-end; sub-stats become monthly ($/month made, needed, step-up).

### Screen: Driver cards (×3)

Each card: `{value}` + `of {target}` + pacing line `Pacing to {projection} — {gap}` + mini chart (actual + dashed projection + dashed month-target line) + ⓘ tooltip (definition, click to toggle) + "Details ↓" (jumps to the section).

- **RPS**: value = RPS; target = month RPS target; mini-chart y-scale `$0.24–$0.40` (month) so the target sits at ~70% height.
- **Engagement**: value = Engagement Rate %; target = month engagement target.
- **Acquisition**: value = net new subs MTD; target = month net-new target; mini-chart is bars (weekly/monthly) with a stepped per-period target.

Click a card → **enlarge overlay** (not a new page): the driver's chart enlarged with hover crosshair + live values, a pacing line, a 3-stat footer (so far · target · pacing to), a "vs target" tooltip row, and arrow-key cycling between drivers. Esc / scrim / × closes.

### Section: RPS deep dive

Toolbar tabs — primary first, then "why it's moving":

| Tab | Content | Action link |
|---|---|---|
| **RPS pacing** (primary) | Weekly/monthly actual + dashed projection to Jul 31 vs the month RPS target line | — |
| Revenue by source | Table of the **six sources** (Newsletter, Welcome Page, On-Site Ads, BaseLocal Club, Community Partners, User-Submitted Events) with sparkline, May/Jun/Jul-pacing $, share, Δ share, verdict chip. **Each source name opens a detail modal** (source trend chart + revenue-leaders table). | Adjust the send lineup → Campaigns |
| Welcome yield | $ per **gross** new subscriber vs the $0.15 target line | Tune the welcome offers → Welcome Page |
| Sends per subscriber | Weekly sends each subscriber receives | Set send frequency → Campaigns |
| Locked-offer coverage | % of send slots running locked, proven-CPM offers | Lock or rotate offers → Campaigns |
| Copy lift | Avg CTR lift of winning copy variations vs control | Test new copy variations → Campaigns |
| Offer CPMs | Table sorted by CPM: Offer · **CPM · CVR** · RPC · Status (locked/testing). Locking to scale needs strong CPM **and** CVR. | Manage the offer roster → Campaigns |

### Section: Engagement deep dive

Grounded in the Subscribers-report engagement definitions. Rate and count are tracked **separately** (rate can rise on a shrinking base):

| Tab | Content | Action link |
|---|---|---|
| **Engaged share** (primary) | Engagement Rate % (Engaged ÷ Active) actual + projection vs the month target | — |
| Engaged subscribers | Absolute count with 2+ lifetime clicks (must grow, not just the ratio) | Segment and re-activate the base → Subscribers |
| Becoming engaged | New subs reaching their 2nd lifetime click each week (the inflow) | Strengthen onboarding → Welcome Page |
| Per-send rates | Open rate, SCTR, OCTR | Test subject lines and layout → Campaigns |
| Deliverability | Inbox placement % (the precondition for opens/clicks) | Open the Deliverability report → Deliverability |

### Section: Acquisition deep dive

| Tab | Content | Action link |
|---|---|---|
| **Net new** (primary) | Gross adds − losses, weekly/monthly, vs a **stepped per-period target** (ramps 100k→150k→200k monthly; ~46k/wk in July) | — |
| Acquisition funnel | Tapering funnel: Meta Leads → (validation rate) → New Meta Subscribers → Total New (+organic). CPL, CAC, organic share, blended CAC in the walls/footer. Flags validation vs the ≥90% north-star. | Adjust spend and targeting → Meta Ads |
| Path to 2M | Total Active Subscribers climbing to the 2M December goal (2M × $0.50 = $1M/mo) | See the full subscriber base → Subscribers |
| Gross vs losses | Two trend **lines** (gross adds, losses) with the net-new gap shaded; partial current week marked | Break down adds and losses → Subscribers |
| Economics | Table: CAC payback, welcome $/gross sub, gross adds, losses, net new | Adjust acquisition spend → Meta Ads |
| LTV : CAC | Ratio trend vs the 3:1 healthy floor; subline: LTV $ vs CAC $ = ratio · payback days | Adjust acquisition spend → Meta Ads |

### Section: Guardrails (separate layer)

Toolbar left = live status ("N guardrails on watch"). Tabs:

| Tab | Content | Action link |
|---|---|---|
| **Warnings** (primary) | **Gauge cards** — one row per guardrail: name + current/limit, warning lead over a meter bar (fill = current, dashed mark = limit), Watch/Clear chip + action link | per-row |
| Churn | **Weekly** line (reveals intra-month spikes) or **monthly** bars, vs the 22% reassess line | Dig into retention → Subscribers |
| RPS floor | RPS trajectory (May–Jul actual, dashed projection to Aug) vs the **$0.45 floor effective August**, gap annotated | Lift RPS in Campaigns |
| Spam | Weekly spam rate vs the 0.05% cap | Open the Deliverability report → Deliverability |
| Unsubs | Unsub rate vs send volume, indexed — unsubs drift up as sends rise | Open the Deliverability report → Deliverability |

## States

- **Empty / no data for a month**: a look-back month with no data shows an empty chart with "No data for {month}."
- **Loading**: skeleton the hero headline + charts; the page is read-heavy, so load the current-month view first, hydrate deep dives lazily on scroll/tab-open.
- **Partial current period**: the current week/month is drawn faded / hollow-dotted and labeled "partial" or "pacing" — never as a real drop.
- **Year scope**: hides the Weekly/Monthly grain toggle and the Edit-targets-per-month affordance is the full-year editor; drivers re-anchor to December targets.
- **Guardrail states**: green (clear) → amber (watch: trending toward limit within threshold) → red (breached). Red is the only unprompted red on the page.

## Copy

All visible strings are in the prototype and are final for design intent. Notable: driver "Details ↓"; guardrail status "N guardrails on watch"; action links read "{verb phrase} in {Report} →". Match the BaseLocal voice in `brand-guide.md` / `general-writing-guide.md` for any new strings.

## Data requirements

Each chart needs a time series (weekly + monthly grain) for the current month and look-back months (May, Jun, Jul in the mock). Sourced from the analytics context / Aurora, per `kpis.md`:

- **Revenue**: daily cumulative (hero), monthly totals, by-source split across the six sources, per-source revenue leaders.
- **RPS**: monthly RPS; weekly RPS pace; welcome $/gross sub; sends per sub; locked-slot %; copy-variation lift; offer CPM/CVR/RPC + status.
- **Engagement**: Engagement Rate %; Engaged count; weekly newly-engaged (2nd-click crossings); Open/SCTR/OCTR; deliverability/inbox %.
- **Acquisition**: net new (weekly/monthly); Meta spend/leads/validation/CAC; organic; Total New; Active-subscriber trajectory; gross adds + losses (weekly); economics table inputs; LTV inputs (RPS × Manual Lifetime), blended CAC.
- **Guardrails**: weekly + monthly churn; RPS trajectory + Aug floor; weekly spam; weekly unsub rate + send volume.

### Targets (the only write path)

A **`monthly_targets`** table, editable in-app via the Edit targets panel, one row per calendar month:

| column | type | notes |
|---|---|---|
| month | date (month key) | Jan–Dec 2026 |
| revenue_target | int (cents or $) | drives hero + revenue pacing; **year target = sum of the 12 months** |
| rps_target | decimal | drives RPS driver; **December's value = the annual exit RPS ($0.50)** |
| engagement_target | decimal (%) | drives Engagement driver; December = annual exit (58%) |
| net_new_target | int | drives Acquisition; ramps by month |
| churn_guardrail | decimal (%) | the reassess line (22%) |

Edit panel: a scope selector (each month, or "2026 — full year"). Month scope edits the four fields for that month; full-year scope lists all 12 revenue targets with a live-summing annual total. Save re-paces the whole report. Validation: a month's target can't be below revenue already booked that month. Targets are **manually set and editable** (no auto-calculation).

## External integrations

None new for the page itself. It reads existing analytics feeds and writes only `monthly_targets`. Deep-dive **action links** route to sibling reports (Campaigns, Welcome Page, Subscribers, Deliverability, Meta Ads) — wire to their real routes.

## Open questions (for the implementer)

1. **Real target values.** The prototype's targets (revenue ramp, RPS $0.35 Jul → $0.50 Dec, 55% engagement, 200k net-new, 22% churn) are illustrative. Confirm the real roadmap numbers to seed `monthly_targets`.
2. **RPS floor semantics.** The $0.45 "August floor" guardrail sits *above* the August RPS target (~$0.38 in the ramp). Confirm what the $0.45 floor means and whether it's a hard reassess trigger — the mock shows RPS as short of it on current trend.
3. **Welcome yield $0.15 target** — where does it come from? Should it live in `monthly_targets` too, or is it a fixed milestone?
4. **Weekly churn definition.** Churn is monthly-denominated in `kpis.md`; the weekly view needs a defined weekly/rolling churn rate. Specify (rolling 4-week? weekly annualized?).
5. **Data feeds not yet productized:** sends-per-sub, locked-slot coverage, copy lift, deliverability/inbox %, newly-engaged inflow, per-source revenue leaders, and the acquisition-funnel figures are mock-shaped and need their real sources (send logs, schedule data, Beehiiv segments, Meta Ads, copy-variation analysis).
6. **Look-back window & grain.** How many months back should the stepper go, and do finished months use real daily curves (mock synthesizes them)?
7. **Locations & loss composition** are intentionally **out of scope** for this report — they belong in a dedicated Locations sub-report (under Acquisition) and the Subscribers/Retention sub-report respectively.
