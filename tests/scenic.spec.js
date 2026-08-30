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
  await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke', '1.0');
  await page.selectOption('#veranstaltungsgelaende_stoerungen', '1.0');
  await page.selectOption('#veranstaltungsgelaende_wegfuehrung', '1.0');
  await page.selectOption('#veranstaltungsgelaende_einlass_auslass', '1.0');

  // Tab 3 — Gestalt
  await goToTab(page, '#tab-gestalt');
  await page.selectOption('#gestalt_grundform', '1.0');

  // Tab 4 — Beschaffenheit
  await goToTab(page, '#tab-beschaffenheit');
  await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
  await page.selectOption('#beschaffenheit_befestigung', '1.0');
  await page.selectOption('#beschaffenheit_wetterlage', '1.0');

  // Tab 5 — Veranstaltungsverlauf
  await goToTab(page, '#tab-verlauf');
  await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
  await page.selectOption('#veranstaltungsverlauf_zuablauf', '1.0');
  await page.selectOption('#veranstaltungsverlauf_attraktionen', '1.0');

  // Tab 6 — Wiederkehr
  await goToTab(page, '#tab-wiederkehr');
  await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '1.0');
  await page.selectOption('#wiederkehrende_veranstaltung_stoerungen', '0.0');

  // Tab 7 — Besuchendenverhalten
  await goToTab(page, '#tab-verhalten');
  await page.selectOption('#besuchendenverhalten_ort_ablauf', '0.8');
  await page.selectOption('#besuchendenverhalten_involvement', '1.0');
  await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
}

/**
 * Navigate to a tab by its data-bs-target value, e.g. '#tab-gelaende'.
 * Waits for the tab pane div (not the button) to become active.
 * Caller must ensure all preceding tabs are filled, otherwise Bootstrap
 * will call e.preventDefault() and the pane will never become active.
 */
async function goToTab(page, target) {
  await page.evaluate((tabTarget) => {
    const btn = document.querySelector(`[data-bs-target="${tabTarget}"]`);

    new bootstrap.Tab(btn).show();
  }, target);

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
        await page.selectOption(
          '#veranstaltungsgelaende_flaechenverhaeltnis',
          '1.0',
        );
        await page.selectOption(
          '#veranstaltungsgelaende_verkehrsstaerke',
          '1.0',
        );
        await page.selectOption('#veranstaltungsgelaende_stoerungen', '1.0');
        await page.selectOption('#veranstaltungsgelaende_wegfuehrung', '1.0');
        await page.selectOption(
          '#veranstaltungsgelaende_einlass_auslass',
          '1.0',
        );
      },
    },
    {
      pane: '#tab-gestalt',
      fill: async () => {
        await page.selectOption('#gestalt_grundform', '1.0');
      },
    },
    {
      pane: '#tab-beschaffenheit',
      fill: async () => {
        await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
        await page.selectOption('#beschaffenheit_befestigung', '1.0');
        await page.selectOption('#beschaffenheit_wetterlage', '1.0');
      },
    },
    {
      pane: '#tab-verlauf',
      fill: async () => {
        await page.selectOption(
          '#veranstaltungsverlauf_einlasskontrolle',
          '1.0',
        );
        await page.selectOption('#veranstaltungsverlauf_zuablauf', '1.0');
        await page.selectOption('#veranstaltungsverlauf_attraktionen', '1.0');
      },
    },
    {
      pane: '#tab-wiederkehr',
      fill: async () => {
        await page.selectOption(
          '#wiederkehrende_veranstaltung_erfahrung',
          '1.0',
        );
        await page.selectOption(
          '#wiederkehrende_veranstaltung_stoerungen',
          '0.0',
        );
      },
    },
    {
      pane: '#tab-verhalten',
      fill: async () => {
        await page.selectOption('#besuchendenverhalten_ort_ablauf', '0.8');
        await page.selectOption('#besuchendenverhalten_involvement', '1.0');
        await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');
      },
    },
  ];

  for (const step of steps) {
    if (step.pane === tabTarget) break;

    const isActive = await page
      .locator(`${step.pane}.show.active`)
      .isVisible()
      .catch(() => false);

    if (!isActive) {
      await goToTab(page, step.pane);
    }

    await step.fill();
  }
}

