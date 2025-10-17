# Probo Highlighter Script

## Source

This file is copied from the `probo-js` monorepo:

**Source path**: `/probo-js/packages/probo-highlighter/dist/probolabs.umd.js`
**Version**: 1.0.11
**Last updated**: 2025-10-17

## Purpose

The highlighter script is used by the scenario outputs generation API to:
1. Find all interactive elements on a page (clickable, fillable, selectable)
2. Generate numbered overlays for screenshots
3. Extract element metadata (CSS selectors, XPath, bounding boxes, etc.)

## Updating

To update this file when the highlighter changes:

```bash
# From probo-qa root directory:
cp ../probo-js/packages/probo-highlighter/dist/probolabs.umd.js public/probolabs-highlighter.js
```

Or rebuild the highlighter first:

```bash
cd ../probo-js/packages/probo-highlighter
pnpm build
cd -
cp ../probo-js/packages/probo-highlighter/dist/probolabs.umd.js public/probolabs-highlighter.js
```

## API

When injected via Playwright, this script exposes:

```javascript
window.ProboLabs = {
  ElementTag: {
    CLICKABLE: "CLICKABLE",
    FILLABLE: "FILLABLE",
    SELECTABLE: "SELECTABLE",
    NON_INTERACTIVE_ELEMENT: "NON_INTERACTIVE_ELEMENT"
  },

  highlight: {
    execute: async (elementTypes) => { /* ... */ },
    unexecute: () => { /* ... */ },
    generateJSON: async () => { /* ... */ }
  },

  highlightElements: (elements) => { /* ... */ },
  findElements: (elementType) => { /* ... */ },
  // ... and more
}
```

## Size

~90KB minified (UMD bundle)
