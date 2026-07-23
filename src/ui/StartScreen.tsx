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
    <section className="start-screen" aria-labelledby="museum-title">
      <div className="start-screen__copy">
        <p className="eyebrow">A MUSEUM FOR DOUBTFUL EYES</p>
        <h1 id="museum-title">PARALLAX</h1>
        <p className="start-screen__lead">
          {mode === 'v2'
            ? '12の錯視。6つの部屋。あなたの目だけが作る結果。'
            : '見えているものは、本当にそこにある？ 10 の錯視を歩いて、動かして、確かめる。'}
        </p>
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
        <div><dt>MOVE</dt><dd>WASD / 矢印 / 左スティック</dd></div>
        <div><dt>LOOK</dt><dd>マウス / 右側をドラッグ</dd></div>
        <div><dt>VIEW</dt><dd>E / タップ</dd></div>
        <div><dt>HINT</dt><dd>自分で開くまで秘密です</dd></div>
      </dl>
    </section>
  )
}
