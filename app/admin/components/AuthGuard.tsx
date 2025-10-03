'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

interface AdminSession {
  id: string
  email: string
  full_name: string
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminData, setAdminData] = useState<AdminSession | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('admin_session')
        
        if (!sessionData) {
          router.push('/admin')
          return
        }

        const session: AdminSession = JSON.parse(sessionData)
        
        // Validate session structure
        if (!session.id || !session.email || !session.full_name) {
          localStorage.removeItem('admin_session')
          router.push('/admin')
          return
        }

        // Check if session is expired (optional: add timestamp validation)
        const sessionTimestamp = localStorage.getItem('admin_session_timestamp')
        if (sessionTimestamp) {
          const sessionTime = parseInt(sessionTimestamp)
          const currentTime = Date.now()
          const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours
          
          if (currentTime - sessionTime > sessionDuration) {
            localStorage.removeItem('admin_session')
            localStorage.removeItem('admin_session_timestamp')
            router.push('/admin')
            return
          }
        }

        setAdminData(session)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth validation error:', error)
        localStorage.removeItem('admin_session')
        localStorage.removeItem('admin_session_timestamp')
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect
  }

  return <>{children}</>
}

export const useAdmin = () => {
  const [adminData, setAdminData] = useState<AdminSession | null>(null)

  useEffect(() => {
    const sessionData = localStorage.getItem('admin_session')
    if (sessionData) {
      try {
        setAdminData(JSON.parse(sessionData))
      } catch (error) {
        console.error('Error parsing admin session:', error)
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_session_timestamp')
    window.location.href = '/admin'
  }

  return { adminData, logout }
}
