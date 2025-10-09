export interface ValidationResult {
  isValid: boolean
  errors: { [key: string]: string }
}

export function sanitizeString(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 500)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email) && email.length <= 254
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/
  return nameRegex.test(name)
}

export function isValidFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today && date <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
}

export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  return timeRegex.test(time)
}

export function validateAppointmentForm(data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  reason: string
  notes?: string
  date: string
  time: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'Le prénom est requis'
  } else if (!isValidName(data.firstName)) {
    errors.firstName = 'Le prénom contient des caractères invalides'
  }

  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Le nom est requis'
  } else if (!isValidName(data.lastName)) {
    errors.lastName = 'Le nom contient des caractères invalides'
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'L\'email est requis'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'L\'email est invalide'
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = 'Le téléphone est requis'
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Le numéro de téléphone est invalide (format français requis)'
  }

  if (!data.reason || data.reason.trim().length === 0) {
    errors.reason = 'Le motif est requis'
  }

  if (!data.date) {
    errors.date = 'La date est requise'
  } else if (!isValidFutureDate(data.date)) {
    errors.date = 'La date doit être dans le futur'
  }

  if (!data.time) {
    errors.time = 'L\'heure est requise'
  } else if (!isValidTime(data.time)) {
    errors.time = 'L\'heure est invalide'
  }

  if (data.notes && data.notes.length > 1000) {
    errors.notes = 'Les notes ne peuvent pas dépasser 1000 caractères'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateAdminLogin(data: {
  email: string
  password: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'L\'email est requis'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'L\'email est invalide'
  }

  if (!data.password || data.password.length === 0) {
    errors.password = 'Le mot de passe est requis'
  } else if (data.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export function validateSlotCreation(data: {
  date: string
  time: string
}): ValidationResult {
  const errors: { [key: string]: string } = {}

  if (!data.date) {
    errors.date = 'La date est requise'
  } else if (!isValidFutureDate(data.date)) {
    errors.date = 'La date doit être dans le futur'
  }

  if (!data.time) {
    errors.time = 'L\'heure est requise'
  } else if (!isValidTime(data.time)) {
    errors.time = 'L\'heure est invalide'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

const rateLimitCache = new Map<string, number[]>()

export function checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now()
  const attempts = rateLimitCache.get(key) || []
  
  const recentAttempts = attempts.filter(time => now - time < windowMs)
  
  if (recentAttempts.length >= maxAttempts) {
    return false
  }
  
  recentAttempts.push(now)
  rateLimitCache.set(key, recentAttempts)
  return true
}

export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key]) as any
    }
  }
  
  return sanitized
}
