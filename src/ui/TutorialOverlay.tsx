import { useState } from 'react'
import { useMuseumStore } from '../state/useMuseumStore'

const steps = [
  { number: '01', title: '歩いて、見つける', body: 'WASD・矢印キー、または左下のコントローラーで館内を移動します。画面中央を展示へ向けてください。', keys: ['W', 'A', 'S', 'D'] },
  { number: '02', title: '近づいて、操作する', body: '照準が光る距離まで近づくと作品名が表示されます。「操作する」または E で展示モードへ入ります。', keys: ['E'] },
  { number: '03', title: '先入観なしで、見る', body: 'ヒントは自動では開きません。まず自分の目で観察し、必要なときだけ H またはヒントボタンを使ってください。', keys: ['H', 'R'] },
]

export function TutorialOverlay() {
  const [step, setStep] = useState(0)
  const finishTutorial = useMuseumStore((state) => state.finishTutorial)
  const closeOverlay = useMuseumStore((state) => state.closeOverlay)
  const current = steps[step]
  if (!current) return null
  const finish = () => { finishTutorial(); closeOverlay() }
  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <div className="tutorial-card">
        <div className="tutorial-progress" aria-label={`チュートリアル ${step + 1} / ${steps.length}`}>
          {steps.map((item, index) => <span key={item.number} className={index <= step ? 'is-active' : ''} />)}
        </div>
        <span className="tutorial-number">{current.number} / 03</span>
        <h2 id="tutorial-title">{current.title}</h2>
        <p>{current.body}</p>
        <div className="tutorial-keys" aria-hidden="true">{current.keys.map((key) => <kbd key={key}>{key}</kbd>)}</div>
        <div className="tutorial-actions">
          <button className="button button--quiet" onClick={finish}>スキップ</button>
          {step > 0 && <button className="button button--quiet" onClick={() => setStep((value) => value - 1)}>戻る</button>}
          <button className="button button--primary" onClick={() => step === steps.length - 1 ? finish() : setStep((value) => value + 1)}>{step === steps.length - 1 ? '探索を始める' : '次へ'}</button>
        </div>
      </div>
    </div>
  )
}
