# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenic.spec.js >> Tooltips >> each help icon has a non-empty title attribute
- Location: scenic.spec.js:479:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: null
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
```

# Test source

```ts
  384 |   test('modal does not show when required tab fields are all filled', async ({ page }) => {
  385 |     await page.goto('/index.html');
  386 |     await page.fill('#grunddaten_personenzahl', '100');
  387 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  388 |     await page.click('#nextStepBtn');
  389 |     await expect(page.locator('#validationModal')).toBeHidden();
  390 |   });
  391 | });
  392 | 
  393 | // ─────────────────────────────────────────────────────────────────────────────
  394 | // 10. Form submission
  395 | // ─────────────────────────────────────────────────────────────────────────────
  396 | 
  397 | test.describe('Form submission', () => {
  398 |   test('submit redirects to LimeSurvey URL with JSON payload', async ({ page }) => {
  399 |     await page.goto('/index.html');
  400 |     await fillAllFields(page);
  401 | 
  402 |     // Navigate to the donate tab
  403 |     await fillTabsUpTo(page, '#tab-donate');
  404 |     await goToTab(page, '#tab-donate');
  405 | 
  406 |     // Intercept navigation instead of following it
  407 |     const [request] = await Promise.all([
  408 |       page.waitForRequest(req => req.url().includes('limesurvey')),
  409 |       page.click('#submitBtn'),
  410 |     ]);
  411 | 
  412 |     expect(request.url()).toContain('freiburg.limesurvey.net');
  413 |     expect(request.url()).toContain('577923');
  414 |     expect(request.url()).toContain('G01Q01=');
  415 |   });
  416 | 
  417 |   test('submitted URL contains encoded JSON with personenzahl', async ({ page }) => {
  418 |     await page.goto('/index.html');
  419 |     await fillAllFields(page);
  420 |     await page.fill('#grunddaten_personenzahl', '2500');
  421 |     await goToTab(page, '#tab-donate');
  422 | 
  423 |     const [request] = await Promise.all([
  424 |       page.waitForRequest(req => req.url().includes('limesurvey')),
  425 |       page.click('#submitBtn'),
  426 |     ]);
  427 | 
  428 |     const url = decodeURIComponent(request.url());
  429 |     const jsonMatch = url.match(/G01Q01=(.+)/);
  430 |     expect(jsonMatch).toBeTruthy();
  431 |     const payload = JSON.parse(jsonMatch[1]);
  432 |     expect(payload.personenzahl).toBe('2500');
  433 |   });
  434 | 
  435 |   test('submitted payload contains ergebnis (computed result)', async ({ page }) => {
  436 |     await page.goto('/index.html');
  437 |     await fillAllFields(page);
  438 |     await goToTab(page, '#tab-donate');
  439 | 
  440 |     const [request] = await Promise.all([
  441 |       page.waitForRequest(req => req.url().includes('limesurvey')),
  442 |       page.click('#submitBtn'),
  443 |     ]);
  444 | 
  445 |     const url = decodeURIComponent(request.url());
  446 |     const payload = JSON.parse(url.match(/G01Q01=(.+)/)[1]);
  447 |     expect(payload).toHaveProperty('ergebnis');
  448 |     expect(parseFloat(payload.ergebnis)).toBeGreaterThan(0);
  449 |   });
  450 | 
  451 |   test('submitted payload includes Veranstaltungsname when provided', async ({ page }) => {
  452 |     await page.goto('/index.html');
  453 |     await fillAllFields(page);
  454 |     await page.fill('#grunddaten_veranstaltungsname', 'Karneval 2026');
  455 |     await goToTab(page, '#tab-donate');
  456 | 
  457 |     const [request] = await Promise.all([
  458 |       page.waitForRequest(req => req.url().includes('limesurvey')),
  459 |       page.click('#submitBtn'),
  460 |     ]);
  461 | 
  462 |     const url = decodeURIComponent(request.url());
  463 |     const payload = JSON.parse(url.match(/G01Q01=(.+)/)[1]);
  464 |     expect(payload.veranstaltungsname).toBe('Karneval 2026');
  465 |   });
  466 | });
  467 | 
  468 | // ─────────────────────────────────────────────────────────────────────────────
  469 | // 11. Tooltip accessibility
  470 | // ─────────────────────────────────────────────────────────────────────────────
  471 | 
  472 | test.describe('Tooltips', () => {
  473 |   test('help icons are present on required fields', async ({ page }) => {
  474 |     await page.goto('/index.html');
  475 |     const helpIcons = page.locator('.help-icon');
  476 |     expect(await helpIcons.count()).toBeGreaterThan(0);
  477 |   });
  478 | 
  479 |   test('each help icon has a non-empty title attribute', async ({ page }) => {
  480 |     await page.goto('/index.html');
  481 |     const icons = await page.locator('.help-icon').all();
  482 |     for (const icon of icons) {
  483 |       const title = await icon.getAttribute('title');
> 484 |       expect(title).toBeTruthy();
      |                     ^ Error: expect(received).toBeTruthy()
  485 |     }
  486 |   });
  487 | });
  488 | 
```