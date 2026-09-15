import { useState, useCallback } from 'react'

interface AppState {
  lastRoute: string
  lastVisit: number
  scrollPositions: Record<string, number>
  drafts: Record<string, unknown>
}

const STORAGE_KEY = 'cec-app-state'

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    console.error('Failed to load app state')
  }
  return {
    lastRoute: '/',
    lastVisit: Date.now(),
    scrollPositions: {},
    drafts: {}
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    console.error('Failed to save app state')
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState)

  const saveRoute = useCallback((route: string) => {
    setState(prev => {
      const newState = { ...prev, lastRoute: route, lastVisit: Date.now() }
      saveState(newState)
      return newState
    })
  }, [])

  const saveScrollPosition = useCallback((route: string, position: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        scrollPositions: { ...prev.scrollPositions, [route]: position }
      }
      saveState(newState)
      return newState
    })
  }, [])

  const getScrollPosition = useCallback((route: string): number => {
    return state.scrollPositions[route] || 0
  }, [state.scrollPositions])

  const saveDraft = useCallback((key: string, data: unknown) => {
    setState(prev => {
      const newState = {
        ...prev,
        drafts: { ...prev.drafts, [key]: { data, timestamp: Date.now() } }
      }
      saveState(newState)
      return newState
    })
  }, [])

  const getDraft = useCallback((key: string): unknown | null => {
    const draft = state.drafts[key] as { data: unknown; timestamp: number } | undefined
    if (!draft) return null

    const oneDay = 24 * 60 * 60 * 1000
    if (Date.now() - draft.timestamp > oneDay) {
      setState(prev => {
        const newDrafts = { ...prev.drafts }
        delete newDrafts[key]
        const newState = { ...prev, drafts: newDrafts }
        saveState(newState)
        return newState
      })
      return null
    }

    return draft.data
  }, [state.drafts])

  const clearDraft = useCallback((key: string) => {
    setState(prev => {
      const newDrafts = { ...prev.drafts }
      delete newDrafts[key]
      const newState = { ...prev, drafts: newDrafts }
      saveState(newState)
      return newState
    })
  }, [])

  const clearAllDrafts = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, drafts: {} }
      saveState(newState)
      return newState
    })
  }, [])

  return {
    state,
    saveRoute,
    saveScrollPosition,
    getScrollPosition,
    saveDraft,
    getDraft,
    clearDraft,
    clearAllDrafts
  }
}
