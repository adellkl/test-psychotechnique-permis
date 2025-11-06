'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.push('/admin')
      return
    }

    fetchNotifications()
  }, [router])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) return
    
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [notificationId] })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        alert('Notification supprimée avec succès')
      } else {
        const data = await response.json()
        alert('Erreur: ' + (data.error || 'Impossible de supprimer'))
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const deleteAllFiltered = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer toutes les notifications ${filter === 'all' ? '' : filter} ?`)) return
    
    try {
      const idsToDelete = filteredNotifications.map(n => n.id)
      if (idsToDelete.length === 0) {
        alert('Aucune notification à supprimer')
        return
      }
      
      const response = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: idsToDelete })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => !idsToDelete.includes(n.id)))
        alert(`${idsToDelete.length} notification(s) supprimée(s) avec succès`)
      } else {
        const data = await response.json()
        alert('Erreur: ' + (data.error || 'Impossible de supprimer'))
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.is_read
    if (filter === 'read') return n.is_read
    return true
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_appointment': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancellation': return 'bg-red-100 text-red-800 border-red-300'
      case 'reminder': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'info': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_appointment': return '📅'
      case 'cancellation': return '❌'
      case 'reminder': return '⏰'
      case 'info': return 'ℹ️'
      default: return '🔔'
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [notificationId], markAsRead: true })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        ))
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderne responsive */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group flex-shrink-0"
                title="Retour au dashboard"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl">🔔</span>
                  <span className="truncate">Notifications</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Gérez toutes vos notifications en un seul endroit</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {filteredNotifications.length > 0 && (
                <button
                  onClick={deleteAllFiltered}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Tout supprimer</span>
                  <span className="sm:hidden">Supprimer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques et Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Non lues</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">{notifications.filter(n => !n.is_read).length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl">🔴</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Lues</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">{notifications.filter(n => n.is_read).length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl sm:text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres responsive */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔴 Non lues
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm ${
                filter === 'read'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Lues
            </button>
          </div>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement des notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🔔</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune notification</h3>
            <p className="text-gray-500 text-lg">Vous n'avez pas de notifications {filter === 'unread' ? 'non lues' : filter === 'read' ? 'lues' : ''} pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border-2 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer group ${
                  notification.is_read ? 'border-gray-200 hover:border-gray-300' : 'border-blue-400 bg-blue-50/30 hover:border-blue-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex items-start gap-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xl sm:text-2xl shadow-md flex-shrink-0">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                          {!notification.is_read && (
                            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold animate-pulse shadow-sm">
                              NOUVEAU
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">
                            {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {notification.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{notification.message}</p>
                    {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {notification.metadata.client_name && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">👤</span>
                              <span className="font-semibold text-gray-700">Client:</span>
                              <span className="text-gray-900">{notification.metadata.client_name}</span>
                            </div>
                          )}
                          {notification.metadata.appointment_date && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">📅</span>
                              <span className="font-semibold text-gray-700">Date:</span>
                              <span className="text-gray-900">{notification.metadata.appointment_date}</span>
                            </div>
                          )}
                          {notification.metadata.appointment_time && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">⏰</span>
                              <span className="font-semibold text-gray-700">Heure:</span>
                              <span className="text-gray-900 font-bold">{notification.metadata.appointment_time}</span>
                            </div>
                          )}
                          {notification.metadata.client_email && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">📧</span>
                              <span className="font-semibold text-gray-700">Email:</span>
                              <a href={`mailto:${notification.metadata.client_email}`} className="text-blue-600 hover:underline">{notification.metadata.client_email}</a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">Marquer lu</span>
                        <span className="sm:hidden">Lu</span>
                      </button>
                    )}
                    {notification.link && (
                      <button
                        onClick={() => router.push(notification.link!)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Voir</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Supprimer</span>
                      <span className="sm:hidden">✕</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
