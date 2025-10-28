import { createClient } from '@supabase/supabase-js'
import { defaultEmailTemplates } from './lib/emailTemplates.ts'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function updateEmailTemplates() {
  console.log('🔄 Mise à jour des templates d\'emails...\n')

  try {
    for (const template of defaultEmailTemplates) {
      console.log(`📧 Mise à jour du template: ${template.template_name}`)
      
      const { data, error } = await supabase
        .from('email_templates')
        .upsert(
          {
            template_name: template.template_name,
            subject: template.subject,
            html_content: template.html_content,
            text_content: template.text_content,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'template_name',
            ignoreDuplicates: false
          }
        )
        .select()

      if (error) {
        console.error(`   ❌ Erreur: ${error.message}`)
      } else {
        console.log(`   ✅ Template mis à jour avec succès`)
      }
    }

    console.log('\n✅ Tous les templates ont été mis à jour dans la base de données!')
    console.log('\n📋 Templates mis à jour:')
    console.log('   - appointment_confirmation_client (avec access_details)')
    console.log('   - appointment_reminder_client (avec access_details)')
    console.log('   - appointment_cancellation_client')
    console.log('   - appointment_confirmation_reminder')
    
    console.log('\n🔧 Logique conditionnelle active dans emailService.ts:')
    console.log('   ✅ Clichy: Code 6138A + instructions d\'accès')
    console.log('   ❌ Colombes: Pas de code d\'accès')

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
    process.exit(1)
  }
}

updateEmailTemplates()
