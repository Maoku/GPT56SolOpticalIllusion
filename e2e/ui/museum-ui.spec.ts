import { expect, test } from '@playwright/test'

test('enters the museum, completes onboarding, and opens the map', async ({ page }) => {
  await page.goto('/?scene=off')
  await expect(page.getByRole('heading', { name: 'PARALLAX' })).toBeVisible()
  await page.getByRole('button', { name: /入館する/ }).click()
  await expect(page.getByRole('dialog', { name: '歩いて、見つける' })).toBeVisible()
  await page.getByRole('button', { name: '次へ' }).click()
  await expect(page.getByRole('dialog', { name: '近づいて、操作する' })).toBeVisible()
  await page.getByRole('button', { name: 'スキップ' }).click()
  await page.getByRole('button', { name: /館内マップを開く/ }).click()
  await expect(page.getByRole('dialog', { name: '館内マップと展示一覧' })).toBeVisible()
  await expect(page.getByText('未体験')).toHaveCount(10)
})

test('shows a useful WebGL fallback', async ({ page }) => {
  await page.goto('/?webgl=off')
  await expect(page.getByRole('alert')).toContainText('3D 展示を表示できません')
})

const exhibits = [
  ['muller-lyer', 'ミュラー・リヤー錯視', '下の線の実長'],
  ['ponzo', 'ポンゾ錯視', '上の線の奥行き'],
  ['ebbinghaus', 'エビングハウス錯視', '右の中央円'],
  ['cafe-wall', 'カフェウォール錯視', '行のずれ'],
  ['checker-shadow', 'チェッカーシャドウ', '影の位置'],
  ['necker-cube', 'ネッカーキューブ', '回転'],
  ['motion-induced-blindness', '運動誘発盲', '背景速度'],
  ['ames-room', 'エイムズの部屋', '人物のレール位置'],
  ['parallax-bloom', '視差の花', '花弁数'],
  ['chromatic-echo-corridor', '色彩残響回廊', '注視時間'],
] as const

for (const [id, title, control] of exhibits) {
  test(`${title}: interaction, answer and reset`, async ({ page }) => {
    await page.goto(`/?scene=off&exhibit=${id}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await expect(page.getByRole('slider', { name: control })).toBeVisible()
    await expect(page.getByRole('dialog', { name: '見え方のヒント' })).toHaveCount(0)
    await page.getByRole('button', { name: '答え合わせ' }).click()
    await expect(page.getByRole('button', { name: '錯視に戻る' })).toBeVisible()
    await page.getByRole('button', { name: /リセット/ }).click()
    await expect(page.getByRole('button', { name: '答え合わせ' })).toBeVisible()
  })
}

test('V2 uses contextual onboarding and lists all twelve exhibits', async ({ page }) => {
  await page.goto('/?scene=off&museum=v2')
  await expect(page.getByRole('heading', { name: 'PARALLAX 2.0' })).toBeVisible()
  await page.getByRole('button', { name: /入館する/ }).click()
  await expect(page.getByRole('complementary')).toContainText('歩くと、像が変わる。')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: '閉じる' }).click()
  await page.getByRole('button', { name: /館内マップを開く/ }).click()
  await expect(page.getByText('未体験')).toHaveCount(12)
  await expect(page.getByRole('button', { name: 'パスポート' })).toBeVisible()
})

const v2LabExhibits = exhibits.filter(([id]) =>
  [
    'muller-lyer',
    'ponzo',
    'ebbinghaus',
    'cafe-wall',
    'necker-cube',
    'motion-induced-blindness',
  ].includes(id),
)

for (const [id, title, control] of v2LabExhibits) {
  test(`V2 lab ${title}: keeps the detailed experiment optional`, async ({ page }) => {
    await page.goto(`/?scene=off&museum=v2&exhibit=${id}`)
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
    await expect(page.getByRole('slider', { name: control })).toBeVisible()
    await page.getByRole('button', { name: '答え合わせ' }).click()
    await expect(page.getByRole('button', { name: '錯視に戻る' })).toBeVisible()
  })
}

test('V2 spatial HTML shell has no fake state or record controls', async ({ page }) => {
  await page.goto('/?scene=off&museum=v2&exhibit=counterparallax-window')
  await expect(page.getByRole('heading', { name: '逆視差の窓' })).toBeVisible()
  await expect(page.getByRole('button', { name: '状態を切り替える' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /結果を記録/ })).toHaveCount(0)
  await expect(page.getByText(/窓の前を左右に歩き/)).toHaveCount(1)
})
