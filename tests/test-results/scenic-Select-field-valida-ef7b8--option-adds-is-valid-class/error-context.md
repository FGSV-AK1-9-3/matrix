# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenic.spec.js >> Select field validation feedback >> selecting a valid option adds is-valid class
- Location: scenic.spec.js:182:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#tab-gelaende.active') to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "SCENIC" [ref=e4] [cursor=pointer]:
        - /url: index.html
      - list [ref=e6]:
        - listitem [ref=e7]:
          - link "Matrix" [ref=e8] [cursor=pointer]:
            - /url: index.html
        - listitem [ref=e9]:
          - link "Einführung" [ref=e10] [cursor=pointer]:
            - /url: sites/intro.html
        - listitem [ref=e11]:
          - link "Hintergrund" [ref=e12] [cursor=pointer]:
            - /url: sites/background.html
        - listitem [ref=e13]:
          - link "Verfahren" [ref=e14] [cursor=pointer]:
            - /url: sites/procedure_description.html
  - generic [ref=e15]:
    - heading " SCENIC" [level=1] [ref=e16]:
      - generic [ref=e17]: 
      - text: SCENIC
    - heading "Simulation Check for Events and Infrastructure Complexity" [level=2] [ref=e18]
    - paragraph [ref=e19]: Bitte nacheinander alle Felder ausfüllen. Das Ergebnis wird am Ende angezeigt.
    - generic [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]: Fortschritt
        - generic [ref=e23]: 0%
      - generic [ref=e24]:
        - progressbar
    - tablist [ref=e25]:
      - tab " Grunddaten" [selected] [ref=e26] [cursor=pointer]:
        - generic [ref=e27]: 
        - text: Grunddaten
      - tab " Veranstaltungsgelände" [ref=e28] [cursor=pointer]:
        - generic [ref=e29]: 
        - text: Veranstaltungsgelände
      - tab " Gestalt" [ref=e30] [cursor=pointer]:
        - generic [ref=e31]: 
        - text: Gestalt
      - tab " Beschaffenheit" [ref=e32] [cursor=pointer]:
        - generic [ref=e33]: 
        - text: Beschaffenheit
      - tab " Veranstaltungsverlauf" [ref=e34] [cursor=pointer]:
        - generic [ref=e35]: 
        - text: Veranstaltungsverlauf
      - tab " Wiederkehr" [ref=e36] [cursor=pointer]:
        - generic [ref=e37]: 
        - text: Wiederkehr
      - tab " Besuchendenverhalten" [ref=e38] [cursor=pointer]:
        - generic [ref=e39]: 
        - text: Besuchendenverhalten
      - tab " Daten spenden" [ref=e40] [cursor=pointer]:
        - generic [ref=e41]: 
        - text: Daten spenden
    - generic [ref=e42]:
      - generic [ref=e43]:
        - tabpanel [ref=e44]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - generic [ref=e48]: Veranstaltungsname
              - textbox "Veranstaltungsname" [ref=e49]
            - generic [ref=e50]:
              - generic [ref=e51]:
                - text: Personenzahl
                - generic [ref=e52]: "?"
                - text: "*"
              - spinbutton "Personenzahl ? *" [ref=e53]: "0"
        - text: "* * * * * * * * * * * * * * * * *  "
      - generic [ref=e54]:
        - button " Zurücksetzen" [ref=e55] [cursor=pointer]:
          - generic [ref=e56]: 
          - text: Zurücksetzen
        - button " Nächster Schritt" [ref=e57] [cursor=pointer]:
          - generic [ref=e58]: 
          - text: Nächster Schritt
  - dialog "Es fehlen Angaben" [active] [ref=e59]:
    - generic [ref=e60]:
      - generic [ref=e61]:
        - heading "Es fehlen Angaben" [level=5] [ref=e62]
        - button "Schließen" [ref=e63] [cursor=pointer]
      - generic [ref=e64]:
        - text: "Bitte treffen Sie zunächst in allen Pflichtfeldern eine Auswahl:"
        - list [ref=e65]:
          - listitem [ref=e66]: Personenzahl ?
      - button "OK" [ref=e68] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * scenic.spec.js
  3   |  * Playwright end-to-end tests for the SCENIC form (index.html)
  4   |  *
  5   |  * Setup:
  6   |  *   npm install --save-dev @playwright/test
  7   |  *   npm install --save-dev serve          # static file server
  8   |  *   npx playwright install chromium
  9   |  *   npx playwright test
  10  |  *
  11  |  * The playwright.config.js starts `serve . -p 3000` automatically.
  12  |  */
  13  | 
  14  | import { test, expect } from '@playwright/test';
  15  | 
  16  | // ─────────────────────────────────────────────────────────────────────────────
  17  | // Helpers
  18  | // ─────────────────────────────────────────────────────────────────────────────
  19  | 
  20  | /** Fill every required field so the whole form is valid. */
  21  | async function fillAllFields(page) {
  22  |   await page.fill('#grunddaten_personenzahl', '1000');
  23  | 
  24  |   const selectors = {
  25  |     '#veranstaltungsgelaende_flaechenverhaeltnis': '1.0',
  26  |     '#veranstaltungsgelaende_verkehrsstaerke':      '1.0',
  27  |     '#veranstaltungsgelaende_stoerungen':           '1.0',
  28  |     '#veranstaltungsgelaende_wegfuehrung':          '1.0',
  29  |     '#veranstaltungsgelaende_einlass_auslass':      '1.0',
  30  |     '#gestalt_grundform':                           '1.0',
  31  |     '#beschaffenheit_entlastungsflaechen':          '1.0',
  32  |     '#beschaffenheit_befestigung':                  '1.0',
  33  |     '#beschaffenheit_wetterlage':                   '1.0',
  34  |     '#veranstaltungsverlauf_einlasskontrolle':      '1.0',
  35  |     '#veranstaltungsverlauf_zuablauf':              '1.0',
  36  |     '#veranstaltungsverlauf_attraktionen':          '1.0',
  37  |     '#wiederkehrende_veranstaltung_erfahrung':      '1.0',
  38  |     '#wiederkehrende_veranstaltung_stoerungen':     '0.0',
  39  |     '#besuchendenverhalten_ort_ablauf':             '1.0',
  40  |     '#besuchendenverhalten_involvement':            '1.0',
  41  |     '#besuchendenverhalten_soziale_gruppen':        '1.0',
  42  |   };
  43  | 
  44  |   for (const [selector, value] of Object.entries(selectors)) {
  45  |     await page.selectOption(selector, value);
  46  |   }
  47  | }
  48  | 
  49  | /** Navigate to a tab by its data-bs-target value, e.g. '#tab-gelaende'. */
  50  | async function goToTab(page, target) {
  51  |   await page.click(`[data-bs-target="${target}"]`);
> 52  |   await page.waitForSelector(`${target}.active`);
      |              ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  53  | }
  54  | 
  55  | /** Fill all required fields that appear before (but not including) the given tab. */
  56  | async function fillTabsUpTo(page, tabTarget) {
  57  |   const tabOrder = [
  58  |     '#tab-grunddaten',
  59  |     '#tab-gelaende',
  60  |     '#tab-gestalt',
  61  |     '#tab-beschaffenheit',
  62  |     '#tab-verlauf',
  63  |     '#tab-wiederkehr',
  64  |     '#tab-verhalten',
  65  |     '#tab-donate',
  66  |   ];
  67  |   const stopIdx = tabOrder.indexOf(tabTarget);
  68  | 
  69  |   const fieldsByTab = {
  70  |     '#tab-grunddaten':   async () => { await page.fill('#grunddaten_personenzahl', '500'); },
  71  |     '#tab-gelaende':     async () => {
  72  |       await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
  73  |       await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke',      '1.0');
  74  |       await page.selectOption('#veranstaltungsgelaende_stoerungen',           '1.0');
  75  |       await page.selectOption('#veranstaltungsgelaende_wegfuehrung',          '1.0');
  76  |       await page.selectOption('#veranstaltungsgelaende_einlass_auslass',      '1.0');
  77  |     },
  78  |     '#tab-gestalt':      async () => { await page.selectOption('#gestalt_grundform', '1.0'); },
  79  |     '#tab-beschaffenheit': async () => {
  80  |       await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
  81  |       await page.selectOption('#beschaffenheit_befestigung',         '1.0');
  82  |       await page.selectOption('#beschaffenheit_wetterlage',          '1.0');
  83  |     },
  84  |     '#tab-verlauf':      async () => {
  85  |       await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
  86  |       await page.selectOption('#veranstaltungsverlauf_zuablauf',         '1.0');
  87  |       await page.selectOption('#veranstaltungsverlauf_attraktionen',     '1.0');
  88  |     },
  89  |     '#tab-wiederkehr':   async () => {
  90  |       await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '1.0');
  91  |       await page.selectOption('#wiederkehrende_veranstaltung_stoerungen','0.0');
  92  |     },
  93  |     '#tab-verhalten':    async () => {
  94  |       await page.selectOption('#besuchendenverhalten_ort_ablauf',      '1.0');
  95  |       await page.selectOption('#besuchendenverhalten_involvement',     '1.0');
  96  |       await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
  97  |     },
  98  |   };
  99  | 
  100 |   for (let i = 0; i < stopIdx; i++) {
  101 |     const tab = tabOrder[i];
  102 |     if (fieldsByTab[tab]) await fieldsByTab[tab]();
  103 |   }
  104 | }
  105 | 
  106 | // ─────────────────────────────────────────────────────────────────────────────
  107 | // 1. Page load
  108 | // ─────────────────────────────────────────────────────────────────────────────
  109 | 
  110 | test.describe('Page load', () => {
  111 |   test('page title contains SCENIC', async ({ page }) => {
  112 |     await page.goto('/index.html');
  113 |     await expect(page).toHaveTitle(/SCENIC/);
  114 |   });
  115 | 
  116 |   test('Grunddaten tab is active by default', async ({ page }) => {
  117 |     await page.goto('/index.html');
  118 |     await expect(page.locator('#tab-grunddaten')).toHaveClass(/show active/);
  119 |   });
  120 | 
  121 |   test('progress bar starts at 0%', async ({ page }) => {
  122 |     await page.goto('/index.html');
  123 |     await expect(page.locator('#progress_text')).toHaveText('0%');
  124 |     await expect(page.locator('#progress_bar')).toHaveAttribute('style', /width:\s*0%/);
  125 |   });
  126 | 
  127 |   test('"Nächster Schritt" button is visible on load', async ({ page }) => {
  128 |     await page.goto('/index.html');
  129 |     await expect(page.locator('#nextStepBtn')).toBeVisible();
  130 |   });
  131 | 
  132 |   test('submit button exists inside the donate tab', async ({ page }) => {
  133 |     await page.goto('/index.html');
  134 |     await expect(page.locator('#submitBtn')).toBeAttached();
  135 |   });
  136 | });
  137 | 
  138 | // ─────────────────────────────────────────────────────────────────────────────
  139 | // 2. Grunddaten tab — Personenzahl field
  140 | // ─────────────────────────────────────────────────────────────────────────────
  141 | 
  142 | test.describe('Grunddaten — Personenzahl', () => {
  143 |   test.beforeEach(async ({ page }) => {
  144 |     await page.goto('/index.html');
  145 |   });
  146 | 
  147 |   test('field accepts a positive number and gains is-valid class', async ({ page }) => {
  148 |     await page.fill('#grunddaten_personenzahl', '500');
  149 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  150 |     await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-valid/);
  151 |   });
  152 | 
```