# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SCENIC ("Simulation Check for Events and Infrastructure Complexity") is a static, client-side web tool for assessing whether an event would benefit from a visitor-flow simulation. There is no backend and no build step — plain HTML/CSS/JS served as static files, with Bootstrap 5 and Chart.js pulled from CDN.

## Commands

```bash
npm ci                                     # install dependencies
npm run format                             # format all files with Prettier (write)
npm run format:check                       # check formatting (used in CI)
npx playwright install chromium --with-deps  # one-time browser setup for tests
npm run test                               # run the Playwright E2E suite (tests/scenic.spec.js)
npm run test:ui                            # run tests in Playwright's UI mode
npm run test:headed                        # run tests in a visible browser
```

To run a single test, use Playwright's `-g` grep filter, e.g.:

```bash
npx playwright test tests/ -g "calculates correctly: large event with increased weather factor"
```

The test suite starts its own static server (`npx serve . -p 3000 -s`) via `webServer` in `playwright.config.js`, so tests can just be run directly — no manual server start needed. To preview manually, run `npx serve . -p 3000 -s` and open `http://localhost:3000`.

A Husky pre-commit hook runs `lint-staged`, which formats staged `*.{js,html,css}` files with Prettier automatically.

## Architecture

### The two-page flow: `index.html` → MS Forms → `chart.html`

- **`index.html`** is a multi-tab wizard form (Bootstrap tabs, one tab per assessment category: Grunddaten, Veranstaltungsgelände, Gestalt, Beschaffenheit, Veranstaltungsverlauf, Wiederkehr, Besuchendenverhalten, Daten spenden). All logic lives in one inline `<script>` at the bottom of the file (IIFE, no modules/bundler).
  - Forward tab navigation is blocked until all `required` fields in every preceding tab are valid (`show.bs.tab` guard); backward navigation is always allowed.
  - On submit, form values are read into a `data` object, a weighted **score** is computed from named ID groups (`IDS_VENUE`, `IDS_SHAPE`, `IDS_COND`, `IDS_FLOW`, `IDS_RECUR`, `IDS_BEHAVIOR`) using `multiplyFactors`/`addFactors`/`calcPersonFactor` (person count factor is `log2(n)`), and a step-by-step **progression** array (cumulative product) is also computed — this is what the chart later plots.
  - The progression + person count is written to `localStorage['scenic_current']` as `{ p, v }`, then the browser navigates to an MS Forms URL with the form data JSON-encoded in a query param (the survey/data-donation step — this is an external MS Forms link, not part of this repo).
  - The MS Forms "thank you" page (external, not in this repo) links back to `chart.html`.
- **`chart.html`** reads `scenic_current` from `localStorage` and renders the result: total score, a step-by-step bar/line breakdown against `STEPS` labels, and KDE-style distribution comparisons against historical data fetched from `resources/werteverlauf.json` (an array of past `{ p, v }` submissions, same shape as `scenic_current`). If no `scenic_current` data exists, it shows a placeholder with a `loadTestData()` button to generate random sample data — this button is marked as temporary/test-only in the code and should be removed before a real deploy.

**Important:** the scoring formula is duplicated in three places that must stay in sync: `index.html`'s submit handler, `chart.html`'s `loadTestData()`, and the expected values in `tests/scenic.spec.js`'s "Calculation correctness" suite. Changing the weighting logic requires updating all three.

### Shared chrome

- **`navbar.js`** injects the navbar via `document.currentScript.insertAdjacentHTML`, computed relative to whether the current page lives in `sites/` or the repo root (adjusts link prefixes accordingly). Every page includes it via `<script src="navbar.js">` (root pages) or `<script src="../navbar.js">` (pages in `sites/`).
- **`custom.css`** holds shared styling on top of Bootstrap 5.3.3 + Bootstrap Icons 1.11.3 (both loaded from `cdn.jsdelivr.net`).
- **`sites/`** contains secondary/informational pages (background, procedure description, examples, FAQ, about-us, simulation intro/quiz) that share the navbar/CSS but have no interactive logic of note.
- **`resources/`** holds static content referenced by pages: `werteverlauf.json` (historical results for the chart) plus images/assets for `intro`, `simulation`, `simulations-quiz`, and `evacuation` sections.

### Deployment

Pushes to `main` deploy the entire repo as-is to GitHub Pages (`.github/workflows/static.yml`) — there's no build step, so whatever is committed is what's served. `format.yml` and `playwright.yml` run on every PR and push to `main` and must pass (Prettier check + full Playwright suite in Chromium).

<!-- shared-agents:start -->
## Shared Agents & Skills (workspace rules)
The workspace-wide rules live in `../CLAUDE.md` (root of `/Users/rheid/Development/Agents`) and are loaded automatically by Claude Code. They contain the table of all sibling agents (folder, hand-over topic, constraint), the shared skills (`../AI_Shared_Skills_Library/SKILL.md`, `ict-api-gateway`, `send-email`/`mail-agent`), the `CONTEXT.md` convention, the port register and the Node.js rules.

Hard rule: **never** use another agent's folder, scripts, credentials or files on your own initiative. If a task fits a sibling agent better, ask first: *"This fits `<Agent>` (<reason>). Should I hand it over?"* Only after explicit confirmation read that agent's `CLAUDE.md`/`AGENTS.md` in full, work inside its folder under its rules, report back and return to your own role. One confirmation covers one task.
<!-- shared-agents:end -->
