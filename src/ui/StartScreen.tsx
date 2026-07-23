import { getMuseumMode } from '../app/museumMode'
import { useMuseumStore } from '../state/useMuseumStore'

export function StartScreen() {
  const enterMuseum = useMuseumStore((state) => state.enterMuseum)
  const enterExhibit = useMuseumStore((state) => state.enterExhibit)
  const requestViewSpot = useMuseumStore((state) => state.requestViewSpot)
  const openSettings = useMuseumStore((state) => state.openOverlay)
  const progress = useMuseumStore((state) => state.progress)
  const lastVisited = useMuseumStore((state) => state.lastVisitedExhibitId)
  const mode = getMuseumMode()
  const hasProgress = Object.values(progress).some((value) => value !== 'unvisited')

  const continueVisit = () => {
    enterMuseum()
    if (!lastVisited) return
    enterExhibit(lastVisited)
    requestViewSpot(lastVisited)
  }

  return (
    <section className={`start-screen ${mode === 'v2' ? 'start-screen--v2' : ''}`} aria-labelledby="museum-title">
      <div className="start-screen__copy">
        <p className="eyebrow">{mode === 'v2' ? 'A MUSEUM THAT MOVES WITH YOU' : 'A MUSEUM FOR DOUBTFUL EYES'}</p>
        <h1 id="museum-title">PARALLAX{mode === 'v2' && <span>2.0</span>}</h1>
        <p className="start-screen__lead">
          {mode === 'v2'
            ? '12の錯視。6つの部屋。あなたの目だけが作る結果。'
            : '見えているものは、本当にそこにある？ 10 の錯視を歩いて、動かして、確かめる。'}
        </p>
        {mode === 'v2' && (
          <ul className="start-screen__stats" aria-label="PARALLAX 2.0の構成">
            <li><strong>12</strong><span>OPTICAL<br />ILLUSIONS</span></li>
            <li><strong>6</strong><span>SPATIAL<br />ROOMS</span></li>
            <li><strong>4</strong><span>PARALLAX<br />ORIGINALS</span></li>
          </ul>
        )}
        <div className="start-screen__actions">
          {mode === 'v2' && hasProgress ? (
            <>
              <button className="button button--primary" onClick={continueVisit}>
                続きから <span aria-hidden="true">→</span>
              </button>
              <button className="button button--quiet" onClick={() => openSettings('passport')}>
                パスポートを見る
              </button>
              <button className="button button--quiet" onClick={enterMuseum}>
                自由に入館
              </button>
            </>
          ) : (
            <button className="button button--primary" onClick={enterMuseum}>
              入館する <span aria-hidden="true">→</span>
            </button>
          )}
          <button className="button button--quiet" onClick={() => openSettings('settings')}>
            設定
          </button>
        </div>
      </div>
      <dl className="controls-card" aria-label="操作方法">
        {mode === 'v2' ? (
          <>
            <div><dt>MOVE</dt><dd>歩くことが、展示への入力</dd></div>
            <div><dt>ALIGN</dt><dd>mintの輪で像を成立させる</dd></div>
            <div><dt>SWITCH</dt><dd>照明・視点・構造を比較する</dd></div>
            <div><dt>KEEP</dt><dd>結果は体験後に自動で記録</dd></div>
          </>
        ) : (
          <>
            <div><dt>MOVE</dt><dd>WASD / 矢印 / 左スティック</dd></div>
            <div><dt>LOOK</dt><dd>マウス / 右側をドラッグ</dd></div>
            <div><dt>VIEW</dt><dd>E / タップ</dd></div>
            <div><dt>HINT</dt><dd>自分で開くまで秘密です</dd></div>
          </>
        )}
      </dl>
    </section>
  )
}
