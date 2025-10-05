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

        // Template HTML professionnel pour notification admin
        const htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #2563eb; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Nouvelle réservation</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              
              <!-- Client Info -->
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Informations client</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Nom complet</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${appointmentData.first_name} ${appointmentData.last_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${appointmentData.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Téléphone</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${appointmentData.phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Motif</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px;">${appointmentData.reason}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Appointment Details -->
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Détails du rendez-vous</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Date</td>
                    <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Heure</td>
                    <td style="padding: 8px 0; color: #2563eb; font-size: 16px; font-weight: 600;">${appointmentData.appointment_time}</td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.test-psychotechnique-permis.com/admin/dashboard" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">Accéder au tableau de bord</a>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
                Test Psychotechnique Permis<br>
                82 Rue Henri Barbusse, 92110 Clichy<br>
                <a href="tel:0765565379" style="color: #2563eb; text-decoration: none;">07 65 56 53 79</a>
              </p>
            </div>
            
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
        formData.append('subject', `Nouvelle réservation - ${appointmentData.first_name} ${appointmentData.last_name} - ${appointmentData.appointment_time}`);
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
