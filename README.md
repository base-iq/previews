# BaseIQ Previews

Live gallery: **https://base-iq.github.io/previews/**

Static host for HTML artifacts across BaseIQ role projects — newsletter formats, bridge pages, design-system previews, anything the team needs to click and see rendered.

## How It Works

Role projects publish HTML artifacts here via the `/share-preview` skill. Each artifact gets a stable URL:

```
https://base-iq.github.io/previews/{project}/{artifact}/
```

Examples:
- `https://base-iq.github.io/previews/newsletter-strategist/7xv1/`
- `https://base-iq.github.io/previews/newsletter-strategist/weekly-neighbors-v1/`

## Structure

```
previews/
├── .nojekyll                  # Tell GitHub Pages to serve files as-is (no Jekyll processing)
├── index.html                 # Auto-generated gallery of every artifact
├── {project}/
│   └── {artifact}/
│       ├── index.html         # Auto-generated landing page (lists variants) or source-provided
│       ├── {variant}.html
│       └── [assets, styles, etc.]
└── bin/
    └── regen.sh               # Regenerates the top-level gallery
```

## Overwrite Semantics

Each publish **overwrites** the artifact's previous contents. URLs stay stable across updates. No version history — the source repo (Brain, role project) is the history.

## Adding New Artifacts

Don't write here by hand. Use the `/share-preview` skill from whichever role project produced the HTML. It handles copying, landing page generation, gallery regeneration, and the commit/push.
