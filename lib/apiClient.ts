/**
 * Client API avec support CSRF et authentification
 * Utilisez ces fonctions pour tous les appels API depuis le client
 */

let csrfToken: string | null = null
let csrfExpiry: number = 0

/**
 * Récupérer un token CSRF valide
 */
async function getCSRFToken(): Promise<string> {
  const now = Date.now()
  
  // Réutiliser le token s'il est encore valide (avec marge de 5 minutes)
  if (csrfToken && csrfExpiry > now + 5 * 60 * 1000) {
    return csrfToken
  }
  
  try {
    const response = await fetch('/api/csrf')
    const data = await response.json()
    
    if (data.csrfToken && typeof data.csrfToken === 'string') {
      csrfToken = data.csrfToken
      csrfExpiry = now + (data.expiresIn * 1000)
      return data.csrfToken
    }
  } catch (error) {
    console.error('Erreur récupération CSRF:', error)
  }
  
  throw new Error('Impossible de récupérer le token CSRF')
}

/**
 * Récupérer le token admin depuis localStorage
 */
function getAdminSession(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const session = localStorage.getItem('admin_session')
    if (session) {
      const adminData = JSON.parse(session)
      return adminData.email || null
    }
  } catch (error) {
    console.error('Erreur lecture session admin:', error)
  }
  
  return null
}

/**
 * Effectuer une requête API sécurisée
 */
export async function secureApiCall(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers)
  
  // Ajouter le token admin si disponible
  const adminEmail = getAdminSession()
  if (adminEmail) {
    headers.set('x-admin-session', adminEmail)
    headers.set('authorization', `Bearer ${adminEmail}`)
  }
  
  // Ajouter le token CSRF pour les mutations (POST, PUT, DELETE, PATCH)
  const method = options.method?.toUpperCase() || 'GET'
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    try {
      const token = await getCSRFToken()
      headers.set('X-CSRF-Token', token)
    } catch (error) {
      console.warn('Impossible d\'ajouter le token CSRF:', error)
    }
  }
  
  // Ajouter Content-Type par défaut pour JSON
  if (!headers.has('content-type') && options.body) {
    headers.set('content-type', 'application/json')
  }
  
  return fetch(url, {
    ...options,
    headers
  })
}

/**
 * Appels API simplifiés
 */
export const api = {
  get: (url: string, options?: RequestInit) =>
    secureApiCall(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: any, options?: RequestInit) =>
    secureApiCall(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  put: (url: string, data?: any, options?: RequestInit) =>
    secureApiCall(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }),
  
  delete: (url: string, options?: RequestInit) =>
    secureApiCall(url, { ...options, method: 'DELETE' }),
  
  patch: (url: string, data?: any, options?: RequestInit) =>
    secureApiCall(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
}

/**
 * Gestion des erreurs API
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
    throw new Error(error.error || `Erreur HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * Exemple d'utilisation :
 * 
 * import { api, handleApiResponse } from '@/lib/apiClient'
 * 
 * // GET
 * const response = await api.get('/api/admin/appointments')
 * const data = await handleApiResponse(response)
 * 
 * // POST
 * const response = await api.post('/api/admin/appointments', { name: 'Test' })
 * const data = await handleApiResponse(response)
 * 
 * // PUT
 * const response = await api.put('/api/admin/appointments', { id: 1, name: 'Updated' })
 * const data = await handleApiResponse(response)
 * 
 * // DELETE
 * const response = await api.delete('/api/admin/appointments?id=1')
 * const data = await handleApiResponse(response)
 */
