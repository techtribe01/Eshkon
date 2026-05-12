import fs from 'fs'
import { test, expect, type Page } from '@playwright/test'
import { injectAxe } from 'axe-playwright'

async function gotoPreview(page: Page) {
  const response = await page.goto('/preview/home')
  if (!response || response.status() === 404) {
    test.skip(true, 'Preview page is not available')
    return false
  }
  return true
}

test('preview page renders', async ({ page }) => {
  const available = await gotoPreview(page)
  if (!available) {
    return
  }

  await expect(page.locator('main')).toBeVisible()
  await expect(page.locator('h1')).toBeVisible()
})

test('CTA button is interactive', async ({ page }) => {
  const available = await gotoPreview(page)
  if (!available) {
    return
  }

  const cta = page.locator('a[href]').first()
  await expect(cta).toBeVisible()
  await cta.focus()
  await expect(cta).toBeFocused()
})

test('accessibility check on preview', async ({ page }) => {
  const available = await gotoPreview(page)
  if (!available) {
    return
  }

  await injectAxe(page)
  const results = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: () => Promise<unknown> } })
      .axe
    return axe.run()
  })
  fs.writeFileSync('a11y-report.json', JSON.stringify(results ?? {}, null, 2))

  const violations = (results as { violations?: Array<{ impact?: string }> })
    .violations
  const critical = (violations || []).filter(
    (violation) => violation.impact === 'critical',
  )
  expect(
    critical,
    `Critical accessibility violations found: ${critical.length}`,
  ).toHaveLength(0)
})
