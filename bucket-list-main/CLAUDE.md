# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step required. Open directly in a browser or serve with:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

There are no tests, no linter, and no package manager configured.

## Architecture

Two-layer architecture with a strict separation between data and UI:

**Data layer — `js/storage.js`**
- `BucketStorage` is a plain object (not a class) that owns all `localStorage` reads and writes
- Every mutating method (`addItem`, `updateItem`, `deleteItem`, `toggleComplete`) does a full load → mutate → save cycle to keep the stored JSON as the single source of truth
- `getStats()` and `getFilteredList(filter)` are the only read-only helpers used by the UI

**UI layer — `js/app.js`**
- `BucketListApp` class caches DOM references once in `cacheElements()` and never queries the DOM again after init
- All renders are full re-renders: `render()` calls `updateStats()` then replaces `bucketListContainer.innerHTML` entirely
- Inline `onclick="app.method()"` handlers in generated HTML reference the global `app` instance declared at the bottom of the file
- Modal state is tracked by `this.editingId`; opening/closing the modal is done by toggling `hidden`/`flex` Tailwind classes

**Data model** (stored as a JSON array under key `bucketList`):
```js
{ id: string, title: string, completed: boolean, createdAt: ISO string, completedAt: ISO string | null }
```

**Styling** — Tailwind CSS via CDN handles layout; `css/styles.css` adds animations (`slideIn`, `fadeIn`, `scaleIn`), filter-button active state, mobile breakpoint overrides (`max-width: 640px`), and a system dark-mode block (`prefers-color-scheme: dark`).
