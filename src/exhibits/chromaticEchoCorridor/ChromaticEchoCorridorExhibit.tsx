import { useEffect, useState, type CSSProperties } from 'react'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

type EchoStage = 'prepare' | 'fixate' | 'observe' | 'compare'
const colors = {
  cyan: { label: 'シアン', adapt: '#18d9dc', complement: '#ef6264' },
  magenta: { label: 'マゼンタ', adapt: '#e649b3', complement: '#50d49a' },
  amber: { label: 'アンバー', adapt: '#ffb52d', complement: '#527fe5' },
} as const
type ColorKey = keyof typeof colors

export function ChromaticEchoCorridorExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const [stage, setStage] = useState<EchoStage>('prepare')
  const [colorKey, setColorKey] = useState<ColorKey>('cyan')
  const [duration, setDuration] = useState(6)
  const [remaining, setRemaining] = useState(duration)
  const color = colors[colorKey]
  const visibleStage = revealed ? 'compare' : stage

  useEffect(() => {
    if (stage !== 'fixate') return
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1
        window.clearInterval(timer)
        setStage('observe')
        return 0
      })
    }, reducedMotion ? 650 : 1000)
    return () => window.clearInterval(timer)
  }, [reducedMotion, stage])

  const begin = () => { setRemaining(duration); setStage('fixate'); onInteract() }
  const go = (next: EchoStage) => { setStage(next); onInteract() }
  const style = { '--adapt-color': color.adapt, '--echo-color': color.complement } as CSSProperties
  return (
    <div className="illusion-module chromatic-echo" style={style}>
      <div className={`echo-chamber echo-chamber--${visibleStage}`} role="img" aria-label={`色彩残響回廊、${color.label}の順応シーケンス`}>
        {visibleStage === 'prepare' && <div className="echo-message"><span>01 — PREPARE</span><strong>残したい色を選ぶ</strong><small>強い点滅はありません。いつでもスキップできます。</small></div>}
        {visibleStage === 'fixate' && <div className="echo-fixation"><i aria-hidden="true" /><span>中央を見つめる</span><strong>{remaining}</strong></div>}
        {visibleStage === 'observe' && <div className="echo-fixation"><i aria-hidden="true" /><span>白い回廊に何色が見えますか？</span></div>}
        {visibleStage === 'compare' && <div className="echo-comparison">
          <div className="echo-swatch echo-swatch--adapt"><span>順応色</span><strong>{color.label}</strong></div>
          <div className="echo-swatch echo-swatch--neutral"><span>無彩色</span><strong>GRAY</strong></div>
          <div className="echo-swatch echo-swatch--complement"><span>計算上の補色</span><strong>{color.complement.toUpperCase()}</strong></div>
        </div>}
      </div>
      {visibleStage === 'prepare' && <>
        <fieldset className="color-choices"><legend>順応する色</legend>{Object.entries(colors).map(([key, option]) => <label key={key} style={{ '--choice-color': option.adapt } as CSSProperties}><input type="radio" name="echo-color" value={key} checked={colorKey === key} onChange={() => { setColorKey(key as ColorKey); onInteract() }} /><span>{option.label}</span></label>)}</fieldset>
        <ExhibitRange label="注視時間" value={duration} min={3} max={10} unit=" 秒" onChange={(value) => { setDuration(value); onInteract() }} />
        <button className="button button--primary" onClick={begin}>注視を始める</button>
      </>}
      {visibleStage === 'fixate' && <button className="button button--quiet" onClick={() => go('observe')}>待たずに無彩色へ</button>}
      {visibleStage === 'observe' && <button className="button button--primary" onClick={() => go('compare')}>順応前後を比較する</button>}
      {visibleStage === 'compare' && !revealed && <button className="button button--quiet" onClick={() => go('prepare')}>別の色でもう一度</button>}
      <p className="measurement">{visibleStage === 'compare' ? '残像なしモードとして、順応色・無彩色・理論上の補色を並べています' : reducedMotion ? 'モーション軽減中は遷移を短いクロスフェードにします' : '気分が悪くなった場合は、すぐに展示を終了してください'}</p>
    </div>
  )
}