/**
 * Intercept the MS Forms navigation and return the destination URL.
 */
async function captureSubmitUrl(page) {
  return new Promise((resolve) => {
    page.route('https://forms.office.com/**', async (route) => {
      resolve(route.request().url());
      await route.abort();
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

/**
 * Submit the form and return the calculated result.
 */
async function submitAndGetResult(page) {
  const urlPromise = captureSubmitUrl(page);

  await page.click('#submitBtn');

  const rawUrl = await urlPromise;
  const summary = JSON.parse(`{${parseSummary(rawUrl)}}`);

  return summary.ergebnis;
}

/**
 * Fill a complete calculation test case.
 */
async function fillCalculationCase(page, testCase) {
  await page.goto('/index.html');

  // Tab 1 — Grunddaten
  await page.fill('#grunddaten_personenzahl', String(testCase.personenzahl));
  await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

  // Tab 2 — Veranstaltungsgelände
  await goToTab(page, '#tab-gelaende');

  await page.selectOption(
    '#veranstaltungsgelaende_flaechenverhaeltnis',
    Number(testCase.flaechenverhaeltnis).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsgelaende_verkehrsstaerke',
    Number(testCase.verkehrsstaerke).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsgelaende_stoerungen',
    Number(testCase.stoerungen).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsgelaende_wegfuehrung',
    Number(testCase.wegfuehrung).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsgelaende_einlass_auslass',
    Number(testCase.einlass_auslass).toFixed(1),
  );

  // Tab 3 — Gestalt
  await goToTab(page, '#tab-gestalt');

  await page.selectOption(
    '#gestalt_grundform',
    Number(testCase.grundform).toFixed(1),
  );

  // Tab 4 — Beschaffenheit
  await goToTab(page, '#tab-beschaffenheit');

  await page.selectOption(
    '#beschaffenheit_entlastungsflaechen',
    Number(testCase.entlastungsflaechen).toFixed(1),
  );
  await page.selectOption(
    '#beschaffenheit_befestigung',
    Number(testCase.befestigung).toFixed(1),
  );
  await page.selectOption(
    '#beschaffenheit_wetterlage',
    Number(testCase.wetterlage).toFixed(1),
  );

  // Tab 5 — Veranstaltungsverlauf
  await goToTab(page, '#tab-verlauf');

  await page.selectOption(
    '#veranstaltungsverlauf_einlasskontrolle',
    Number(testCase.einlasskontrolle).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsverlauf_zuablauf',
    Number(testCase.zuablauf).toFixed(1),
  );
  await page.selectOption(
    '#veranstaltungsverlauf_attraktionen',
    Number(testCase.attraktionen).toFixed(1),
  );

  // Tab 6 — Wiederkehr
  await goToTab(page, '#tab-wiederkehr');

  await page.selectOption(
    '#wiederkehrende_veranstaltung_erfahrung',
    Number(testCase.erfahrung).toFixed(1),
  );

  if (testCase.erfahrung <= 1) {
    // Otherwise this input element is disabled
    await page.selectOption(
      '#wiederkehrende_veranstaltung_stoerungen',
      Number(testCase.historische_stoerungen).toFixed(1),
    );
  }

  // Tab 7 — Besuchendenverhalten
  await goToTab(page, '#tab-verhalten');

  await page.selectOption(
    '#besuchendenverhalten_ort_ablauf',
    Number(testCase.ort_ablauf).toFixed(1),
  );
  await page.selectOption(
    '#besuchendenverhalten_involvement',
    Number(testCase.involvement).toFixed(1),
  );
  await page.selectOption(
    '#besuchendenverhalten_soziale_gruppen',
    Number(testCase.soziale_gruppen).toFixed(1),
  );

  // Final tab
  await goToTab(page, '#tab-donate');
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

  test('stepper starts at step 1 of 8', async ({ page }) => {
    await page.goto('/index.html');

    await expect(page.locator('#stepCurrent')).toHaveText('1');
    await expect(page.locator('#stepTotal')).toHaveText('8');
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

  test('field accepts a positive number and gains is-valid class', async ({
    page,
  }) => {
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(
      /is-valid/,
    );
  });

  test('field with value 0 gains is-invalid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '0');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(
      /is-invalid/,
    );
  });

  test('field with negative value gains is-invalid class', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '-500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(
      /is-invalid/,
    );
  });

  test('field with floating point value gains is-invalid class', async ({
    page,
  }) => {
    await page.fill('#grunddaten_personenzahl', '42.1');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(
      /is-invalid/,
    );
  });

  test('stepper advances after clicking next', async ({ page }) => {
    await page.fill('#grunddaten_personenzahl', '1000');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    await expect(page.locator('#stepCurrent')).toHaveText('2');
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
    await page.selectOption(
      '#veranstaltungsgelaende_flaechenverhaeltnis',
      '1.0',
    );

    await expect(
      page.locator('#veranstaltungsgelaende_flaechenverhaeltnis'),
    ).toHaveClass(/is-valid/);
  });

  test('resetting to blank placeholder adds is-invalid class', async ({
    page,
  }) => {
    await page.selectOption(
      '#veranstaltungsgelaende_flaechenverhaeltnis',
      '1.0',
    );

    await page.selectOption('#veranstaltungsgelaende_flaechenverhaeltnis', '');

    await expect(
      page.locator('#veranstaltungsgelaende_flaechenverhaeltnis'),
    ).toHaveClass(/is-invalid/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Progress bar
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Wizard stepper', () => {
  test('stepper starts at step 1 of 8', async ({ page }) => {
    await page.goto('/index.html');

    await expect(page.locator('#stepCurrent')).toHaveText('1');
    await expect(page.locator('#stepTotal')).toHaveText('8');
  });

  test('previous button is disabled on first step', async ({ page }) => {
    await page.goto('/index.html');

    await expect(page.locator('#prevStepBtn')).toBeDisabled();
  });

  test('stepper advances after clicking next', async ({ page }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    await expect(page.locator('#stepCurrent')).toHaveText('2');
  });

  test('previous button becomes enabled after advancing', async ({ page }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    await expect(page.locator('#prevStepBtn')).toBeEnabled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. "Nächster Schritt" button — tab navigation
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Nächster Schritt button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('shows validation modal when current tab has empty required fields', async ({
    page,
  }) => {
    // Grunddaten tab: Personenzahl = 0 (default) → should open modal
    await page.click('#nextStepBtn');

    await expect(page.locator('#validationModal')).toBeVisible();
  });

  test('advances to the next tab when current tab is complete', async ({
    page,
  }) => {
    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    await expect(page.locator('#tab-gelaende')).toHaveClass(/\bshow\b/);
  });

  test('missing fields are listed in the validation modal', async ({
    page,
  }) => {
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

  test('clicking a later tab without filling prior tabs shows the modal', async ({
    page,
  }) => {
    await page.evaluate(() => {
      const btn = document.querySelector('[data-bs-target="#tab-gestalt"]');

      new bootstrap.Tab(btn).show();
    });

    await expect(page.locator('#validationModal')).toBeVisible();
  });

  test('backward navigation is always allowed without validation', async ({
    page,
  }) => {
    // Go forward legitimately then go back
    await page.fill('#grunddaten_personenzahl', '300');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    await expect(page.locator('#tab-gelaende')).toHaveClass(/\bshow\b/);

    // Navigate back to Grunddaten — should not show modal
    await goToTab(page, '#tab-grunddaten');

    await expect(page.locator('#validationModal')).toBeHidden();
    await expect(page.locator('#tab-grunddaten')).toHaveClass(/\bshow\b/);
  });

  test('can navigate to tab 3 after filling tabs 1 and 2', async ({ page }) => {
    await fillTabsUpTo(page, '#tab-gestalt');

    await goToTab(page, '#tab-gestalt');

    await expect(page.locator('#tab-gestalt')).toHaveClass(/\bshow\b/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Tab completion indicators
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Tab completion indicators', () => {
  test('Grunddaten tab gets tab-complete class after filling Personenzahl', async ({
    page,
  }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(
      page.locator('[data-bs-target="#tab-grunddaten"]'),
    ).toHaveClass(/tab-complete/);
  });

  test('Grunddaten tab gets tab-missing class when Personenzahl is 0', async ({
    page,
  }) => {
    await page.goto('/index.html');

    // Trigger a change event so the indicator logic runs
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(
      page.locator('[data-bs-target="#tab-grunddaten"]'),
    ).toHaveClass(/tab-missing/);
  });

  test('tab-complete class is removed when a field is cleared', async ({
    page,
  }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(
      page.locator('[data-bs-target="#tab-grunddaten"]'),
    ).toHaveClass(/tab-complete/);

    await page.fill('#grunddaten_personenzahl', '0');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await expect(
      page.locator('[data-bs-target="#tab-grunddaten"]'),
    ).not.toHaveClass(/tab-complete/);
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

    await expect(page.locator('#grunddaten_personenzahl')).toHaveClass(
      /is-valid/,
    );

    page.once('dialog', (dialog) => dialog.accept());

    await page.click('button[type="reset"]');

    await expect(page.locator('#grunddaten_personenzahl')).not.toHaveClass(
      /is-valid/,
    );
  });

  test('cancelling reset keeps field values intact', async ({ page }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '999');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    page.once('dialog', (dialog) => dialog.dismiss());

    await page.click('button[type="reset"]');

    await expect(page.locator('#grunddaten_personenzahl')).toHaveValue('999');
  });

  test('stepper returns to step 1 after confirmation', async ({ page }) => {
    await page.goto('/index.html');

    await page.fill('#grunddaten_personenzahl', '500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    await page.click('#nextStepBtn');

    page.once('dialog', (dialog) => dialog.accept());

    await page.click('button[type="reset"]');

    await expect(page.locator('#stepCurrent')).toHaveText('1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Validation modal content
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Validation modal', () => {
  test('modal header says "Es fehlen Angaben"', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#nextStepBtn');

    await expect(page.locator('#validationModalLabel')).toHaveText(
      'Es fehlen Angaben',
    );
  });

  test('missing list contains the Personenzahl label', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#nextStepBtn');

    const listText = await page.locator('#missingList').textContent();

    expect(listText).toContain('Personenzahl');
  });

  test('modal does not show when required tab fields are all filled', async ({
    page,
  }) => {
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

  test('submitted URL contains compact summary with personenzahl', async ({
    page,
  }) => {
    await page.goto('/index.html');

    // Fill tab 1 with the specific value we want to assert on
    await page.fill('#grunddaten_personenzahl', '2500');
    await page.locator('#grunddaten_personenzahl').dispatchEvent('change');

    // Fill remaining tabs
    await goToTab(page, '#tab-gelaende');

    await page.selectOption(
      '#veranstaltungsgelaende_flaechenverhaeltnis',
      '1.0',
    );
    await page.selectOption('#veranstaltungsgelaende_verkehrsstaerke', '1.0');
    await page.selectOption('#veranstaltungsgelaende_stoerungen', '1.0');
    await page.selectOption('#veranstaltungsgelaende_wegfuehrung', '1.0');
    await page.selectOption('#veranstaltungsgelaende_einlass_auslass', '1.0');

    await goToTab(page, '#tab-gestalt');

    await page.selectOption('#gestalt_grundform', '1.0');

    await goToTab(page, '#tab-beschaffenheit');

    await page.selectOption('#beschaffenheit_entlastungsflaechen', '1.0');
    await page.selectOption('#beschaffenheit_befestigung', '1.0');
    await page.selectOption('#beschaffenheit_wetterlage', '1.0');

    await goToTab(page, '#tab-verlauf');

    await page.selectOption('#veranstaltungsverlauf_einlasskontrolle', '1.0');
    await page.selectOption('#veranstaltungsverlauf_zuablauf', '1.0');
    await page.selectOption('#veranstaltungsverlauf_attraktionen', '1.0');

    await goToTab(page, '#tab-wiederkehr');

    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '1.0');
    await page.selectOption('#wiederkehrende_veranstaltung_stoerungen', '0.0');

    await goToTab(page, '#tab-verhalten');

    await page.selectOption('#besuchendenverhalten_ort_ablauf', '0.8');
    await page.selectOption('#besuchendenverhalten_involvement', '1.0');
    await page.selectOption('#besuchendenverhalten_soziale_gruppen', '1.0');

    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);

    await page.click('#submitBtn');

    const rawUrl = await urlPromise;

    const summary = parseSummary(rawUrl);

    expect(summary).toBeTruthy();
    expect(summary).toContain('"personenzahl":2500');
  });

  test('submitted summary contains all 17 question fields', async ({
    page,
  }) => {
    await page.goto('/index.html');

    await fillAllFields(page);
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);

    await page.click('#submitBtn');

    const rawUrl = await urlPromise;
    const summary = JSON.parse(`{${parseSummary(rawUrl)}}`);

    expect(Object.keys(summary).length).toBeGreaterThanOrEqual(17);
  });

  test('submitted summary contains computed result (ergebnis)', async ({
    page,
  }) => {
    await page.goto('/index.html');

    await fillAllFields(page);
    await goToTab(page, '#tab-donate');

    const urlPromise = captureSubmitUrl(page);

    await page.click('#submitBtn');

    const rawUrl = await urlPromise;
    const summary = JSON.parse(`{${parseSummary(rawUrl)}}`);

    expect(summary).toHaveProperty('ergebnis');
    expect(typeof summary.ergebnis).toBe('number');
    expect(summary.ergebnis).toBeGreaterThan(0);
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
      // Bootstrap 5 moves `title` to `data-bs-original-title`
      // after tooltip initialization.
      const title =
        (await icon.getAttribute('title')) ??
        (await icon.getAttribute('data-bs-original-title'));

      expect(title).toBeTruthy();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. Wiederkehr — Historische Störungen conditional behaviour
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Wiederkehr – Historische Störungen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');

    await fillTabsUpTo(page, '#tab-wiederkehr');
    await goToTab(page, '#tab-wiederkehr');
  });

  test('field is disabled and set to 0.0 when erstmalig is selected', async ({
    page,
  }) => {
    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '5.0');

    const stoerungen = page.locator('#wiederkehrende_veranstaltung_stoerungen');

    await expect(stoerungen).toBeDisabled();
    await expect(stoerungen).toHaveValue('0.0');
  });

  test('field is enabled and required when wiederkehrend is selected', async ({
    page,
  }) => {
    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '1.0');

    const stoerungen = page.locator('#wiederkehrende_veranstaltung_stoerungen');

    await expect(stoerungen).toBeEnabled();
    await expect(stoerungen).toHaveAttribute('required', '');
  });

  test('switching back from erstmalig to wiederkehrend re-enables the field and keeps default value', async ({
    page,
  }) => {
    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '5.0');

    await page.selectOption('#wiederkehrende_veranstaltung_erfahrung', '1.0');

    const stoerungen = page.locator('#wiederkehrende_veranstaltung_stoerungen');

    await expect(stoerungen).toBeEnabled();
    await expect(stoerungen).toHaveValue('0.0');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. Calculation correctness
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Calculation correctness', () => {
  const calculationCases = [
    {
      name: 'large event with increased weather factor',
      personenzahl: 35000,
      flaechenverhaeltnis: 0.9,
      verkehrsstaerke: 1,
      stoerungen: 1,
      wegfuehrung: 1,
      einlass_auslass: 1,
      grundform: 1,
      entlastungsflaechen: 1,
      befestigung: 1,
      wetterlage: 1.3,
      einlasskontrolle: 1,
      zuablauf: 1,
      attraktionen: 1,
      erfahrung: 1,
      historische_stoerungen: 0,
      ort_ablauf: 0.8,
      involvement: 1.2,
      soziale_gruppen: 1,
      expected: 18.62122874,
    },
    {
      name: 'small event with multiple moderate factors',
      personenzahl: 500,
      flaechenverhaeltnis: 0.9,
      verkehrsstaerke: 0.9,
      stoerungen: 1.2,
      wegfuehrung: 1,
      einlass_auslass: 1.1,
      grundform: 1,
      entlastungsflaechen: 1.1,
      befestigung: 1,
      wetterlage: 1,
      einlasskontrolle: 1,
      zuablauf: 1,
      attraktionen: 1,
      erfahrung: 1,
      historische_stoerungen: 0,
      ort_ablauf: 1.2,
      involvement: 1.2,
      soziale_gruppen: 1,
      expected: 11.98483821,
    },
    {
      name: 'medium event with increased routing and area factors',
      personenzahl: 13800,
      flaechenverhaeltnis: 1,
      verkehrsstaerke: 1,
      stoerungen: 1,
      wegfuehrung: 1.2,
      einlass_auslass: 1,
      grundform: 1.1,
      entlastungsflaechen: 1.1,
      befestigung: 1,
      wetterlage: 1,
      einlasskontrolle: 1,
      zuablauf: 1,
      attraktionen: 1,
      erfahrung: 1,
      historische_stoerungen: 0,
      ort_ablauf: 0.8,
      involvement: 1.2,
      soziale_gruppen: 1.2,
      expected: 21.1204567,
    },
    {
      name: 'large event with high experience factor',
      personenzahl: 80000,
      flaechenverhaeltnis: 0.9,
      verkehrsstaerke: 1,
      stoerungen: 1,
      wegfuehrung: 1,
      einlass_auslass: 1,
      grundform: 1,
      entlastungsflaechen: 1,
      befestigung: 1,
      wetterlage: 1,
      einlasskontrolle: 1,
      zuablauf: 1.3,
      attraktionen: 1,
      erfahrung: 5,
      historische_stoerungen: 0,
      ort_ablauf: 1.2,
      involvement: 1.2,
      soziale_gruppen: 1,
      expected: 26.25662348,
    },
    {
      name: 'complex event with historical disturbance',
      personenzahl: 35000,
      flaechenverhaeltnis: 0.9,
      verkehrsstaerke: 0.9,
      stoerungen: 1.2,
      wegfuehrung: 1,
      einlass_auslass: 1.1,
      grundform: 1,
      entlastungsflaechen: 1.1,
      befestigung: 1,
      wetterlage: 1,
      einlasskontrolle: 1,
      zuablauf: 1.3,
      attraktionen: 1,
      erfahrung: 1,
      historische_stoerungen: 5,
      ort_ablauf: 0.8,
      involvement: 1,
      soziale_gruppen: 1.2,
      expected: 28.83969372,
    },
    {
      name: 'very large event with multiple elevated factors',
      personenzahl: 150000,
      flaechenverhaeltnis: 0.9,
      verkehrsstaerke: 1,
      stoerungen: 1.2,
      wegfuehrung: 1,
      einlass_auslass: 1.1,
      grundform: 1.1,
      entlastungsflaechen: 1,
      befestigung: 1,
      wetterlage: 1.3,
      einlasskontrolle: 1,
      zuablauf: 1.3,
      attraktionen: 1.2,
      erfahrung: 1,
      historische_stoerungen: 0,
      ort_ablauf: 0.8,
      involvement: 1.2,
      soziale_gruppen: 1,
      expected: 46.52897174,
    },
    {
      name: 'large event with historical disturbances and no experience',
      personenzahl: 100000,
      flaechenverhaeltnis: 1,
      verkehrsstaerke: 1,
      stoerungen: 1.2,
      wegfuehrung: 1,
      einlass_auslass: 1.1,
      grundform: 1.3,
      entlastungsflaechen: 1.1,
      befestigung: 1,
      wetterlage: 1,
      einlasskontrolle: 1.3,
      zuablauf: 1.3,
      attraktionen: 1.2,
      erfahrung: 1,
      historische_stoerungen: 5,
      ort_ablauf: 0.8,
      involvement: 1,
      soziale_gruppen: 1,
      expected: 68.38258073,
    },
  ];

  for (const testCase of calculationCases) {
    test(`calculates correctly: ${testCase.name}`, async ({ page }) => {
      await fillCalculationCase(page, testCase);

      const result = await submitAndGetResult(page);

      expect(result).toBeCloseTo(testCase.expected, 8);
    });
  }
});
