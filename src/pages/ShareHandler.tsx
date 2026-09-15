import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useNotificationStore } from '../store/notificationStore'

export default function ShareHandler() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => {
    const title = searchParams.get('title')
    const text = searchParams.get('text')
    const url = searchParams.get('url')

    if (title || text || url) {
      addNotification({
        type: 'info',
        title: 'Content Received',
        message: title || text || url || 'Shared content received',
        duration: 5000
      })
    }

    navigate('/', { replace: true })
  }, [searchParams, navigate, addNotification])

  return null
}
