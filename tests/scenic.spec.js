import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fill every required field so the whole form is valid.
 * Each tab must be active before its fields can be interacted with,
 * because Playwright refuses to act on elements inside hidden tab panes.
 */
async function fillAllFields(page) {
  // Tab 1 — Grunddaten (active by default)
  await page.fill('#grunddaten_personenzahl', '1000');
  await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

  // Tab 2 — Veranstaltungsgelände
  await goToTab(page, '#tab-gelaende');
  await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
  await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke',     '1.0');
  await page.selectOption('#veranstaltungsgelaende_stoerungen',          '1.0');
  await page.selectOption('#veranstaltungsgelaende_wegfuehrung',         '1.0');
  await page.selectOption('#veranstaltungsgelaende_einlass_auslass',     '1.0');

  // Tab 3 — Gestalt
  await goToTab(page, '#tab-gestalt');
  await page.selectOption('#gestalt_grundform', '1.0');

  // Tab 4 — Beschaffenheit
  await goToTab(page, '#tab-beschaffenheit');
  await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
  await page.selectOption('#beschaffenheit_befestigung',         '1.0');
  await page.selectOption('#beschaffenheit_wetterlage',          '1.0');

  // Tab 5 — Veranstaltungsverlauf
  await goToTab(page, '#tab-verlauf');
  await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
  await page.selectOption('#veranstaltungsverlauf_zuablauf',         '1.0');
  await page.selectOption('#veranstaltungsverlauf_attraktionen',     '1.0');

  // Tab 6 — Wiederkehr
  await goToTab(page, '#tab-wiederkehr');
  await page.selectOption('#wiederkehrende_veranstaltung_erfahrung',  '1.0');
  await page.selectOption('#wiederkehrende_veranstaltung_stoerungen', '0.0');

  // Tab 7 — Besuchendenverhalten
  await goToTab(page, '#tab-verhalten');
  await page.selectOption('#besuchendenverhalten_ort_ablauf',      '0.8');
  await page.selectOption('#besuchendenverhalten_involvement',     '1.0');
  await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
}

/**
 * Navigate to a tab by its data-bs-target value, e.g. '#tab-gelaende'.
 * Waits for the tab *pane* div (not the button) to become active.
 * Caller must ensure all preceding tabs are filled, otherwise Bootstrap
 * will call e.preventDefault() and the pane will never become active.
 */
async function goToTab(page, target) {
  await page.click(`[data-bs-target="${target}"]`);
  // The pane div gets both "active" and "show" classes (order varies by Bootstrap version).
  await page.waitForSelector(`${target}.show.active`);
}

/**
 * Fill all required fields up to (but not including) the given tab,
 * activating each tab pane before interacting with its fields.
 */
