# BaseIQ Previews

Live gallery: **https://base-iq.github.io/previews/**

Static host for HTML artifacts across BaseIQ role projects — newsletter formats, bridge pages, design-system previews, anything the team needs to click and see rendered.

## URL Pattern

Each artifact gets a stable URL:

```
https://base-iq.github.io/previews/{project}/{artifact}/
```

Examples:
- `https://base-iq.github.io/previews/newsletter-strategist/7xv1/`
- `https://base-iq.github.io/previews/newsletter-strategist/top-10-weekly/`

## Structure

```
previews/
├── .nojekyll                              # Tell GitHub Pages to serve files as-is (no Jekyll)
├── index.html                             # Auto-generated gallery
├── bin/
│   ├── regen-gallery.js                   # Regenerates the top-level gallery
│   └── regen-landing.js                   # Regenerates a single artifact's variant landing page
└── {project}/
    ├── styles/                            # Shared CSS for the project (no index.html → not in gallery)
    └── {artifact}/
        ├── index.html                     # Auto-generated landing page or source-provided
        ├── {variant}.html
        └── [assets]
```

## Two Ways Artifacts Get Here

**Direct (canonical for `newsletter-strategist`).** HTML, CSS, and assets live here as the source of truth. Edit in place, commit, push. GitHub Pages rebuilds in ~60 seconds. After adding a new artifact folder, run the regen scripts so it appears correctly in the gallery and variant landing pages:

```bash
node bin/regen-landing.js {project}/{artifact}    # only if multiple variants — generates index.html
node bin/regen-gallery.js                         # always — refreshes the top-level gallery
```

**Mirrored via `/share-preview`.** Some artifacts are drafted in a private location first. The user-level `/share-preview` skill copies a self-contained source folder here and runs the regen scripts. Used by role projects that can't keep their drafts in a public repo.

## Overwrite Semantics

Each publish **overwrites** the artifact's previous contents. URLs stay stable across updates. No version history kept here — the source repo (Brain, role project) is the history.

## Redirect Aliases

When a previously-shared URL is consolidated under a different path, the original URL stays alive as a redirect alias. The alias folder's `index.html` carries `<!-- redirect-to: ../{path} -->` on line 2. `regen-gallery.js` recognizes the marker and excludes alias folders from the gallery — the URL still resolves but doesn't clutter the listing.

## Folders Without `index.html`

Folders that hold supporting assets only (no `index.html`) — such as a project's shared `styles/` folder — are automatically excluded from the gallery. They still serve files; they just aren't listed as artifacts.
