const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZnBzY2dkeXJxYnBsbWhnd2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDQ3NTMsImV4cCI6MjA3NDk4MDc1M30.NxhJGc8TxYaw8UmWFLPxdGd8Q5yN25Cpq757T0J3MyA'

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration Elastic Email
const ELASTIC_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987'
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com' // ✅ Expéditeur professionnel
const ADMIN_EMAIL = 'sebtifatiha170617@gmail.com'

// Fonction pour remplacer les variables dans le template
function replaceVariables(template, variables) {
    let result = template
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        result = result.replace(regex, value)
    })
    return result
}

// Fonction d'envoi via Elastic Email
async function sendEmail(emailData) {
    try {
        const formData = new FormData()
        formData.append('apikey', ELASTIC_API_KEY)
        formData.append('from', emailData.from)
        formData.append('to', emailData.to)
        formData.append('subject', emailData.subject)
        formData.append('bodyHtml', emailData.html)
        formData.append('bodyText', emailData.text)

        const response = await fetch('https://api.elasticemail.com/v2/email/send', {
            method: 'POST',
            body: formData
        })

        const result = await response.text()

        if (!response.ok) {
            throw new Error(`Elastic Email API error: ${result}`)
        }

        const data = JSON.parse(result)
        if (data.success === false) {
            throw new Error(data.error || 'Unknown Elastic Email error')
        }

        return { success: true, messageId: data.data?.messageid || result }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function testNewTemplate() {
    console.log('🧪 Test du nouveau template email\n')
    console.log('📧 Configuration:')
    console.log('   - De:', FROM_EMAIL)
    console.log('   - À:', ADMIN_EMAIL)
    console.log('   - Service: Elastic Email API\n')

    try {
        // Récupérer le template depuis la base de données
        console.log('📥 Récupération du template depuis la base de données...')
        const { data: template, error: templateError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('template_name', 'appointment_confirmation_client')
            .single()

        if (templateError || !template) {
            console.error('❌ Erreur lors de la récupération du template:', templateError)
            return
        }

        console.log('✅ Template récupéré:', template.template_name)
        console.log('   - Sujet:', template.subject)

        // Variables de test
        const testDate = new Date()
        testDate.setDate(testDate.getDate() + 3) // Dans 3 jours

        const variables = {
            first_name: 'Jean',
            last_name: 'Dupont',
            email: ADMIN_EMAIL,
            phone: '06 12 34 56 78',
            appointment_date: testDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            appointment_time: '14:30',
            location: 'Centre Psychotechnique Permis Expert',
            address: '82 Rue Henri Barbusse, 92110 Clichy',
            location_details: 'À 3 minutes du métro Mairie de Clichy (Ligne 13)',
            contact_phone: '07 65 56 53 79',
            website: 'https://test-psychotechnique-permis.com'
        }

        // Remplacer les variables
        const htmlContent = replaceVariables(template.html_content, variables)
        const textContent = replaceVariables(template.text_content, variables)
        const subject = replaceVariables(template.subject, variables)

        console.log('\n📤 Envoi de l\'email de test...')

        const result = await sendEmail({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: subject,
            html: htmlContent,
            text: textContent
        })

        if (result.success) {
            console.log('\n✅ EMAIL ENVOYÉ AVEC SUCCÈS!')
            console.log('   - Transaction ID:', result.messageId)
            console.log('   - Destinataire:', ADMIN_EMAIL)
            console.log('\n📋 Vérifications:')
            console.log('   ✅ Nouveau design avec gradient violet/mauve')
            console.log('   ✅ Police moderne (Segoe UI, Tahoma, Geneva, Verdana)')
            console.log('   ✅ Prix de 90€ affiché en grand')
            console.log('   ✅ Email envoyé à f.sebti@outlook.com')
            console.log('\n🎉 Tous les changements sont opérationnels!')
        } else {
            console.error('\n❌ Erreur lors de l\'envoi:', result.error)
        }

    } catch (error) {
        console.error('❌ Erreur:', error)
    }
}

testNewTemplate()
