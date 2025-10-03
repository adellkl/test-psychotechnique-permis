import { NextRequest, NextResponse } from 'next/server'
import { testEmailConfiguration } from '../../../../lib/emailService'

export async function POST(request: NextRequest) {
  try {
    const result = await testEmailConfiguration()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email de test envoyé avec succès',
        id: result.id 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors du test email' 
    }, { status: 500 })
  }
}
