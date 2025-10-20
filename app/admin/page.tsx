'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([])
  const [rememberMe, setRememberMe] = useState(false)
  const [savePassword, setSavePassword] = useState(false)

  // Récupérer la liste des admins et les préférences sauvegardées au chargement
  useEffect(() => {
    fetchAvailableAdmins()

    // Charger les identifiants sauvegardés
    const savedEmail = localStorage.getItem('admin_saved_email')
    const savedPassword = localStorage.getItem('admin_saved_password')
    const wasRemembered = localStorage.getItem('admin_remember_me') === 'true'

    if (savedEmail) {
      setEmail(savedEmail)
      setSavePassword(true)
    }
    if (savedPassword) {
      setPassword(savedPassword)
    }
    if (wasRemembered) {
      setRememberMe(true)
    }
  }, [])

  const fetchAvailableAdmins = async () => {
    try {
      const response = await fetch('/api/admin/list')
      if (response.ok) {
        const data = await response.json()
        setAvailableAdmins(data.admins || [])
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des admins:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Veuillez remplir tous les champs')
        return
      }

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      // Stocker la session admin
      localStorage.setItem('admin_session', JSON.stringify(data.admin))

      // Sauvegarder les préférences de connexion
      if (rememberMe) {
        localStorage.setItem('admin_remember_me', 'true')
        localStorage.setItem('admin_session_timestamp', Date.now().toString())
      } else {
        localStorage.removeItem('admin_remember_me')
        localStorage.removeItem('admin_session_timestamp')
      }

      if (savePassword) {
        localStorage.setItem('admin_saved_email', email.toLowerCase().trim())
        localStorage.setItem('admin_saved_password', password)
      } else {
        localStorage.removeItem('admin_saved_email')
        localStorage.removeItem('admin_saved_password')
      }

      // Rediriger vers le dashboard
      window.location.href = '/admin/dashboard'

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl sm:rounded-3xl shadow-2xl mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg px-4">
            Espace Administrateur
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm px-4">
            Centre de Test Psychotechnique - Clichy et Colombes
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-5 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 p-3 sm:p-4 rounded-lg sm:rounded-xl animate-shake">
                <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-red-900">Erreur de connexion</p>
                    <p className="text-xs text-red-700 break-words">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-base text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Sélectionnez ou saisissez un email"
                  list="admin-emails"
                />
              </div>
              <datalist id="admin-emails">
                {availableAdmins.map((admin) => (
                  <option key={admin.id} value={admin.email}>
                    {admin.full_name} ({admin.email})
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-800 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-base text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="relative flex items-center p-3 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer group bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 hover:to-blue-50/30">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-2 border-gray-300 rounded-md transition-all cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm font-bold text-gray-800">Rester connecté</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Maintenir la session active pendant 30 jours</p>
                </div>
              </label>

              <label className="relative flex items-center p-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer group bg-gradient-to-r from-purple-50/50 to-transparent hover:from-purple-50 hover:to-purple-50/30">
                <input
                  id="savePassword"
                  name="savePassword"
                  type="checkbox"
                  checked={savePassword}
                  onChange={(e) => setSavePassword(e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-2 focus:ring-purple-500 border-2 border-gray-300 rounded-md transition-all cursor-pointer"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="text-sm font-bold text-gray-800">Se souvenir de mes identifiants</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Pré-remplir email et mot de passe à la prochaine connexion</p>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center items-center py-3 sm:py-4 px-4 sm:px-6 border border-transparent rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] transform"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  <span className="animate-pulse text-sm sm:text-base">Connexion en cours...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}
