'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { AdminLogger, logAdminActivity } from '../../lib/adminLogger'
import { validateAdminLogin, sanitizeString, checkRateLimit } from '../../lib/validation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Rate limiting check (3 attempts per minute)
    if (!checkRateLimit('admin_login', 3, 60000)) {
      setError('Trop de tentatives de connexion. Veuillez patienter une minute.')
      return
    }

    // Validate inputs
    const validation = validateAdminLogin({ email, password })
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0])
      return
    }

    setLoading(true)

    try {
      // Sanitize email
      const sanitizedEmail = sanitizeString(email).toLowerCase()
      
      // Debug: Log the connection attempt
      console.log('Attempting login with:', sanitizedEmail)
      
      // Simple authentication check against admins table
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', sanitizedEmail)
        .single()

      console.log('Supabase response:', { data, error })

      if (error || !data) {
        console.error('Database error:', error)
        throw new Error('Email ou mot de passe incorrect')
      }

      // In production, you should hash and compare passwords properly
      // For now, we'll use a simple comparison
      if (password === 'admin123') {
        // Store admin session with timestamp
        const adminSession = {
          id: data.id,
          email: data.email,
          full_name: data.full_name
        }
        localStorage.setItem('admin_session', JSON.stringify(adminSession))
        localStorage.setItem('admin_session_timestamp', Date.now().toString())
        
        // Log the login activity
        await logAdminActivity(AdminLogger.ACTIONS.LOGIN, `Admin ${data.full_name} logged in`)
        
        // Redirect to dashboard
        window.location.href = '/admin/dashboard'
      } else {
        throw new Error('Email ou mot de passe incorrect')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Espace Administrateur
          </h1>
          <p className="text-blue-200 text-sm">
            Centre de Test Psychotechnique - Clichy
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 p-4 rounded-xl animate-shake">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-900">Erreur de connexion</p>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="transform transition-all duration-200 hover:scale-[1.01]">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-focus-within:from-blue-200 group-focus-within:to-purple-200 transition-all">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="admin@permis-expert.fr"
                />
              </div>
            </div>

            <div className="transform transition-all duration-200 hover:scale-[1.01]">
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-focus-within:from-purple-200 group-focus-within:to-pink-200 transition-all">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-16 pr-14 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] transform"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span className="animate-pulse">Connexion en cours...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Se connecter
                  <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    Identifiants de test
                  </h3>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">Email :</span> admin@permis-expert.fr
                    </p>
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">Mot de passe :</span> admin123
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
