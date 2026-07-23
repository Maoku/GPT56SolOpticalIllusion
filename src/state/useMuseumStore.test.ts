import {
  MUSEUM_STORAGE_KEY,
  migrateMuseumState,
  useMuseumStore,
} from './useMuseumStore'

describe('museum store', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    useMuseumStore.setState({
      progress: {},
      outcomes: {},
      lastVisitedExhibitId: null,
      stage: 'title',
      overlay: 'none',
    })
  })

  it('never lowers exhibit progress', () => {
    const store = useMuseumStore.getState()
    store.markRevealed('muller-lyer')
    useMuseumStore.getState().markInteracted('muller-lyer')
    expect(useMuseumStore.getState().progress['muller-lyer']).toBe('revealed')
  })

  it('pauses exploration while a panel is open', () => {
    useMuseumStore.getState().enterMuseum()
    useMuseumStore.getState().openOverlay('settings')
    expect(useMuseumStore.getState()).toMatchObject({ stage: 'exploring', overlay: 'settings' })
    useMuseumStore.getState().closeOverlay()
    expect(useMuseumStore.getState().overlay).toBe('none')
  })

  it('persists visit progress across visits', () => {
    useMuseumStore.getState().markInteracted('ponzo')
    expect(window.localStorage.getItem(MUSEUM_STORAGE_KEY)).toContain('ponzo')
  })

  it('migrates valid V1 progress and rejects unknown exhibits', () => {
    expect(migrateMuseumState({
      progress: { ponzo: 'revealed', 'not-real': 'interacted' },
      settings: { reducedMotion: true },
      tutorialSeen: true,
    })).toMatchObject({
      progress: { ponzo: 'revealed' },
      settings: { reducedMotion: true, quality: 'high' },
      tutorialSeen: true,
      outcomes: {},
      lastVisitedExhibitId: null,
    })
  })

  it('records reusable outcomes without lowering existing progress', () => {
    const store = useMuseumStore.getState()
    store.markRevealed('muller-lyer')
    store.recordOutcome('muller-lyer', {
      metric: { label: '知覚した長さの差', value: -8, unit: '%' },
    })
    expect(useMuseumStore.getState()).toMatchObject({
      progress: { 'muller-lyer': 'revealed' },
      lastVisitedExhibitId: 'muller-lyer',
      outcomes: {
        'muller-lyer': {
          kind: 'measurement',
          metric: { value: -8, unit: '%' },
        },
      },
    })
  })

  it('automatically records a result when a spatial reveal is reached', () => {
    useMuseumStore.getState().markRevealed('counterparallax-window')
    expect(useMuseumStore.getState()).toMatchObject({
      progress: { 'counterparallax-window': 'revealed' },
      lastVisitedExhibitId: 'counterparallax-window',
      outcomes: {
        'counterparallax-window': {
          kind: 'sequence',
          axis: 'motion',
        },
      },
    })
  })

  it('automatically records a live classic operation without opening a detail view', () => {
    useMuseumStore.getState().operateLiveExhibit('ponzo')
    expect(useMuseumStore.getState()).toMatchObject({
      stage: 'title',
      progress: { ponzo: 'interacted' },
      outcomes: { ponzo: { kind: 'comparison' } },
    })
  })
})
