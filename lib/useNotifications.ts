import { useState, useEffect, useCallback, useRef } from 'react'
import { NotificationSound } from './notificationSound'

interface Notification {
  id: string
  admin_id: string | null
  type: string
  title: string
  message: string
  link: string | null
  metadata: any
  is_read: boolean
  read_at: string | null
  created_at: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  soundEnabled: boolean
  toggleSound: () => void
}

/**
 * Hook personnalisé pour gérer les notifications avec son et polling
 */
export function useNotifications(pollingInterval: number = 30000): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const previousUnreadCount = useRef(0)
  const isFirstLoad = useRef(true)

  // Initialiser les préférences de son
  useEffect(() => {
    NotificationSound.init()
    setSoundEnabled(NotificationSound.isNotificationSoundEnabled())
  }, [])

  // Fonction pour récupérer les notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notifications')
      }
      
      const data = await response.json()
      const notifs = data.notifications || []
      
      setNotifications(notifs)
      const newUnreadCount = notifs.filter((n: Notification) => !n.is_read).length
      setUnreadCount(newUnreadCount)

      // Jouer un son si de nouvelles notifications non lues sont arrivées
      if (!isFirstLoad.current && newUnreadCount > previousUnreadCount.current) {
        const newNotifications = newUnreadCount - previousUnreadCount.current
        console.log(`🔔 ${newNotifications} nouvelle(s) notification(s)`)
        
        if (soundEnabled && NotificationSound.isNotificationSoundEnabled()) {
          NotificationSound.playNotificationSound()
        }

        // Afficher une notification navigateur si autorisé
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Nouvelle notification', {
            body: `Vous avez ${newNotifications} nouvelle(s) notification(s)`,
            icon: '/favicon-32x32.png',
            badge: '/favicon-32x32.png',
            tag: 'admin-notification'
          })
        }
      }

      previousUnreadCount.current = newUnreadCount
      isFirstLoad.current = false
      setError(null)
    } catch (err) {
      console.error('Erreur fetchNotifications:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [soundEnabled])

  // Fonction pour rafraîchir manuellement
  const refresh = useCallback(async () => {
    setLoading(true)
    await fetchNotifications()
  }, [fetchNotifications])

  // Toggle son
  const toggleSound = useCallback(() => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    NotificationSound.setEnabled(newState)
  }, [soundEnabled])

  // Polling automatique
  useEffect(() => {
    // Première récupération
    fetchNotifications()

    // Demander la permission pour les notifications navigateur
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Configurer le polling
    const interval = setInterval(() => {
      fetchNotifications()
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [fetchNotifications, pollingInterval])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    soundEnabled,
    toggleSound
  }
}
