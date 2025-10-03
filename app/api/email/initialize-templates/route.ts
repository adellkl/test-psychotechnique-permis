import { NextRequest, NextResponse } from 'next/server'
import { initializeEmailTemplates } from '../../../../lib/emailTemplates'

export async function POST(request: NextRequest) {
  try {
    const result = await initializeEmailTemplates()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Templates email initialisés avec succès' 
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
      error: 'Erreur lors de l\'initialisation des templates' 
    }, { status: 500 })
  }
}