async function fillTabsUpTo(page, tabTarget) {
  const steps = [
    {
      pane: '#tab-grunddaten',
      fill: async () => {
        await page.fill('#grunddaten_personenzahl', '500');
        await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
      },
    },
    {
      pane: '#tab-gelaende',
      fill: async () => {
        await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
        await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke',     '1.0');
        await page.selectOption('#veranstaltungsgelaende_stoerungen',          '1.0');
        await page.selectOption('#veranstaltungsgelaende_wegfuehrung',         '1.0');
        await page.selectOption('#veranstaltungsgelaende_einlass_auslass',     '1.0');
      },
    },
    {
      pane: '#tab-gestalt',
      fill: async () => { await page.selectOption('#gestalt_grundform', '1.0'); },
    },
    {
      pane: '#tab-beschaffenheit',
      fill: async () => {
        await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
        await page.selectOption('#beschaffenheit_befestigung',         '1.0');
        await page.selectOption('#beschaffenheit_wetterlage',          '1.0');
      },
    },
    {
      pane: '#tab-verlauf',
      fill: async () => {
        await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
        await page.selectOption('#veranstaltungsverlauf_zuablauf',         '1.0');
        await page.selectOption('#veranstaltungsverlauf_attraktionen',     '1.0');
      },
    },
    {
      pane: '#tab-wiederkehr',
      fill: async () => {
        await page.selectOption('#wiederkehrende_veranstaltung_erfahrung',  '1.0');
        await page.selectOption('#wiederkehrende_veranstaltung_stoerungen', '0.0');
      },
    },
    {
      pane: '#tab-verhalten',
      fill: async () => {
        await page.selectOption('#besuchendenverhalten_ort_ablauf',      '0.8');
        await page.selectOption('#besuchendenverhalten_involvement',     '1.0');
        await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
      },
    },
  ];

  for (const step of steps) {
    if (step.pane === tabTarget) break;
    // Activate the pane (first tab is already active on load)
    const isActive = await page.locator(`${step.pane}.show.active`).isVisible().catch(() => false);
    if (!isActive) await goToTab(page, step.pane);
    await step.fill();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Page load
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Page load', () => {
  test('page title contains SCENIC', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page).toHaveTitle(/SCENIC/);
  });

  test('Grunddaten tab is active by default', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#tab-grunddaten')).toHaveClass(/\bshow\b/);
  });

  test('progress bar starts at 0%', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#progress_text')).toHaveText('0%');
    await expect(page.locator('#progress_bar')).toHaveAttribute('style', /width:\s*0%/);
  });

  test('"Nächster Schritt" button is visible on load', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#nextStepBtn')).toBeVisible();
  });

  test('submit button exists inside the donate tab', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#submitBtn')).toBeAttached();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Grunddaten tab
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Grunddaten', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('field accepts a positive number and gains is-valid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-valid/);
  });

  test('field with value 0 gains is-invalid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '0');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-invalid/);
  });

  test('field with negative value gains is-invalid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '-500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-invalid/);
  });

  test('field with floating point value gains is-invalid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '42.1');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-invalid/);
  });

  test('progress updates after filling Personenzahl', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '1000');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    const text = await page.locator('#progress_text').textContent();
    expect(parseInt(text)).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Select fields — is-valid / is-invalid feedback
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Select field validation feedback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    // Grunddaten must be filled before Bootstrap allows forward navigation
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await goToTab(page, '#tab-gelaende');
  });

  test('selecting a valid option adds is-valid class', async ({ page }) => {
    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
    await expect(page.locator('#veranstaltungsgelaende_flaechenverhaeltnis')).toHaveClass(/is-valid/);
  });

  test('resetting to blank placeholder adds is-invalid class', async ({ page }) => {
    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '');
    await expect(page.locator('#veranstaltungsgelaende_flaechenverhaeltnis')).toHaveClass(/is-invalid/);
  });

  test('progress bar increases after selecting a value', async ({ page }) => {
    const before = parseInt(await page.locator('#progress_text').textContent());
    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '0.9');
    const after = parseInt(await page.locator('#progress_text').textContent());
    expect(after).toBeGreaterThan(before);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Progress bar
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Progress bar', () => {
  test('reaches 100% when all fields are filled', async ({ page }) => {
    await page.goto('/index.html');
    await fillAllFields(page);
    await expect(page.locator('#progress_text')).toHaveText('100%');
    await expect(page.locator('#progress_bar')).toHaveAttribute('style', /width:\s*100%/);
  });

  test('"Nächster Schritt" button hides only when on the last tab', async ({ page }) => {
    await page.goto('/index.html');
    await fillAllFields(page);
    // After fillAllFields we are on tab 7 (Verhalten) — button should still be visible
    await expect(page.locator('#nextStepBtn')).not.toHaveClass(/d-none/);
    // Navigating to the donate tab should hide it
    await goToTab(page, '#tab-donate');
    await expect(page.locator('#nextStepBtn')).toHaveClass(/d-none/);
  });

  test('progress is between 0 and 100 for a partial form', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '200');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    const text = parseInt(await page.locator('#progress_text').textContent());
    expect(text).toBeGreaterThan(0);
    expect(text).toBeLessThan(100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. "Nächster Schritt" button — tab navigation
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Nächster Schritt button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('shows validation modal when current tab has empty required fields', async ({ page }) => {
    // Grunddaten tab: Personenzahl = 0 (default) → should open modal
    await page.click('#nextStepBtn');
    await expect(page.locator('#validationModal')).toBeVisible();
  });

  test('advances to the next tab when current tab is complete', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await page.click('#nextStepBtn');
    await expect(page.locator('#tab-gelaende')).toHaveClass(/\bshow\b/);
  });

  test('missing fields are listed in the validation modal', async ({ page }) => {
    await page.click('#nextStepBtn');
    await expect(page.locator('#missingList')).not.toBeEmpty();
  });

  test('modal can be dismissed with the OK button', async ({ page }) => {
    await page.click('#nextStepBtn');
    await expect(page.locator('#validationModal')).toBeVisible();
    await page.click('#validationModal .btn-primary');
    await expect(page.locator('#validationModal')).toBeHidden();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Tab navigation guard (direct click)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tab navigation guard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('clicking a later tab without filling prior tabs shows the modal', async ({ page }) => {
    await page.click('[data-bs-target="#tab-gestalt"]');
    await expect(page.locator('#validationModal')).toBeVisible();
  });

  test('backward navigation is always allowed without validation', async ({ page }) => {
    // Go forward legitimately then go back
    await page.fill('#grunddaten_personenzahl', '300');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await page.click('#nextStepBtn');
    await expect(page.locator('#tab-gelaende')).toHaveClass(/\bshow\b/);

    // Navigate back to Grunddaten — should not show modal
    await page.click('[data-bs-target="#tab-grunddaten"]');
    await expect(page.locator('#validationModal')).toBeHidden();
    await expect(page.locator('#tab-grunddaten')).toHaveClass(/\bshow\b/);
  });

  test('can navigate to tab 3 after filling tabs 1 and 2', async ({ page }) => {
    await fillTabsUpTo(page, '#tab-gestalt');
    // fillTabsUpTo fills field values but doesn't click through tabs,
    // so we navigate directly — Bootstrap checks field values, not active tab history.
    await page.click('[data-bs-target="#tab-gestalt"]');
    await expect(page.locator('#tab-gestalt')).toHaveClass(/\bshow\b/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Tab completion indicators
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tab completion indicators', () => {
  test('Grunddaten tab gets tab-complete class after filling Personenzahl', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-complete/);
  });

  test('Grunddaten tab gets tab-missing class when Personenzahl is 0', async ({ page }) => {
    await page.goto('/index.html');
    // Trigger a change event so the indicator logic runs
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-missing/);
  });

  test('tab-complete class is removed when a field is cleared', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).toHaveClass(/tab-complete/);

    await page.fill('#grunddaten_personenzahl', '0');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('[data-bs-target="#tab-grunddaten"]')).not.toHaveClass(/tab-complete/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Form reset
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Form reset', () => {
  test('confirming reset clears is-valid classes', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(/is-valid/);

    page.once('dialog', dialog => dialog.accept());
    await page.click('button[type="reset"]');
    await expect(page.locator('#grunddaten_personenzahl')).not.toHaveClass(/is-valid/);
  });

  test('cancelling reset keeps field values intact', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '999');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    page.once('dialog', dialog => dialog.dismiss());
    await page.click('button[type="reset"]');
    await expect(page.locator('#grunddaten_personenzahl')).toHaveValue('999');
  });

  test('progress resets to 0% after confirmation', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    page.once('dialog', dialog => dialog.accept());
    await page.click('button[type="reset"]');
    await expect(page.locator('#progress_text')).toHaveText('0%');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Validation modal content
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Validation modal', () => {
  test('modal header says "Es fehlen Angaben"', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('#nextStepBtn');
    await expect(page.locator('#validationModalLabel')).toHaveText('Es fehlen Angaben');
  });

  test('missing list contains the Personenzahl label', async ({ page }) => {
    await page.goto('/index.html');
    await page.click('#nextStepBtn');
    const listText = await page.locator('#missingList').textContent();
    expect(listText).toContain('Personenzahl');
  });

  test('modal does not show when required tab fields are all filled', async ({ page }) => {
    await page.goto('/index.html');
    await page.fill('#grunddaten_personenzahl', '100');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    await page.click('#nextStepBtn');
    await expect(page.locator('#validationModal')).toBeHidden();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. Form submission
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Form submission', () => {
  /**
   * The form submits via window.location.href = url (a full page navigation),
   * not a fetch/XHR. waitForRequest() only catches sub-resource requests, so
   * we intercept the navigation itself with page.route() and abort it after
   * capturing the destination URL.
   */
  async function captureSubmitUrl(page) {
    return new Promise((resolve) => {
      page.route('https://forms.office.com/**', async (route) => {
        resolve(route.request().url());
        await route.abort(); // prevent actually leaving the page
      });
    });
  }

  /**
   * Extract and decode the compact summary string from the MS Forms URL.
   * The parameter name is the long token after the last '&'.
   */
  function parseSummary(rawUrl) {
    const decoded = decodeURIComponent(rawUrl);
    const match = decoded.match(/&[^=]+=(.+)$/);
    return match ? match[1] : null;
  }

  test('submit redirects to MS Forms URL', async ({ page }) => {
    await page.goto('/index.html');
    await fillAllFields(page);
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);
    await page.click('#submitBtn');
    const url = await urlPromise;

    expect(url).toContain('forms.office.com');
    expect(url).toContain('ResponsePage.aspx');
  });

  test('submitted URL contains compact summary with personenzahl', async ({ page }) => {
    await page.goto('/index.html');
    // Fill tab 1 with the specific value we want to assert on
    await page.fill('#grunddaten_personenzahl', '2500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');
    // Fill remaining tabs (goToTab handles navigation guard)
    await goToTab(page, '#tab-gelaende');
    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '1.0');
    await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke',     '1.0');
    await page.selectOption('#veranstaltungsgelaende_stoerungen',          '1.0');
    await page.selectOption('#veranstaltungsgelaende_wegfuehrung',         '1.0');
    await page.selectOption('#veranstaltungsgelaende_einlass_auslass',     '1.0');
    await goToTab(page, '#tab-gestalt');
    await page.selectOption('#gestalt_grundform', '1.0');
    await goToTab(page, '#tab-beschaffenheit');
    await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
    await page.selectOption('#beschaffenheit_befestigung',         '1.0');
    await page.selectOption('#beschaffenheit_wetterlage',          '1.0');
    await goToTab(page, '#tab-verlauf');
    await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
    await page.selectOption('#veranstaltungsverlauf_zuablauf',         '1.0');
    await page.selectOption('#veranstaltungsverlauf_attraktionen',     '1.0');
    await goToTab(page, '#tab-wiederkehr');
    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung',  '1.0');
    await page.selectOption('#wiederkehrende_veranstaltung_stoerungen', '0.0');
    await goToTab(page, '#tab-verhalten');
    await page.selectOption('#besuchendenverhalten_ort_ablauf',      '0.8');
    await page.selectOption('#besuchendenverhalten_involvement',     '1.0');
    await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);
    await page.click('#submitBtn');
    const rawUrl = await urlPromise;

    const summary = parseSummary(rawUrl);
    expect(summary).toBeTruthy();
    expect(summary).toContain('n=2500');
  });

  test('submitted summary contains all 17 question codes', async ({ page }) => {
    await page.goto('/index.html');
    await fillAllFields(page);
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);
    await page.click('#submitBtn');
    const rawUrl = await urlPromise;

    const summary = parseSummary(rawUrl);
    for (let i = 1; i <= 17; i++) {
      expect(summary).toMatch(new RegExp(`\\b${i}[a-z]`));
    }
  });

  test('submitted summary contains computed result (E=)', async ({ page }) => {
    await page.goto('/index.html');
    await fillAllFields(page);
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);
    await page.click('#submitBtn');
    const rawUrl = await urlPromise;

    const summary = parseSummary(rawUrl);
    const match = summary.match(/E=([\d.]+)/);
    expect(match).toBeTruthy();
    expect(parseFloat(match[1])).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. Tooltip accessibility
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tooltips', () => {
  test('help icons are present on required fields', async ({ page }) => {
    await page.goto('/index.html');
    const helpIcons = page.locator('.help-icon');
    expect(await helpIcons.count()).toBeGreaterThan(0);
  });

  test('each help icon has a non-empty title attribute', async ({ page }) => {
    await page.goto('/index.html');
    const icons = await page.locator('.help-icon').all();
    for (const icon of icons) {
      // Bootstrap 5 moves `title` to `data-bs-original-title` after tooltip init
      const title = await icon.getAttribute('title')
        ?? await icon.getAttribute('data-bs-original-title');
      expect(title).toBeTruthy();
    }
  });
});