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
            <input
              type="password"
              id="currentPasswordForChange"
              name="currentPassword"
              required
              autoComplete="current-password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
              placeholder="Votre mot de passe actuel"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                autoComplete="new-password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Min. 8 caractères"
              />
            </div>

            <div className="space-y-2 lg:space-y-3">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gray-50 focus:bg-white"
                placeholder="Répétez le mot de passe"
              />
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
    </div>
  )
}
