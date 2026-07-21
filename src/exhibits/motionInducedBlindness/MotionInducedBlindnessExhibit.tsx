import { useState, type CSSProperties } from 'react'
import { useMuseumStore } from '../../state/useMuseumStore'
import { ExhibitRange } from '../interaction/ExhibitRange'
import type { ExhibitModuleProps } from '../interaction/types'

const dots = Array.from({ length: 80 }, (_, index) => ({
  x: 180 + Math.cos(index * 2.399) * (25 + (index % 10) * 13),
  y: 125 + Math.sin(index * 2.399) * (25 + (index % 10) * 9),
}))
const targets = [[110, 75], [255, 78], [105, 178], [260, 175]] as const

export function MotionInducedBlindnessExhibit({ revealed, onInteract }: ExhibitModuleProps) {
  const reducedMotion = useMuseumStore((state) => state.settings.reducedMotion)
  const [speed, setSpeed] = useState(55)
  const [density, setDensity] = useState(55)
  const [targetCount, setTargetCount] = useState(3)
  const [paused, setPaused] = useState(false)
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteract() }
  const duration = 18 - speed * 0.15
  const stopped = revealed || reducedMotion || paused
  return (
    <div className="illusion-module">
      <svg className="illusion-svg mib" viewBox="0 0 360 250" role="img" aria-label="回転する背景と静止した黄色いターゲット">
        <g className={stopped ? '' : 'mib-rotor'} style={{ '--spin-duration': `${Math.max(2.5, duration)}s` } as CSSProperties}>
          {dots.slice(0, Math.round(density * .8)).map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r="2.5" />)}
        </g>
        {targets.slice(0, targetCount).map(([x, y], index) => <g key={index}><circle cx={x} cy={y} r="7" className="mib-target" />{revealed && <circle cx={x} cy={y} r="14" className="mib-answer" />}</g>)}
        <circle cx="180" cy="125" r="4" className="mib-fixation" /><line x1="170" x2="190" y1="125" y2="125" /><line x1="180" x2="180" y1="115" y2="135" />
      </svg>
      <div className="range-grid range-grid--three">
        <ExhibitRange label="背景速度" value={speed} min={0} max={100} unit="%" onChange={update(setSpeed)} />
        <ExhibitRange label="背景密度" value={density} min={20} max={100} unit="%" onChange={update(setDensity)} />
        <ExhibitRange label="ターゲット数" value={targetCount} min={1} max={4} onChange={update(setTargetCount)} />
      </div>
      <button className="button button--quiet" onClick={() => { setPaused((value) => !value); onInteract() }}>{stopped && !paused ? '背景は停止中' : paused ? '背景を再開' : '背景を一時停止'}</button>
      <p className="measurement">{revealed ? '背景を停止し、全ターゲットの輪郭を表示しました' : reducedMotion ? 'モーション軽減中：静止比較で観察できます' : '中央の十字だけを見つめてください。見失っても目を動かさずに'}</p>
    </div>
  )
}
