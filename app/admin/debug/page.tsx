'use client'

import { useState, useEffect } from 'react'
import AuthGuard from '../components/AuthGuard'
import Sidebar from '../components/Sidebar'
import Toast from '../components/Toast'
import DebugHealthTab from '../components/debug/HealthTab'
import DebugEmailTab from '../components/debug/EmailTab'
import DebugDatabaseTab from '../components/debug/DatabaseTab'
import DebugLogsTab from '../components/debug/LogsTab'
import DebugTestsTab from '../components/debug/TestsTab'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'

type TabType = 'health' | 'email' | 'database' | 'logs' | 'test-forms'

export default function DebugPage() {
  return (
    <AuthGuard>
      <DebugContent />
    </AuthGuard>
  )
}

function DebugContent() {
  const [activeTab, setActiveTab] = useState<TabType>('health')
  const [admin, setAdmin] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      window.location.href = '/admin'
      return
    }
    const adminData = JSON.parse(adminSession)
    setAdmin(adminData)
    logAdminActivity(AdminLogger.ACTIONS.VIEW_DASHBOARD, 'Accessed debug panel')
  }, [])

  const logout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_session_timestamp')
    window.location.href = '/admin'
  }

  const tabs = [
    { id: 'health' as TabType, label: 'Santé App', icon: '🏥' },
    { id: 'email' as TabType, label: 'Service Email', icon: '📧' },
    { id: 'database' as TabType, label: 'Base de données', icon: '🗄️' },
    { id: 'logs' as TabType, label: 'Logs Monitoring', icon: '📊' },
    { id: 'test-forms' as TabType, label: 'Tests', icon: '🧪' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar
        activeSection="debug"
        onSectionChange={() => {}}
        adminName={admin?.full_name || 'Admin'}
        onLogout={logout}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 pt-16 lg:pt-0">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              🔧 Panneau de Debug
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Surveillance et tests de l'application
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
          {/* Onglets */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md mb-3 sm:mb-4 overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[80px] sm:min-w-[100px] px-2 sm:px-3 py-2 sm:py-3 text-xs font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <span className="text-lg sm:text-xl">{tab.icon}</span>
                    <span className="text-[10px] sm:text-xs leading-tight">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4">
            {activeTab === 'health' && <DebugHealthTab setToast={setToast} />}
            {activeTab === 'email' && <DebugEmailTab setToast={setToast} adminEmail={admin?.email} />}
            {activeTab === 'database' && <DebugDatabaseTab setToast={setToast} />}
            {activeTab === 'logs' && <DebugLogsTab setToast={setToast} />}
            {activeTab === 'test-forms' && <DebugTestsTab setToast={setToast} />}
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
