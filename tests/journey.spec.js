import { expect, test } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function completeStep1(page) {
  await page.selectOption('#destination', 'kyoto');
  await page.fill('#date-departure', '2027-06-01');
  await page.fill('#date-return', '2027-06-15');
  await page.locator('#step-1-next').click();
}

// ── Reveal animations ────────────────────────────────────────────────────────

test.describe('Reveal animations', () => {
  test('elements below fold start without .is-revealed', async ({ page }) => {
    await page.goto('/');
    const el = page.locator('#destinations .section-header[data-reveal]').first();
    await expect(el).not.toHaveClass(/is-revealed/);
  });

  test('gains .is-revealed after scrolling into view', async ({ page }) => {
    await page.goto('/');
    const el = page.locator('#destinations .section-header[data-reveal]').first();
    await expect(el).not.toHaveClass(/is-revealed/);
    await el.scrollIntoViewIfNeeded();
    await expect(el).toHaveClass(/is-revealed/);
  });
});

// ── Header scroll state ──────────────────────────────────────────────────────

test.describe('Header scroll state', () => {
  test('no .is-scrolled at page top', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-header')).not.toHaveClass(/is-scrolled/);
  });

  test('gains .is-scrolled after scrolling down', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(page.locator('.site-header')).toHaveClass(/is-scrolled/);
  });
});

// ── Nav toggle ───────────────────────────────────────────────────────────────

test.describe('Nav toggle', () => {
  test('opens and closes the mobile nav', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const toggle = page.locator('.nav-toggle');
    const nav = page.locator('#site-nav');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toHaveClass(/is-open/);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toHaveClass(/is-open/);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toHaveClass(/is-open/);
  });
});

// ── Form — step 1 ───────────────────────────────────────────────────────────

test.describe('Form — step 1', () => {
  test('shows errors when Continue clicked with empty fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('#step-1-next').click();
    await expect(page.locator('#destination-error')).not.toBeEmpty();
    await expect(page.locator('#date-departure-error')).not.toBeEmpty();
    await expect(page.locator('#date-return-error')).not.toBeEmpty();
  });

  test('advances to step 2 with valid input', async ({ page }) => {
    await page.goto('/');
    await completeStep1(page);
    await expect(page.locator('#form-step-1')).toBeHidden();
    await expect(page.locator('#form-step-2')).toBeVisible();
    await expect(page.locator('.form-progress__step[data-step="1"]')).toHaveClass(/is-done/);
    await expect(page.locator('.form-progress__step[data-step="2"]')).toHaveClass(/is-active/);
  });
});

// ── Form — back navigation ───────────────────────────────────────────────────

test.describe('Form — back navigation', () => {
  test('Back button returns to step 1 with values preserved', async ({ page }) => {
    await page.goto('/');
    await completeStep1(page);
    await page.locator('#step-2-back').click();

    await expect(page.locator('#form-step-1')).toBeVisible();
    await expect(page.locator('#form-step-2')).toBeHidden();
    await expect(page.locator('#destination')).toHaveValue('kyoto');
    await expect(page.locator('#date-departure')).toHaveValue('2027-06-01');
    await expect(page.locator('#date-return')).toHaveValue('2027-06-15');
  });
});

// ── Form — step 2 validation ─────────────────────────────────────────────────

test.describe('Form — step 2 validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await completeStep1(page);
  });

  test('shows errors when submitted with empty fields', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#name-error')).not.toBeEmpty();
    await expect(page.locator('#email-error')).not.toBeEmpty();
    await expect(page.locator('#group-size-error')).not.toBeEmpty();
  });

  test('shows error for invalid email format', async ({ page }) => {
    await page.fill('#name', 'Jane Doe');
    await page.fill('#email', 'not-an-email');
    await page.fill('#group-size', '2');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#email-error')).not.toBeEmpty();
  });

  test('shows error for group size out of range', async ({ page }) => {
    await page.fill('#name', 'Jane Doe');
    await page.fill('#email', 'jane@example.com');

    await page.fill('#group-size', '0');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#group-size-error')).not.toBeEmpty();

    await page.fill('#group-size', '51');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#group-size-error')).not.toBeEmpty();
  });
});

// ── Form — submission ────────────────────────────────────────────────────────

test.describe('Form — submission', () => {
  test('shows confirmation and focuses heading on valid submit', async ({ page }) => {
    await page.goto('/');
    await completeStep1(page);
    await page.fill('#name', 'Jane Doe');
    await page.fill('#email', 'jane@example.com');
    await page.fill('#group-size', '2');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('#inquiry-form')).toBeHidden();
    await expect(page.locator('#form-confirmation')).toBeVisible();
    await expect(page.locator('#form-confirmation-heading')).toBeFocused();
  });
});

// ── Sticky sidebar ───────────────────────────────────────────────────────────

test.describe('Sticky sidebar', () => {
  test('activates day-5 link when day-5 is scrolled to', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.querySelector('#day-5').scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    await expect(page.locator('.journey__day-link[href="#day-5"]')).toHaveClass(/is-active/);
  });
});
