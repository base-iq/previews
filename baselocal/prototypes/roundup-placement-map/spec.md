# Roundup Placement Map — Implementation Spec

**Brand:** BaseLocal
**Feature slug:** `roundup-placement-map`
**Prototype:** [https://base-iq.github.io/previews/baselocal/prototypes/roundup-placement-map/](https://base-iq.github.io/previews/baselocal/prototypes/roundup-placement-map/)

---

## 1. Goal

An interactive, annotated replica of a real edition (Naples · Wednesday, June 10, 2026 · No. 182) that calls out every ad placement in the email — the "see it in the wild" companion to the two media kits. Where `newsletter-ad-kit` Fig. 03 shows buyers an abstract edition map, this artifact shows the edition itself: the actual email a million readers got, with every paid unit marked, named in kit vocabulary, and explained on tap.

**Audience:** prospective advertisers, in both buying modes — flat-rate buyers (the ad kit path) and performance partners (the media kit path). Sent alongside or after the kits; also usable live in a sales conversation.

**The label model (this artifact's vocabulary):**

- **Flat Rate** — the direct placements (Lead Feature, Inline Feature 1). Terracotta `#C2604A`.
- **Performance** — house-run placements (In the News, Highlights, We Got Your Back, Inline Feature 2). `#D8CEC8`.
- **Editorial** — everything else, muted in Partner view.

These map to the kits' "Bookable direct" / "House-run" states; this artifact deliberately uses the deal-model words instead. June 10 is the demo edition because Babbel booked **the Combo** (both flat-rate positions, same brand, same morning), so all twelve paid units of the placement map appear in one email.

## 2. User flow

Single page (`index.html`). Top to bottom:

1. **Artifact bar** (espresso, kit screen-bar register) — "BaseLocal · The edition, annotated — Naples · Wednesday, June 10, 2026 · No. 182"
2. **Annotation console** (sticky) — View Toggle (Partner view / Reader view), three-state Annotation Legend, one-line hint that swaps per view
3. **Lede** — "This is what a typical morning roundup looks like." + plain-language context (real edition, 2 flat-rate + 10 performance, every placement runs network-wide) + asterisk fine print
4. **The email replica** — the full June 10 edition, styled by the shared `../../newsletters/styles/newsletter.css`, content verbatim as sent. The page ends on the email's own footer; there is no closing strip.

**Interaction:**

- Page loads in **Partner view** (annotated). Toggling to **Reader view** removes every mark and shows the email exactly as sent; toggling back restores annotations. Open details collapse on switch to Reader view.
- In Partner view, each marked module is clickable (and keyboard-operable: Enter/Space, `role="button"`, `aria-expanded`): it toggles a Placement Detail Card inline beneath/inside the module. Links inside a marked module still behave as links (clicks on `<a>` don't toggle).
- The three In the News paid items share one detail card (one slot, three units); each item is individually ringed, the first carries the tag. We Got Your Back works the same way: five individually ringed items, tag on the first, one shared detail card.

**Placement inventory annotated (12 paid units):**

| Module in the email | Slot name | State | Tag shown |
|---|---|---|---|
| Intro sponsor paragraph (Babbel) | Lead Feature | Flat Rate | Lead Feature · Flat Rate |
| 3 starred items after the news stories | In the News | Performance | In the News · Performance (first item only) |
| 1 starred bullet in Highlights | Highlights | Performance | Highlights · Performance |
| Section 02 sponsor module (Babbel) | Inline Feature 1 | Flat Rate | Inline Feature 1 · Flat Rate |
| Section 04, five cards (each individually ringed) | We Got Your Back | Performance | We Got Your Back · Performance (first item only) |
| Section 06 sponsor module (Lemonade) | Inline Feature 2 | Performance | Inline Feature 2 · Performance |

Muted as editorial in Partner view: masthead, intro paragraph, the 3 news stories, 3 of 4 highlights, Local Business Spotlight (including its Advertise CTA), submit-event CTA card, Event Calendar, The Naples Report, sign-off. The newsletter footer stays unmuted — its disclosure line is part of the annotation story. Top-links stay unmuted (navigation chrome).

## 3. States

- **Partner view (default):** editorial muted (35% opacity + grayscale), paid modules ringed (2px inset, state color) and tagged, details closed until tapped.
- **Reader view:** zero annotation, faithful email. Triggers get `tabindex="-1"`.
- **Detail open/closed:** per slot group; `aria-expanded` syncs across all triggers of a shared detail (the In the News trio, the We Got Your Back five).
- **Reduced motion:** all transitions collapse via the global `prefers-reduced-motion` guard.
- **No forms, no async states.** Every link on the page is an `href="#"` placeholder; the artifact has no outbound links.

## 4. Copy

Annotation-layer strings only — everything inside the email replica is the June 10 edition verbatim (as-sent content is not edited, including its em dashes and emoji).

- **Artifact bar:** "**BaseLocal** · The edition, annotated — Naples · Wednesday, June 10, 2026 · No. 182"
- **Toggle options:** "Partner view" / "Reader view"
- **Legend:** "Editorial" / "Flat Rate" / "Performance"
- **Console hint (partner):** "Tap any marked module for the slot details." **(reader):** "Viewing the edition exactly as readers got it."
- **Lede H1:** "This is what a typical morning roundup looks like."
- **Lede body, ¶1:** "A real edition, sent to Naples readers on June 10, 2026. Every ad placement in it is marked below: two flat-rate positions (both Babbel in this edition) and ten performance placements run by our team."
- **Lede body, ¶2:** "Every placement runs network-wide. One booking puts the same module in every city's edition, the same morning."
- **Lede fine print:** "* Readers see the same mark. Every paid item carries the asterisk, tied to the disclosure in the edition's footer."
- **Detail cards** (eyebrow / name / body / estimate):
  - **Lead Feature** — "Flat Rate · Option 01" / "The edition's lead module, right after the masthead. The first thing every opener sees. You supply the creative; it runs network-wide, in every city's email, the same morning. Today it's the first half of Babbel's Combo booking." / est. "500–1,500 est. unique clicks per send · 0.05–0.15% CTR on ~1M delivered"
  - **In the News** — "Performance · Run by our team" / "Recommendations written by our house team, riding inside the morning's news in the editorial voice. Three units ran in this edition; the count flexes morning to morning. Angles that win a pilot graduate here."
  - **Highlights** — "Performance · Run by our team" / "A one-line pick in the morning's list, written by our team. One unit ran in this edition. The smallest paid format in the email, built for offers a single curious click can carry."
  - **Inline Feature 1** — "Flat Rate · Option 02" / "A dedicated module in the front half of the edition, between the morning's editorial sections. Today it's the second touch of Babbel's Combo: both positions, same brand, same morning." / est. "200–500 est. unique clicks per send · the Combo pair: 700–2,000"
  - **We Got Your Back** — "Performance · The pilot slot" / "Five distinct placements, each written by our team, every edition. New offers start here: 3–5 angles enter a one-week pilot, the winners graduate to the louder slots, and the rest stop. The pilot model lives in the partner media kit."
  - **Inline Feature 2** — "Performance · Run by our team" / "A dedicated module in the back half of the edition, house-run. Angles that have already proven themselves in pilots run here at full length. Today: Lemonade pet insurance."

**Style guards:** zero em dashes in annotation-layer prose (middots and commas instead; the email's own copy is exempt as quoted artifact). Never "letter" for the product — "the email" / "the edition." Estimates appear on flat-rate details only.

## 5. Data requirements

| Figure | Value here | Source | Sync rule |
|---|---|---|---|
| Click estimates | Lead 500–1,500 · Inline 1 200–500 · Combo 700–2,000 · CTRs 0.05–0.15% / 0.02–0.05% on ~1M delivered | `newsletter-ad-kit` Fig. 04 (Corry, 2026-06-11) | **Must match the ad kit at all times.** Refresh both in the same session or neither. |
| Placement map | 12 paid units: 1 Lead + 3 ITN + 1 HL + 1 IF1 + 5 WGYB + 1 IF2 | June 10, 2026 Naples edition, as sent | Edition-true. Differs from the kits' generic map (ITN 2 / HL 2) — totals match at 12; the ITN detail card says counts flex. |
| Edition content | Verbatim from baselocal.com/fl/naples/latest-newsletter/?edition=2026-06-10 | live page, fetched 2026-06-12 | Do not edit. If the demo edition is ever swapped, re-pull content verbatim and re-map every annotation. |
| Cover image | `assets/naples-cover.jpg` | CloudFront edition asset, downloaded 2026-06-12 | Local copy so the artifact doesn't depend on the CDN. |
| Pilot framing ("3–5 angles, winners graduate") | WGYB + ITN detail cards | `partner-media-kit` Fig. 07/09 | Re-check if the pilot flow changes. |

Never add internal economics (RPS, LTV, revenue, validation rates) to this artifact — same rule as the kits.

## 6. Payment / external integrations

None. No outbound links anywhere; every link is a placeholder `#`.

## 7. Open questions

1. **Label vocabulary divergence.** This artifact says "Flat Rate / Performance" where the kits say "Bookable direct / House-run." Chosen deliberately (deal-model words for a mixed audience). If the kits ever adopt one vocabulary, align all three artifacts.
2. **Edition permanence.** The June 10 edition is hard-copied here, so the artifact won't drift when baselocal.com rotates editions. Confirm that's the intent vs. periodically refreshing to a newer "full house" edition (one where the Combo ran).
3. **Advertiser names shown.** The replica names Babbel, Lemonade, Incogni, FinanceBuzz, Laura Geller-adjacent items, etc., exactly as sent. The kits' open question about naming partners publicly applies here too — confirm before wide distribution.
4. **In the News count.** The kits' map shows 2 house units in ITN; this edition ran 3. The detail card explains the flex, but confirm sales wants a 3-unit morning as the showcase or would rather demo a 2-unit edition.
5. **Web vs. email fidelity.** The replica reproduces the email body as rendered on the latest-newsletter web page. Some email-client chrome (preheader, beehiiv footer variants) isn't represented. Fine for a sales artifact; flag if pixel-exact email rendering matters.

## 8. Updating this artifact

The folder is the whole project: `index.html` (replica + annotation layer) + `styles.css` (annotation components only) + `assets/naples-cover.jpg` + this spec. The email replica loads the shared `../../newsletters/styles/newsletter.css` — don't fork it; replica fidelity rides on that stylesheet.

To update in a future session: **"iterate on the baselocal roundup-placement-map prototype."**

Per-edit rules:
1. Edit locally; don't push until told to publish.
2. Update the matching section of this spec in the same edit batch.
3. Estimates must stay identical to `newsletter-ad-kit` Fig. 04 — the two artifacts quote the same numbers or neither does (also stated in design-system.md § Annotation Components).
4. Annotation components are specced in `brain/brands/baselocal/design-system.md` § Annotation Components — changes go through `extend-design-system`, never inline.
5. Banned-word grep on annotation-layer copy after any copy change; the email replica is exempt (as-sent artifact).
