import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    const base = 'CEC Portal - Cebu Eastern College'
    document.title = title === 'Home' ? base : `${title} | ${base}`
  }, [title])
}
