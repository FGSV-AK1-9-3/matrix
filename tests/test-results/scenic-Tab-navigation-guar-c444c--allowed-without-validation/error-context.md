# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenic.spec.js >> Tab navigation guard >> backward navigation is always allowed without validation
- Location: scenic.spec.js:278:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('#tab-gelaende')
Expected pattern: /show active/
Received string:  "tab-pane fade active show"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('#tab-gelaende')
    3 × locator resolved to <div role="tabpanel" id="tab-gelaende" class="tab-pane fade active">…</div>
      - unexpected value "tab-pane fade active"
    6 × locator resolved to <div role="tabpanel" id="tab-gelaende" class="tab-pane fade active show">…</div>
      - unexpected value "tab-pane fade active show"

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
        - generic [ref=e23]: 6%
      - progressbar [ref=e25]
    - tablist [ref=e26]:
      - tab " Grunddaten ✓" [ref=e27] [cursor=pointer]:
        - generic [ref=e28]: 
        - text: Grunddaten ✓
      - tab " Veranstaltungsgelände" [selected] [ref=e29] [cursor=pointer]:
        - generic [ref=e30]: 
        - text: Veranstaltungsgelände
      - tab " Gestalt" [ref=e31] [cursor=pointer]:
        - generic [ref=e32]: 
        - text: Gestalt
      - tab " Beschaffenheit" [ref=e33] [cursor=pointer]:
        - generic [ref=e34]: 
        - text: Beschaffenheit
      - tab " Veranstaltungsverlauf" [ref=e35] [cursor=pointer]:
        - generic [ref=e36]: 
        - text: Veranstaltungsverlauf
      - tab " Wiederkehr" [ref=e37] [cursor=pointer]:
        - generic [ref=e38]: 
        - text: Wiederkehr
      - tab " Besuchendenverhalten" [ref=e39] [cursor=pointer]:
        - generic [ref=e40]: 
        - text: Besuchendenverhalten
      - tab " Daten spenden" [ref=e41] [cursor=pointer]:
        - generic [ref=e42]: 
        - text: Daten spenden
    - generic [ref=e43]:
      - generic [ref=e44]:
        - text: "*"
        - tabpanel [ref=e45]:
          - generic [ref=e47]:
            - generic [ref=e48]:
              - generic [ref=e49]:
                - text: Flächenverhältnis
                - generic [ref=e50]: "?"
                - text: "*"
              - combobox "Flächenverhältnis ? *" [ref=e51]:
                - option "Bitte wählen…" [selected]
                - option "Die für Besuchenden zugängliche Fläche entspricht der erwarteten Besucherzahl bei einer Belegungsdichte von 2 Personen pro Quadratmeter; geordneter Personenfluss."
                - option "Die zugängliche Fläche ist um mehr als 20 % größer als die bei 2 Pers./m² erforderliche Fläche; mehr Bewegungsfreiheit, weniger Verdichtung."
            - generic [ref=e52]:
              - generic [ref=e53]:
                - text: Personenverkehrsstärke (qs)
                - generic [ref=e54]: "?"
                - text: "*"
              - combobox "Personenverkehrsstärke (qs) ? *" [ref=e55]:
                - option "Bitte wählen…" [selected]
                - option "Die erwartete spezifische Personenverkehrsstärke (qs) beträgt ≤ 0,7 Pers./ms (z. B. auf An-/Abreisewegen oder Teilflächen). Überwiegend störungsfrei."
                - option "Die erwartete spezifische Personenverkehrsstärke (qs) beträgt ≤ 1,3 Pers./ms. Normale bis leicht erhöhte Auslastung."
                - option "Die erwartete spezifische Personenverkehrsstärke (qs) überschreitet 1,3 Pers./ms. Temporäre Verdichtungen möglich."
            - generic [ref=e56]:
              - generic [ref=e57]:
                - text: Störungen auf Flucht‑ und Rettungswegen
                - generic [ref=e58]: "?"
                - text: "*"
              - combobox "Störungen auf Flucht‑ und Rettungswegen ? *" [ref=e59]:
                - option "Bitte wählen…" [selected]
                - option "Störungen (z. B. gegenläufige Ströme, parallele Nutzungen oder Änderungen im Veranstaltungsverlauf) sind wahrscheinlich."
                - option "Störungen auf den Flucht‑ und Rettungswegen sind unwahrscheinlich; die Wegeführung dürfte ohne wesentliche Einschränkungen funktionieren."
            - generic [ref=e60]:
              - generic [ref=e61]:
                - text: Wegführung
                - generic [ref=e62]: "?"
                - text: "*"
              - combobox "Wegführung ? *" [ref=e63]:
                - option "Bitte wählen…" [selected]
                - option "Bauliche Anlagen und/oder topografische Gegebenheiten bedingen eine unübersichtliche Wegführung; Orientierung erschwert."
                - option "Bauliche Anlagen und/oder topografische Gegebenheiten erlauben eine übersichtliche Wegführung; gute Orientierung."
            - generic [ref=e64]:
              - generic [ref=e65]:
                - text: Einlass / Auslass
                - generic [ref=e66]: "?"
                - text: "*"
              - combobox "Einlass / Auslass ? *" [ref=e67]:
                - option "Bitte wählen…" [selected]
                - option "Ein‑ und Auslass sind räumlich getrennt; klare Strömungsrichtungen unterstützen einen geordneten Ablauf."
                - option "Ein‑ und Auslass sind räumlich nicht getrennt; Begegnungsströme können den Ablauf verlangsamen."
        - text: "* * * * * * * * * * * *  "
      - generic [ref=e68]:
        - button " Zurücksetzen" [ref=e69] [cursor=pointer]:
          - generic [ref=e70]: 
          - text: Zurücksetzen
        - button " Nächster Schritt" [active] [ref=e71] [cursor=pointer]:
          - generic [ref=e72]: 
          - text: Nächster Schritt
