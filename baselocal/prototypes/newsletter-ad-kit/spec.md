# Newsletter Ad Kit — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `newsletter-ad-kit`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/newsletter-ad-kit/](https://base-iq.github.io/previews/baselocal/prototypes/newsletter-ad-kit/)

---

## 1. Goal

A 7-page PDF-first kit for **professional newsletter ad buyers** — the second of BaseLocal's two prospect paths. Where `partner-media-kit` sells the performance capability (we write, test, and scale) to prospects who don't know newsletters, this kit rents distribution to buyers who do: supplied creative, two bookable positions plus a combo, flat-rate or CPC deals, rates on request. It's built to be skimmed in ninety seconds: reach → environment → inventory → specs → booking.

**The selling model:** ONE direct placement is sold per edition. The buyer chooses position — Lead Feature, Inline Feature 1, or both as the Combo (same brand, same morning). Lead/Inline/Combo are options for that single daily placement, not separately sellable concurrent slots.

Same Deck / Print component system as `partner-media-kit` (design-system.md § Deck / Print Components), so the brand reads consistent if a prospect sees both.

## 2. User flow

| # | Page | Job |
|---|------|-----|
| 01 | Cover (`Doc. 01`) | "A million readers. Two placements." + title block (inventory, creative, deals, rates posture) |
| 02 | Reach & audience (`Fig. 02`) | 49% hero, stat grid (944K / 30.4M / 403 / 8×), audience strip |
| 03 | The environment (`Fig. 03`) | Edition map with three-state legend: Editorial / Bookable direct / House-run |
| 04 | The inventory (`Fig. 04`) | Three cards: Lead Feature, Inline Feature 1, The Combo (featured, 2px terracotta). Logo strip |
| 05 | Creative & specs (`Fig. 05`) | "You write it. We run it." + spec rows (format, links, disclosure, standards, reporting) |
| 06 | How booking works (`Fig. 06`) | 3 steps (send → schedule network-wide → read results) + deal-terms title block |
| 07 | Booking (`Doc. 07`) | Close: "Tell us the offer and the dates." Rates on request. No contact line (sender is the contact) |

**Positioning spine:** scarcity and simplicity. Only two slots sold direct (one brand each, per edition), everything else in the email is editorial or house-run, one insertion order covers the whole network. The craft/pilot story from `partner-media-kit` is deliberately absent — this audience brings its own creative and doesn't need the trust mechanics explained.

## 3. States

Same two render targets as `partner-media-kit`: screen (container-query scaled pages) and print (13.33in × 7.5in, one page per sheet, exact colors). No motion, no links, no forms. Regenerate the PDF after every content change (§7).

## 4. Copy

