require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hzfpscgdyrqbplmhgwhi.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNotifications() {
  console.log('🔍 Test du système de notifications\n')

  try {
    // 1. Vérifier les admins
    console.log('1️⃣ Vérification des admins...')
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('id, email, full_name')

    if (adminsError) {
      console.error('❌ Erreur admins:', adminsError)
      return
    }

    console.log(`✅ ${admins.length} admin(s) trouvé(s):`)
    admins.forEach(admin => {
      console.log(`   - ${admin.full_name} (${admin.email}) - ID: ${admin.id}`)
    })

    // 2. Vérifier les notifications existantes
    console.log('\n2️⃣ Vérification des notifications existantes...')
    const { data: notifications, error: notifsError } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (notifsError) {
      console.error('❌ Erreur notifications:', notifsError)
      return
    }

    console.log(`✅ ${notifications.length} notification(s) trouvée(s):`)
    notifications.forEach(notif => {
      console.log(`   - ${notif.title} (${notif.type}) - Lu: ${notif.is_read}`)
      console.log(`     Créée: ${new Date(notif.created_at).toLocaleString('fr-FR')}`)
    })

    // 3. Vérifier le dernier rendez-vous
    console.log('\n3️⃣ Vérification du dernier rendez-vous...')
    const { data: lastAppointment, error: aptError } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (aptError) {
      console.error('❌ Erreur rendez-vous:', aptError)
      return
    }

    if (lastAppointment && lastAppointment.length > 0) {
      const apt = lastAppointment[0]
      console.log(`✅ Dernier RDV:`)
      console.log(`   - Client: ${apt.first_name} ${apt.last_name}`)
      console.log(`   - Date: ${apt.appointment_date} à ${apt.appointment_time}`)
      console.log(`   - Créé: ${new Date(apt.created_at).toLocaleString('fr-FR')}`)
      console.log(`   - ID: ${apt.id}`)

      // Vérifier si une notification existe pour ce RDV
      const { data: relatedNotif } = await supabase
        .from('notifications')
        .select('*')
        .contains('metadata', { appointment_id: apt.id })

      if (relatedNotif && relatedNotif.length > 0) {
        console.log(`   ✅ Notification trouvée pour ce RDV`)
      } else {
        console.log(`   ⚠️  AUCUNE notification trouvée pour ce RDV !`)
      }
    }

    // 4. Créer une notification de test
    console.log('\n4️⃣ Création d\'une notification de test...')
    if (admins.length > 0) {
      const { data: testNotif, error: createError } = await supabase
        .from('notifications')
        .insert([
          {
            admin_id: admins[0].id,
            type: 'info',
            title: 'Test de notification',
            message: 'Ceci est une notification de test créée manuellement',
            link: '/admin/dashboard',
            metadata: { test: true }
          }
        ])
        .select()

      if (createError) {
        console.error('❌ Erreur création:', createError)
      } else {
        console.log('✅ Notification de test créée avec succès!')
      }
    }

    // 5. Vérifier les politiques RLS
    console.log('\n5️⃣ Test de récupération via API...')
    const response = await fetch('http://localhost:3000/api/admin/notifications?limit=5')
    const apiData = await response.json()
    
    if (apiData.notifications) {
      console.log(`✅ API retourne ${apiData.notifications.length} notification(s)`)
    } else {
      console.log('❌ Erreur API:', apiData)
    }

  } catch (error) {
    console.error('❌ Erreur globale:', error)
  }
}

testNotifications()
