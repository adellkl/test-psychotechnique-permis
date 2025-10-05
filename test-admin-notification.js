// Test d'envoi de notification admin
// Pour vérifier que les notifications admin fonctionnent

const ELASTIC_EMAIL_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987';
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com';
const ADMIN_EMAIL = 'adelloukal2@gmail.com,sebtifatiha@live.fr'; // Envoi aux deux admins

async function sendAdminNotification() {
    console.log('🔔 Test de notification admin pour nouveau RDV...');
    console.log(`📧 De: ${FROM_EMAIL}`);
    console.log(`📧 À: ${ADMIN_EMAIL}`);

    try {
        // Données de test
        const appointmentData = {
            first_name: 'Jean',
            last_name: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '06 12 34 56 78',
            appointment_date: '2025-01-15',
            appointment_time: '10:00',
            reason: 'Suspension de permis'
        };

        const formattedDate = new Date(appointmentData.appointment_date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Template HTML pour notification admin
        const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin-top: 0;">🔔 Nouveau Rendez-vous</h1>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Un nouveau client a réservé un rendez-vous</p>
            </div>

            <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Informations du client</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Nom :</td>
                <td style="padding: 10px 0;">${appointmentData.first_name} ${appointmentData.last_name}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px 0; font-weight: bold;">Email :</td>
                <td style="padding: 10px 0;">${appointmentData.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Téléphone :</td>
                <td style="padding: 10px 0;">${appointmentData.phone}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px 0; font-weight: bold;">Motif :</td>
                <td style="padding: 10px 0;">${appointmentData.reason}</td>
              </tr>
            </table>

            <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 30px;">Détails du rendez-vous</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold;">Date :</td>
                <td style="padding: 10px 0;">${formattedDate}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px 0; font-weight: bold;">Heure :</td>
                <td style="padding: 10px 0; font-size: 18px; color: #dc2626; font-weight: bold;">${appointmentData.appointment_time}</td>
              </tr>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.test-psychotechnique-permis.com/admin/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Voir dans le Dashboard</a>
            </div>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              Ceci est une notification automatique du système de rendez-vous<br>
              Test Psychotechnique Permis - 82 Rue Henri Barbusse, 92110 Clichy
            </p>
          </div>
        </body>
      </html>
    `;

        const textContent = `
Nouveau Rendez-vous

Informations du client :
- Nom : ${appointmentData.first_name} ${appointmentData.last_name}
- Email : ${appointmentData.email}
- Téléphone : ${appointmentData.phone}
- Motif : ${appointmentData.reason}

Détails du rendez-vous :
- Date : ${formattedDate}
- Heure : ${appointmentData.appointment_time}

Accédez au dashboard : https://www.test-psychotechnique-permis.com/admin/dashboard
    `;

        // Préparer les données pour Elastic Email
        const formData = new URLSearchParams();
        formData.append('apikey', ELASTIC_EMAIL_API_KEY);
        formData.append('from', FROM_EMAIL);
        formData.append('fromName', 'Test Psychotechnique Permis');
        formData.append('to', ADMIN_EMAIL);
        formData.append('subject', `🔔 Nouveau RDV : ${appointmentData.first_name} ${appointmentData.last_name} - ${formattedDate} ${appointmentData.appointment_time}`);
        formData.append('bodyHtml', htmlContent);
        formData.append('bodyText', textContent);

        // Envoyer la requête
        const response = await fetch('https://api.elasticemail.com/v2/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${responseText}`);
        }

        const result = JSON.parse(responseText);

        if (result.success) {
            console.log('✅ Notification admin envoyée avec succès !');
            console.log('📬 Transaction ID:', result.data?.transactionid || 'N/A');
            console.log('📬 Message ID:', result.data?.messageid || 'N/A');
            console.log('\n🎉 Vérifiez la boîte email', ADMIN_EMAIL);
        } else {
            throw new Error(`Échec de l'envoi: ${result.error || 'Erreur inconnue'}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:');
        console.error(error.message);
    }
}

// Lancer le test
sendAdminNotification();
