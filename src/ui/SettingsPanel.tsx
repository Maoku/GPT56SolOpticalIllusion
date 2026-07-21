import { useEffect, useRef } from 'react'
import { defaultSettings, useMuseumStore } from '../state/useMuseumStore'

export function SettingsPanel() {
  const dialog = useRef<HTMLDivElement>(null)
  const settings = useMuseumStore((state) => state.settings)
  const updateSettings = useMuseumStore((state) => state.updateSettings)
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const returnToTitle = useMuseumStore((state) => state.returnToTitle)
  const stage = useMuseumStore((state) => state.stage)

  useEffect(() => {
    const firstControl = dialog.current?.querySelector<HTMLElement>('button, input, select')
    firstControl?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay()
      if (event.key !== 'Tab' || !dialog.current) return
      const focusable = [...dialog.current.querySelectorAll<HTMLElement>('button, input, select')]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [closeOverlay])

  return (
    <div className="modal-backdrop">
      <div className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" ref={dialog}>
        <div className="panel-heading">
          <div><p className="eyebrow">PREFERENCES</p><h2 id="settings-title">鑑賞設定</h2></div>
          <button className="icon-button" aria-label="設定を閉じる" onClick={closeOverlay}>×</button>
        </div>
        <label className="setting-row">
          <span><strong>視点速度</strong><small>ゆっくり — すばやく</small></span>
          <input
            aria-label="視点速度"
            type="range"
            min="0.25"
            max="1.25"
            step="0.05"
            value={settings.lookSensitivity}
            onChange={(event) => updateSettings({ lookSensitivity: Number(event.target.value) })}
          />
        </label>
        <label className="setting-row">
          <span><strong>音量</strong><small>{Math.round(settings.volume * 100)}%</small></span>
          <input
            aria-label="音量"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(event) => updateSettings({ volume: Number(event.target.value) })}
          />
        </label>
        <label className="setting-row setting-row--inline">
          <span><strong>モーション軽減</strong><small>連続運動や大きな遷移を抑えます</small></span>
          <input
            aria-label="モーション軽減"
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(event) => updateSettings({ reducedMotion: event.target.checked })}
          />
        </label>
        <label className="setting-row setting-row--inline">
          <span><strong>描画品質</strong><small>低品質では影と解像度を抑えます</small></span>
          <select
            aria-label="描画品質"
            value={settings.quality}
            onChange={(event) => updateSettings({ quality: event.target.value as 'low' | 'high' })}
          >
            <option value="high">高品質</option><option value="low">低品質</option>
          </select>
        </label>
        <div className="panel-actions">
          <button className="button button--quiet" onClick={() => updateSettings(defaultSettings)}>初期値に戻す</button>
          {stage !== 'title' && <button className="button button--quiet" onClick={returnToTitle}>タイトルへ</button>}
          <button className="button button--primary" onClick={closeOverlay}>完了</button>
        </div>
      </div>
    </div>
  )
}
