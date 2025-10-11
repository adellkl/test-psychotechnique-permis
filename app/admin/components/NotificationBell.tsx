'use client'

import { useRouter } from 'next/navigation'
import { useNotifications } from '../../../lib/useNotifications'
import { NotificationSound } from '../../../lib/notificationSound'

export default function NotificationBell() {
  const router = useRouter()
  const { unreadCount, soundEnabled, toggleSound } = useNotifications(30000) // Poll toutes les 30 secondes

  const handleBellClick = () => {
    router.push('/admin/notifications')
  }

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleSound()
    // Jouer un son de confirmation
    if (!soundEnabled) {
      NotificationSound.playNotificationSound()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Toggle son */}
      <button
        onClick={handleSoundToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
        title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
      >
        {soundEnabled ? (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {soundEnabled ? 'Son activé' : 'Son désactivé'}
        </span>
      </button>

      {/* Cloche de notifications */}
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors group"
        title="Voir les notifications"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Badge avec nombre de notifications */}
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            {/* Animation de pulsation */}
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"></span>
          </>
        )}

        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''}` : 'Aucune notification'}
        </span>
      </button>
    </div>
  )
}
