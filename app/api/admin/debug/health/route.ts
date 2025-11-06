import { NextResponse } from 'next/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://test-psychotechnique-permis.com'

async function checkEndpoint(url: string, name: string) {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeout)
    const responseTime = Date.now() - startTime
    
    return {
      name,
      url,
      success: response.status >= 200 && response.status < 400,
      statusCode: response.status,
      responseTime,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name,
      url,
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }
  }
}

export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      status: 'success',
      checks: [],
      errors: []
    }

    // Vérifier la page d'accueil
    const homeCheck = await checkEndpoint(`${APP_URL}/`, 'Page d\'accueil')
    results.checks.push(homeCheck)
    if (!homeCheck.success) {
      results.status = 'error'
      results.errors.push(`❌ Page d'accueil inaccessible: ${homeCheck.error}`)
    }

    // Vérifier l'API de rendez-vous
    const apiCheck = await checkEndpoint(`${APP_URL}/api/appointments`, 'API Appointments')
    results.checks.push(apiCheck)
    if (!apiCheck.success) {
      results.status = 'warning'
      results.errors.push(`⚠️ API inaccessible: ${apiCheck.error}`)
    }

    // Vérifier la page admin
    const adminCheck = await checkEndpoint(`${APP_URL}/admin`, 'Page Admin')
    results.checks.push(adminCheck)
    if (!adminCheck.success) {
      results.status = 'warning'
      results.errors.push(`⚠️ Page admin inaccessible: ${adminCheck.error}`)
    }

    // Calculer le temps de réponse moyen
    const successfulChecks = results.checks.filter((c: any) => c.success)
    if (successfulChecks.length > 0) {
      const avgResponseTime = successfulChecks.reduce((sum: number, c: any) => sum + c.responseTime, 0) / successfulChecks.length
      results.avgResponseTime = Math.round(avgResponseTime)

      if (avgResponseTime > 3000) {
        results.status = 'warning'
        results.errors.push(`⚠️ Temps de réponse lent: ${results.avgResponseTime}ms`)
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'error',
      checks: [],
      errors: [error.message]
    }, { status: 500 })
  }
}
