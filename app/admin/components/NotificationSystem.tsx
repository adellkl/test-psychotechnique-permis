'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
  read_at?: string
  metadata?: any
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    console.log('🚀 [NOTIFICATIONS] Component mounted, fetching notifications...')
    fetchNotifications()

    // Écouter les nouvelles notifications en temps réel
    const subscription = supabase
      .channel('notifications-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('⚡ [REALTIME] Nouvelle notification reçue:', payload.new)
          const newNotification = payload.new as Notification
          // Ajouter la nouvelle notification en tête de liste
          setNotifications(prev => [newNotification, ...prev.slice(0, 19)])
          setUnreadCount(prev => prev + 1)
          
          // Animation
          setAnimate(true)
          setTimeout(() => setAnimate(false), 500)
        }
      )
      .subscribe((status) => {
        console.log('📡 [REALTIME] Subscription status:', status)
      })

    return () => {
      console.log('🔌 [NOTIFICATIONS] Unsubscribing from realtime')
      subscription.unsubscribe()
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      console.log('🔍 [NOTIFICATIONS] Fetching notifications...')
      
      // Récupérer les notifications depuis la table notifications
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      console.log('📊 [NOTIFICATIONS] Response:', { data: notificationsData, error })

      if (error) {
        console.error('❌ [NOTIFICATIONS] Error:', error)
        throw error
      }

      console.log(`✅ [NOTIFICATIONS] Récupéré ${notificationsData?.length || 0} notifications`)
      console.log('📋 [NOTIFICATIONS] Détails:', notificationsData)

      setNotifications(notificationsData || [])
      setUnreadCount(notificationsData?.filter(n => !n.is_read).length || 0)
      
      console.log(`🔔 [NOTIFICATIONS] Non lues: ${notificationsData?.filter(n => !n.is_read).length || 0}`)
    } catch (error) {
      console.error('❌ [NOTIFICATIONS] Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const addNotification = (notificationData: Omit<Notification, 'id' | 'is_read' | 'created_at'>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
      ...notificationData
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 19)])
    setUnreadCount(prev => prev + 1)
    
    // Trigger animation
    setAnimate(true)
    setTimeout(() => setAnimate(false), 500)
  }

  const markAsRead = async (id: string) => {
    try {
      // Mettre à jour dans la base de données
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Mettre à jour l'état local
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, is_read: true, read_at: new Date().toISOString() } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
      
      if (unreadIds.length > 0) {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds)

        if (error) throw error
      }

      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'slot':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'À l\'instant'
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    if (diffInHours < 48) return 'Hier'
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 ${animate ? 'animate-bounce' : ''}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="fixed lg:absolute right-4 lg:right-0 top-20 lg:top-auto lg:mt-3 w-[calc(100vw-2rem)] max-w-sm lg:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-600">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                >
                  Tout lire
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <p className="mt-3 text-sm text-gray-500">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900">Tout est lu !</h3>
                <p className="mt-1 text-sm text-gray-500">Aucune nouvelle notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 ${
                      !notification.is_read ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm font-semibold ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTime(notification.created_at)}
                            </p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm ${
                          !notification.is_read ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button 
              onClick={() => setShowDropdown(false)}
              className="w-full text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2 rounded-lg hover:bg-white"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
