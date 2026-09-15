import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

interface SyncQueueItem {
  id: string
  table: string
  data: Record<string, unknown>
  action: 'insert' | 'update'
  timestamp: number
  retryCount: number
}

const STORAGE_KEY = 'cec-sync-queue'
const MAX_RETRIES = 3

function getQueue(): SyncQueueItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveQueue(queue: SyncQueueItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {
    console.error('Failed to save sync queue')
  }
}

export function useBackgroundSync() {
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const processQueue = useCallback(async () => {
    if (isSyncing) return
    const queue = getQueue()
    if (queue.length === 0) return

    setIsSyncing(true)
    const remaining: SyncQueueItem[] = []

    for (const item of queue) {
      try {
        if (item.action === 'insert') {
          const { error } = await supabase.from(item.table).insert(item.data)
          if (error) throw error
        } else if (item.action === 'update') {
          const { error } = await supabase.from(item.table).update(item.data).eq('id', item.data.id)
          if (error) throw error
        }
      } catch (err) {
        if (item.retryCount < MAX_RETRIES) {
          remaining.push({ ...item, retryCount: item.retryCount + 1 })
        }
      }
    }

    saveQueue(remaining)
    setPendingCount(remaining.length)
    setIsSyncing(false)
  }, [isSyncing])

  const addToQueue = useCallback((table: string, data: Record<string, unknown>, action: 'insert' | 'update' = 'insert') => {
    const queue = getQueue()
    const item: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      table,
      data,
      action,
      timestamp: Date.now(),
      retryCount: 0
    }
    queue.push(item)
    saveQueue(queue)
    setPendingCount(queue.length)
  }, [])

  const clearQueue = useCallback(() => {
    saveQueue([])
    setPendingCount(0)
  }, [])

  useEffect(() => {
    setPendingCount(getQueue().length)

    const handleOnline = () => {
      processQueue()
    }

    window.addEventListener('online', handleOnline)

    if (navigator.onLine) {
      processQueue()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [processQueue])

  return {
    pendingCount,
    isSyncing,
    addToQueue,
    clearQueue,
    processQueue
  }
}
