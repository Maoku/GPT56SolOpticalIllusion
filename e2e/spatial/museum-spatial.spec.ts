import { expect, test, type Page } from '@playwright/test'

type Snapshot = {
  stage: string
  activeExhibitId: string | null
  spatialStep: number
  alignmentError: number | null
  camera: [number, number, number]
  sceneParameters: Record<string, unknown>
}

type SceneTestApi = {
  enterMuseum: () => void
  activate: (id: string) => void
  setCamera: (pose: {
    position: [number, number, number]
    target: [number, number, number]
  }) => void
  updateSettings: (settings: { quality?: 'low' | 'high'; reducedMotion?: boolean }) => void
  snapshot: () => Snapshot
}

type BrowserGlobal = typeof globalThis & {
  __PARALLAX_E2E__?: SceneTestApi
}

async function waitForBridge(page: Page) {
  await expect
    .poll(() => page.evaluate(() => Boolean((globalThis as BrowserGlobal).__PARALLAX_E2E__)))
    .toBe(true)
}

async function snapshot(page: Page) {
  return page.evaluate(() => (globalThis as BrowserGlobal).__PARALLAX_E2E__!.snapshot())
}

async function setCamera(
  page: Page,
  position: [number, number, number],
  target: [number, number, number],
) {
  await page.evaluate(
    ({ position: nextPosition, target: nextTarget }) =>
      (globalThis as BrowserGlobal).__PARALLAX_E2E__!.setCamera({
        position: nextPosition,
        target: nextTarget,
      }),
    { position, target },
  )
}

const spatialAnchors = [
  ['checker-shadow', [12.8, 1.65, 0], [16.28, 0.12, 0]],
  ['ames-room', [11.7, 1.65, -9], [17.2, 1.4, -9]],
  ['parallax-bloom', [-10, 1.65, -10.8], [-10, 2.25, -17]],
  ['chromatic-echo-corridor', [-2.5, 1.65, -11.5], [-2.5, 1.65, -17]],
  ['folded-corridor', [4.5, 1.65, -10.4], [4.5, 1.5, -17]],
  ['counterparallax-window', [12, 1.65, -11.4], [12, 1.5, -17]],
] as const

for (const [id, position, target] of spatialAnchors) {
  test(`${id}: viewing point automatically activates the scene exhibit`, async ({ page }) => {
    await page.goto('/?museum=v2&e2e=1')
    await waitForBridge(page)
    await setCamera(page, [...position], [...target])
    await page.evaluate(() => (globalThis as BrowserGlobal).__PARALLAX_E2E__!.enterMuseum())
    await expect
      .poll(async () => {
        const current = await snapshot(page)
        return {
          activeExhibitId: current.activeExhibitId,
          stage: current.stage,
          camera: current.camera.map((value) => Math.round(value * 100) / 100),
        }
      })
      .toMatchObject({
        activeExhibitId: id,
        stage: 'spatial-exhibit',
      })
  })
}

test('checker scene changes real lighting context and survives low quality', async ({ page }) => {
  await page.goto('/?museum=v2&e2e=1&exhibit=checker-shadow')
  await waitForBridge(page)
  await setCamera(page, [12.8, 1.65, 0], [16.28, 0.12, 0])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('checker-shadow'),
  )
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.updateSettings({ quality: 'low' }),
  )
  const before = await snapshot(page)
  expect(before.sceneParameters).toMatchObject({
    id: 'shadow',
    castsContextShadow: true,
    proceduralShadow: true,
    quality: 'low',
  })
  await page.keyboard.press('E')
  await expect.poll(async () => (await snapshot(page)).sceneParameters.id).toBe('context')
})

