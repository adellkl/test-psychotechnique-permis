'use client'

import { useState } from 'react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  adminName: string
  onLogout: () => void
  isCollapsed?: boolean
  setIsCollapsed?: (collapsed: boolean) => void
}

export default function Sidebar({ activeSection, onSectionChange, adminName, onLogout, isCollapsed: externalIsCollapsed, setIsCollapsed: externalSetIsCollapsed }: SidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(true)
  
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed
  const setIsCollapsed = externalSetIsCollapsed || setInternalIsCollapsed

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'appointments',
      label: 'Rendez-vous',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'statistics',
      label: 'Statistiques',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'slots',
      label: 'Créneaux',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: '/admin/creneaux'
    }
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all"
      >
        {isCollapsed ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isCollapsed ? 'lg:w-20' : 'w-64'
        } bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-700 mt-16 lg:mt-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <p className="text-blue-300 text-sm mt-1">{adminName}</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <svg
                className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  // Fermer le menu mobile après le clic
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true)
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-lg group ${
                  activeSection === item.id ? 'bg-blue-700 shadow-lg' : ''
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {!isCollapsed && activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </a>
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id)
                  // Fermer le menu mobile après la sélection
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true)
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-lg group ${
                  activeSection === item.id ? 'bg-blue-700 shadow-lg' : ''
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {!isCollapsed && activeSection === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            )
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 hover:shadow-lg group ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Déconnexion' : ''}
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="font-medium">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  )
}
