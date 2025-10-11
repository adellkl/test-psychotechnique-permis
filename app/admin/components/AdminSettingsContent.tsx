'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from './AuthGuard'
import { logAdminActivity, AdminLogger } from '../../../lib/adminLogger'

export default function AdminSettingsContent() {
  const { adminData, logout } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    currentPasswordForChange: false,
    newPassword: false,
    confirmPassword: false
  })

  useEffect(() => {
    if (adminData) {
      setFormData(prev => ({
        ...prev,
        fullName: adminData.full_name || '',
        email: adminData.email || ''
      }))
    }
  }, [adminData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const storedPassword = localStorage.getItem('admin_password') || 'admin123'
      if (formData.currentPassword !== storedPassword) {
        throw new Error('Mot de passe actuel incorrect')
      }

      const { supabase } = await import('../../../lib/supabase')

      const { error: updateError } = await supabase
        .from('admins')
        .update({
          full_name: formData.fullName,
          email: formData.email.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('id', adminData?.id)

      if (updateError) throw updateError

      const updatedSession = {
        id: adminData?.id || '',
        email: formData.email.toLowerCase(),
        full_name: formData.fullName
      }
      localStorage.setItem('admin_session', JSON.stringify(updatedSession))

      await logAdminActivity(
        AdminLogger.ACTIONS.UPDATE,
        `Profil mis à jour: ${formData.fullName}`
      )

      setSuccess('Profil mis à jour avec succès')
      setFormData(prev => ({ ...prev, currentPassword: '' }))
      
      setTimeout(() => window.location.reload(), 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      const storedPassword = localStorage.getItem('admin_password') || 'admin123'
      if (formData.currentPassword !== storedPassword) {
        throw new Error('Mot de passe actuel incorrect')
      }

      localStorage.setItem('admin_password', formData.newPassword)
      
      await logAdminActivity(
        AdminLogger.ACTIONS.UPDATE,
        'Mot de passe modifié'
      )

      setSuccess('Mot de passe changé avec succès')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Messages d'alerte améliorés */}
      {success && (
        <div className="animate-in slide-in-from-top-2 duration-300 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-green-900">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="animate-in slide-in-from-top-2 duration-300 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Carte Informations du profil */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Informations du profil</h2>
              <p className="text-blue-100 text-sm">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Votre nom complet"
              />
            </div>

            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-2 lg:space-y-3">
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700">
              Mot de passe actuel <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                autoComplete="current-password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Confirmez avec votre mot de passe actuel"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500">Requis pour confirmer les modifications</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* Carte Changement de mot de passe */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Sécurité du compte</h2>
              <p className="text-purple-100 text-sm">Modifiez votre mot de passe</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2 lg:space-y-3">
            <label htmlFor="currentPasswordForChange" className="block text-sm font-semibold text-gray-700">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPasswordForChange ? "text" : "password"}
                id="currentPasswordForChange"
                name="currentPassword"
                required
                autoComplete="current-password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Votre mot de passe actuel"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPasswordForChange')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={showPasswords.currentPasswordForChange ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {!showPasswords.currentPasswordForChange ? (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  required
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="Min. 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title={showPasswords.newPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {!showPasswords.newPassword ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
                  placeholder="Répétez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title={showPasswords.confirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {!showPasswords.confirmPassword ? (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">Conseils de sécurité</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Minimum 8 caractères</li>
                  <li>• Combinez majuscules, minuscules et chiffres</li>
                  <li>• Évitez les mots de passe trop simples</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Changer le mot de passe
          </button>
        </form>
      </div>

      {/* Carte Nettoyage des logs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nettoyage de la base de données</h2>
              <p className="text-orange-100 text-sm">Supprimez les anciens logs d'activité</p>
            </div>
          </div>
        </div>

        <LogsCleanupSection />
      </div>
    </div>
  )
}

function LogsCleanupSection() {
  const [loading, setLoading] = useState(false)
  const [olderThan, setOlderThan] = useState('30')
  const [previewData, setPreviewData] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [message, setMessage] = useState('')

  const handlePreview = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`/api/admin/logs-cleanup?olderThan=${olderThan}`)
      const data = await response.json()
      
      if (response.ok) {
        setPreviewData(data)
        setShowPreview(true)
      } else {
        setMessage(data.error || 'Erreur lors de la prévisualisation')
      }
    } catch (error) {
      setMessage('Erreur lors de la prévisualisation')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer tous les logs de plus de ${olderThan} jours ? Cette action est irréversible.`)) {
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/logs-cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ olderThan })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage(`✅ ${data.deletedCount} logs supprimés avec succès`)
        setShowPreview(false)
        setPreviewData(null)
      } else {
        setMessage(`❌ ${data.error || 'Erreur lors de la suppression'}`)
      }
    } catch (error) {
      setMessage('❌ Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">Information</p>
            <p className="text-sm text-blue-800">
              Les logs d'activité admin occupent de l'espace dans la base de données. Supprimez régulièrement les anciens logs pour optimiser les performances.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="olderThan" className="block text-sm font-semibold text-gray-700">
            Supprimer les logs de plus de
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              id="olderThan"
              min="0"
              value={olderThan}
              onChange={(e) => setOlderThan(e.target.value)}
              className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 focus:bg-white"
            />
            <span className="text-gray-700 font-medium">jours (0 = tous les logs)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handlePreview}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
            Prévisualiser
          </button>

          {showPreview && previewData && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
              Supprimer ({previewData.count})
            </button>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-xl ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {showPreview && previewData && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Aperçu</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Nombre de logs:</span> {previewData.count}</p>
              <p><span className="font-medium">Date limite:</span> {new Date(previewData.cutoffDate).toLocaleDateString('fr-FR')}</p>
              <p className="text-xs text-gray-500 mt-2">Les logs affichés ci-dessous sont les 100 premiers (maximum)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