test('Ames and folded reveals are driven by physical side viewpoints', async ({ page }) => {
  await page.goto('/?museum=v2&e2e=1&exhibit=ames-room')
  await waitForBridge(page)
  await setCamera(page, [11.7, 1.65, -9], [17.2, 1.4, -9])
  await page.evaluate(() => (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('ames-room'))
  expect((await snapshot(page)).sceneParameters).toMatchObject({
    viewState: 'aperture',
    equalFigureScale: true,
  })
  await setCamera(page, [14.2, 1.65, -4.7], [16.7, 1.4, -9])
  await expect.poll(async () => (await snapshot(page)).sceneParameters.viewState).toBe('reveal')

  await setCamera(page, [4.5, 1.65, -10.4], [4.5, 1.5, -17])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('folded-corridor'),
  )
  expect((await snapshot(page)).sceneParameters).toMatchObject({
    viewState: 'aligned',
    fixedFragments: true,
  })
  await setCamera(page, [7.7, 1.65, -14.1], [4.5, 1.5, -17])
  await expect.poll(async () => (await snapshot(page)).sceneParameters.viewState).toBe('reveal')
})

test('signature walking changes bloom alignment and chromatic depth phase', async ({ page }) => {
  await page.goto('/?museum=v2&e2e=1&exhibit=parallax-bloom')
  await waitForBridge(page)
  await setCamera(page, [-10, 1.65, -10.8], [-10, 2.25, -17])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('parallax-bloom'),
  )
  await expect.poll(async () => (await snapshot(page)).alignmentError).toBeLessThan(12)
  await setCamera(page, [-8.5, 1.65, -10.8], [-10, 2.25, -17])
  await expect.poll(async () => (await snapshot(page)).alignmentError).toBeGreaterThan(12)

  await setCamera(page, [-2.5, 1.65, -12.5], [-2.5, 1.65, -17])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('chromatic-echo-corridor'),
  )
  expect((await snapshot(page)).sceneParameters.phase).toBe(0)
  await setCamera(page, [-2.5, 1.65, -16.4], [-2.5, 1.65, -17])
  await expect.poll(async () => (await snapshot(page)).sceneParameters.phase).toBe(2)
  await expect.poll(async () => (await snapshot(page)).sceneParameters.lighting).toMatchObject({
    adaptIntensity: 0,
    resultColor: '#ffffff',
    echoSurfaceColor: '#e9e6df',
  })
})

test('counterparallax reverses layer motion and provides reduced-motion static views', async ({
  page,
}) => {
  await page.goto('/?museum=v2&e2e=1&exhibit=counterparallax-window')
  await waitForBridge(page)
  await setCamera(page, [10.9, 1.65, -11.4], [12, 1.5, -17])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('counterparallax-window'),
  )
  const before = await snapshot(page)
  expect(before.sceneParameters).toMatchObject({ mode: 'normal', layerOffset: 0 })
  const beforeImage = await page.screenshot()

  await page.keyboard.press('E')
  await expect.poll(async () => (await snapshot(page)).sceneParameters.mode).toBe('reverse')
  const reversed = await snapshot(page)
  expect(Number(reversed.sceneParameters.layerOffset)).toBeLessThan(0)
  const afterImage = await page.screenshot()
  expect(beforeImage.equals(afterImage)).toBe(false)

  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.updateSettings({ reducedMotion: true }),
  )
  await expect
    .poll(async () => {
      const views = (await snapshot(page)).sceneParameters.staticViews
      return Array.isArray(views) ? views.length : 0
    })
    .toBe(2)
})

test('spatial HUD stays at the edge and leaves the central artwork unobstructed', async ({
  page,
}) => {
  await page.goto('/?museum=v2&e2e=1&exhibit=parallax-bloom')
  await waitForBridge(page)
  await setCamera(page, [-10, 1.65, -10.8], [-10, 2.25, -17])
  await page.evaluate(() =>
    (globalThis as BrowserGlobal).__PARALLAX_E2E__!.activate('parallax-bloom'),
  )
  const box = await page.locator('.spatial-exhibit-hud').boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y).toBeGreaterThan(420)
  expect(box!.height).toBeLessThan(280)
  expect(box!.width).toBeLessThanOrEqual(760)
})