- **Screen bar:** "BaseLocal · Newsletter ad kit — 7 pages · Print to PDF with ⌘P / Ctrl+P (pages are pre-sized, no margins needed)"
- **01 Cover:** title "The front of the morning email, sold direct." · standfirst "Daily local newsletters across 403 U.S. cities. You bring the copy; we run it network-wide, at the top of the email." · head meta "Direct placements · supplied creative" · title block: Inventory "Lead Feature · Inline Feature 1 · The Combo" / Creative "Supplied by you" / Deals "Flat rate or CPC" / Rates "On request, per offer" · footer: right side only, "Updated June 2026 · 01" (no caption)
- **02 Reach:** hero "49% / Average open rate, network-wide" + sub "Measured across every edition in every city." · grid 944K Active subscribers / 30.4M Emails delivered / 30d / 403 Cities & areas / 8× Sends per week · audience strip "**73% women, most 50+,** in mid-size and large U.S. cities. They read at morning-coffee pace and act on what the email recommends." · source "BaseLocal network analytics, June 2026."
- **03 Environment:** lede "Your ad runs inside an email people actually read." (never "letter" — banned in this brand's vocabulary for the product) · body explains editorial-first + house-run recommendations; bold line "**One placement is sold direct each morning,** with a choice of position: the Lead Feature, Inline Feature 1, or both as a combo. All of it sits in the front half of the email." · map legend Editorial / Bookable direct / House-run · source "Format: 7xv1 daily edition · placement map, June 2026."
- **04 Inventory:** head meta "One direct placement per edition" · card eyebrows "Option 01 / Option 02 / Options 01 + 02" · cards: Lead Feature ("The edition's lead module, right after the masthead. The first thing every opener sees.") / Inline Feature 1 ("A dedicated module in the front half of the edition, between the morning's editorial sections.") / The Combo, featured ("Lead Feature and Inline Feature 1, same brand, same morning. Two touches before the events calendar, and the pairing tends to perform well.") · each card carries an estimate block: Lead Feature "500–1,500 / Est. unique clicks per send / 0.05–0.15% CTR on ~1M delivered"; Inline Feature 1 "200–500 / … / 0.02–0.05% CTR"; The Combo "700–2,000 / … / 0.07–0.20% CTR" · shared-terms line under the grid, stated once (not per card): "Every placement runs network-wide, in every edition, as a flat-rate or CPC deal." · estimate disclaimer line: "Click ranges reflect typical recent feature placements. Actuals vary with the offer and the copy." · footer: source "Placement inventory, June 2026." + folio (logo strip removed by request — this kit shows no partner logos)
- **05 Creative & specs:** lede "You write it. We run it." + supporting paragraphs · spec rows (four): Format "**Bold lead-in + body + linked CTA,** text-native, matching the edition's type." / Links "Your tracking URLs, run as supplied." / Disclosure "Paid items carry the house asterisk." / Reporting "Delivered, opens, and unique clicks per send." · source "Detailed copy specs supplied at booking." (A Standards row was deliberately removed — goes without saying at this stage; revisit only if a real policy doc exists.)
- **06 Booking works:** steps "Send the offer and the dates" / "We schedule it network-wide" ("One insertion order covers every city. No per-market negotiation, no remnant inventory.") / "Read the results together" ("Send-level reporting after every run. CPC deals settle on tracked clicks.") · title block: Sold direct "No marketplace markup" / Exclusivity "One direct advertiser per edition" / Deals / Rates · caption "Dates are first-come. One direct placement a morning means the calendar is the constraint."
- **07 Close:** lede "Tell us the offer and the dates." + body; bold "**One booking covers every city, the same morning.**" · title block repeats cover terms · footer: folio only (no caption)

Em-dash budget: zero prose em dashes in this kit (chrome dashes in "Fig. NN — Label" only). "A million" is the voice form; the exact 944K appears only on Fig. 02.

## 5. Data requirements

| Figure | Value | Source | Notes |
|---|---|---|---|
| 49% / 944K / 30.4M | Figs. 01–02 | live network figures, provided by Corry 2026-06-11 | shared with partner-media-kit; refresh both kits together |
| 403 cities / 8× sends | Figs. 01–03 | May snapshot + cadence per Corry | confirm 403 at next refresh |
| Bookable inventory | Lead Feature, Inline Feature 1, Combo only | Corry, this session | the other 9 paid slots are house-run and not for sale |
| "Pairing tends to perform well" | Fig. 04 Combo card | Corry, this session | qualitative by design; the combo's click range now quantifies it |
| Click estimates | Lead 500–1,500 · Inline 1 200–500 · Combo 700–2,000 per send | Corry, 2026-06-11 | CTRs derived as clicks ÷ ~1.01M delivered per send (30.4M / 30 days): 0.05–0.15% / 0.02–0.05% / 0.07–0.20%. Re-derive whenever the click ranges or delivered volume change |
| Logo strip | 5 recognizable brands | `assets/partner-logos-media-kit/` | "Brands that have run here" — verify each actually ran before partner use |

## 6. Payment / external integrations

None. No links in the deck. Deals are flat rate or CPC, negotiated per offer; no rates printed anywhere.

## 7. Open questions

1. **Copy specs are placeholder-level.** "Detailed copy specs supplied at booking" papers over real unknowns: character limits per slot, image support, subject-line mentions, category exclusions. Define and add a real spec row set when ops confirms.
2. **Lead times and cancellation terms** aren't stated. Buyers will ask; either add a row or keep it conversational on purpose.
3. ~~"Brands that have run here"~~ — removed by request 2026-06-11; this kit shows no partner logos. If a logo strip ever returns, verify each brand ran as a direct/paid placement first.
4. ~~Benchmark CTRs~~ — resolved: per-option click ranges + derived CTRs now on Fig. 04 (values from Corry, 2026-06-11). Remaining: confirm the ranges hold against placement data at the next stats refresh.
5. **Paved:** the brain mentions Paved as a marketplace channel; "Sold direct · No marketplace markup" assumes direct-only positioning for this kit. Confirm that's how sales wants it framed.
6. **House inventory naming:** Fig. 03 calls WGYB etc. "house-run recommendations" to buyers. Confirm this is how you want the affiliate side described externally.

## 8. Updating this kit

Same rituals as `partner-media-kit/spec.md` §8 (per-edit rules, overflow check, spec sync, stats refresh — the two kits share the network stats and must be refreshed together). PDF export:

```bash
cd ~/Documents/GitHub/previews/baselocal/prototypes/newsletter-ad-kit
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="baselocal-newsletter-ad-kit.pdf" \
  "http://localhost:8000/baselocal/prototypes/newsletter-ad-kit/"
```

Confirm 7 pages after export. To update in a future session: **"iterate on the baselocal newsletter-ad-kit prototype."**
