import { NextResponse } from 'next/server'

function checkEnvironmentVariables() {
  const requiredVars = [
    'ELASTIC_EMAIL_API_KEY',
    'FROM_EMAIL',
    'ADMIN_EMAIL'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])

  return {
    name: 'Variables d\'environnement',
    success: missing.length === 0,
    details: missing.length === 0 
      ? 'Toutes les variables sont configurées' 
      : `Variables manquantes: ${missing.join(', ')}`,
    timestamp: new Date().toISOString()
  }
}

async function checkElasticEmailAPI() {
  try {
    const apiKey = process.env.ELASTIC_EMAIL_API_KEY
    
    if (!apiKey) {
      throw new Error('ELASTIC_EMAIL_API_KEY non configurée')
    }
    
    const response = await fetch(`https://api.elasticemail.com/v2/account/load?apikey=${apiKey}`)
    
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`)
    }

    const data = await response.json()

    return {
      name: 'API Elastic Email',
      success: data.success === true,
      details: data.success ? 'API accessible et fonctionnelle' : 'API non accessible',
      accountInfo: data.success ? {
        email: data.data.email,
        credit: data.data.credit
      } : null,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      name: 'API Elastic Email',
      success: false,
      error: error.message,
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

    // Vérifier les variables d'environnement
    const envCheck = checkEnvironmentVariables()
    results.checks.push(envCheck)
    if (!envCheck.success) {
      results.status = 'error'
      results.errors.push('❌ Variables d\'environnement manquantes')
      return NextResponse.json(results)
    }

    // Vérifier l'API Elastic Email
    const apiCheck = await checkElasticEmailAPI()
    results.checks.push(apiCheck)
    if (!apiCheck.success) {
      results.status = 'error'
      results.errors.push(`❌ API Elastic Email: ${apiCheck.error}`)
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