```

# Test source

```ts
  183 |     await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
  184 |     await expect(page.locator('#veranstaltungsgelaende_flaechenverhaeltnis')).toHaveClass(/is-valid/);
  185 |   });
  186 | 
  187 |   test('resetting to blank placeholder adds is-invalid class', async ({ page }) => {
  188 |     await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
  189 |     await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '');
  190 |     await expect(page.locator('#veranstaltungsgelaende_flaechenverhaeltnis')).toHaveClass(/is-invalid/);
  191 |   });
  192 | 
  193 |   test('progress bar increases after selecting a value', async ({ page }) => {
  194 |     const before = parseInt(await page.locator('#progress_text').textContent());
  195 |     await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '0.9');
  196 |     const after = parseInt(await page.locator('#progress_text').textContent());
  197 |     expect(after).toBeGreaterThan(before);
  198 |   });
  199 | });
  200 | 
  201 | // ─────────────────────────────────────────────────────────────────────────────
  202 | // 4. Progress bar
  203 | // ─────────────────────────────────────────────────────────────────────────────
  204 | 
  205 | test.describe('Progress bar', () => {
  206 |   test('reaches 100% when all fields are filled', async ({ page }) => {
  207 |     await page.goto('/index.html');
  208 |     await fillAllFields(page);
  209 |     await expect(page.locator('#progress_text')).toHaveText('100%');
  210 |     await expect(page.locator('#progress_bar')).toHaveAttribute('style', /width:\s*100%/);
  211 |   });
  212 | 
  213 |   test('"Nächster Schritt" button hides when form is complete', async ({ page }) => {
  214 |     await page.goto('/index.html');
  215 |     await fillAllFields(page);
  216 |     await expect(page.locator('#nextStepBtn')).toHaveClass(/d-none/);
  217 |   });
  218 | 
  219 |   test('progress is between 0 and 100 for a partial form', async ({ page }) => {
  220 |     await page.goto('/index.html');
  221 |     await page.fill('#grunddaten_personenzahl', '200');
  222 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  223 |     const text = parseInt(await page.locator('#progress_text').textContent());
  224 |     expect(text).toBeGreaterThan(0);
  225 |     expect(text).toBeLessThan(100);
  226 |   });
  227 | });
  228 | 
  229 | // ─────────────────────────────────────────────────────────────────────────────
  230 | // 5. "Nächster Schritt" button — tab navigation
  231 | // ─────────────────────────────────────────────────────────────────────────────
  232 | 
  233 | test.describe('Nächster Schritt button', () => {
  234 |   test.beforeEach(async ({ page }) => {
  235 |     await page.goto('/index.html');
  236 |   });
  237 | 
  238 |   test('shows validation modal when current tab has empty required fields', async ({ page }) => {
  239 |     // Grunddaten tab: Personenzahl = 0 (default) → should open modal
  240 |     await page.click('#nextStepBtn');
  241 |     await expect(page.locator('#validationModal')).toBeVisible();
  242 |   });
  243 | 
  244 |   test('advances to the next tab when current tab is complete', async ({ page }) => {
  245 |     await page.fill('#grunddaten_personenzahl', '500');
  246 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  247 |     await page.click('#nextStepBtn');
  248 |     await expect(page.locator('#tab-gelaende')).toHaveClass(/show active/);
  249 |   });
  250 | 
  251 |   test('missing fields are listed in the validation modal', async ({ page }) => {
  252 |     await page.click('#nextStepBtn');
  253 |     await expect(page.locator('#missingList')).not.toBeEmpty();
  254 |   });
  255 | 
  256 |   test('modal can be dismissed with the OK button', async ({ page }) => {
  257 |     await page.click('#nextStepBtn');
  258 |     await expect(page.locator('#validationModal')).toBeVisible();
  259 |     await page.click('#validationModal .btn-primary');
  260 |     await expect(page.locator('#validationModal')).toBeHidden();
  261 |   });
  262 | });
  263 | 
  264 | // ─────────────────────────────────────────────────────────────────────────────
  265 | // 6. Tab navigation guard (direct click)
  266 | // ─────────────────────────────────────────────────────────────────────────────
  267 | 
  268 | test.describe('Tab navigation guard', () => {
  269 |   test.beforeEach(async ({ page }) => {
  270 |     await page.goto('/index.html');
  271 |   });
  272 | 
  273 |   test('clicking a later tab without filling prior tabs shows the modal', async ({ page }) => {
  274 |     await page.click('[data-bs-target="#tab-gestalt"]');
  275 |     await expect(page.locator('#validationModal')).toBeVisible();
  276 |   });
  277 | 
  278 |   test('backward navigation is always allowed without validation', async ({ page }) => {
  279 |     // Go forward legitimately then go back
  280 |     await page.fill('#grunddaten_personenzahl', '300');
  281 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  282 |     await page.click('#nextStepBtn');
> 283 |     await expect(page.locator('#tab-gelaende')).toHaveClass(/show active/);
      |                                                 ^ Error: expect(locator).toHaveClass(expected) failed
  284 | 
  285 |     // Navigate back to Grunddaten — should not show modal
  286 |     await page.click('[data-bs-target="#tab-grunddaten"]');
  287 |     await expect(page.locator('#validationModal')).toBeHidden();
  288 |     await expect(page.locator('#tab-grunddaten')).toHaveClass(/show active/);
  289 |   });
  290 | 
  291 |   test('can navigate to tab 3 after filling tabs 1 and 2', async ({ page }) => {
  292 |     await fillTabsUpTo(page, '#tab-gestalt');
  293 |     await page.click('[data-bs-target="#tab-gestalt"]');
  294 |     await expect(page.locator('#tab-gestalt')).toHaveClass(/show active/);
  295 |   });
  296 | });
  297 | 
  298 | // ─────────────────────────────────────────────────────────────────────────────
  299 | // 7. Tab completion indicators
  300 | // ─────────────────────────────────────────────────────────────────────────────
  301 | 
  302 | test.describe('Tab completion indicators', () => {
  303 |   test('Grunddaten tab gets tab-complete class after filling Personenzahl', async ({ page }) => {
  304 |     await page.goto('/index.html');
  305 |     await page.fill('#grunddaten_personenzahl', '500');
  306 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  307 |     await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-complete/);
  308 |   });
  309 | 
  310 |   test('Grunddaten tab gets tab-missing class when Personenzahl is 0', async ({ page }) => {
  311 |     await page.goto('/index.html');
  312 |     // Trigger a change event so the indicator logic runs
  313 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  314 |     await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-missing/);
  315 |   });
  316 | 
  317 |   test('tab-complete class is removed when a field is cleared', async ({ page }) => {
  318 |     await page.goto('/index.html');
  319 |     await page.fill('#grunddaten_personenzahl', '500');
  320 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  321 |     await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-complete/);
  322 | 
  323 |     await page.fill('#grunddaten_personenzahl', '0');
  324 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  325 |     await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).not.toHaveClass(/tab-complete/);
  326 |   });
  327 | });
  328 | 
  329 | // ─────────────────────────────────────────────────────────────────────────────
  330 | // 8. Form reset
  331 | // ─────────────────────────────────────────────────────────────────────────────
  332 | 
  333 | test.describe('Form reset', () => {
  334 |   test('confirming reset clears is-valid classes', async ({ page }) => {
  335 |     await page.goto('/index.html');
  336 |     await page.fill('#grunddaten_personenzahl', '500');
  337 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  338 |     await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-valid/);
  339 | 
  340 |     page.once('dialog', dialog => dialog.accept());
  341 |     await page.click('button[type="reset"]');
  342 |     await expect(page.locator('#grunddaten_personenzahl')).not.toHaveClass(/is-valid/);
  343 |   });
  344 | 
  345 |   test('cancelling reset keeps field values intact', async ({ page }) => {
  346 |     await page.goto('/index.html');
  347 |     await page.fill('#grunddaten_personenzahl', '999');
  348 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  349 | 
  350 |     page.once('dialog', dialog => dialog.dismiss());
  351 |     await page.click('button[type="reset"]');
  352 |     await expect(page.locator('#grunddaten_personenzahl')).toHaveValue('999');
  353 |   });
  354 | 
  355 |   test('progress resets to 0% after confirmation', async ({ page }) => {
  356 |     await page.goto('/index.html');
  357 |     await page.fill('#grunddaten_personenzahl', '500');
  358 |     await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
  359 | 
  360 |     page.once('dialog', dialog => dialog.accept());
  361 |     await page.click('button[type="reset"]');
  362 |     await expect(page.locator('#progress_text')).toHaveText('0%');
  363 |   });
  364 | });
  365 | 
  366 | // ─────────────────────────────────────────────────────────────────────────────
  367 | // 9. Validation modal content
  368 | // ─────────────────────────────────────────────────────────────────────────────
  369 | 
  370 | test.describe('Validation modal', () => {
  371 |   test('modal header says "Es fehlen Angaben"', async ({ page }) => {
  372 |     await page.goto('/index.html');
  373 |     await page.click('#nextStepBtn');
  374 |     await expect(page.locator('#validationModalLabel')).toHaveText('Es fehlen Angaben');
  375 |   });
  376 | 
  377 |   test('missing list contains the Personenzahl label', async ({ page }) => {
  378 |     await page.goto('/index.html');
  379 |     await page.click('#nextStepBtn');
  380 |     const listText = await page.locator('#missingList').textContent();
  381 |     expect(listText).toContain('Personenzahl');
  382 |   });
  383 | 
```