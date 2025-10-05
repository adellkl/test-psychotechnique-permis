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

        // Template HTML professionnel compatible tous clients email
        const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Nouvelle réservation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px 20px; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-family: Arial, sans-serif; font-weight: bold;">
                                ✅ Nouvelle réservation
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Alerte -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #dbeafe; border-left: 4px solid #2563eb; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="margin: 0; color: #1e40af; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                                            🔔 Un nouveau client a réservé un rendez-vous
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Client Info -->
                    <tr>
                        <td style="padding: 10px 30px 20px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                👤 Informations client
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td width="130" style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Nom complet :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif; font-weight: 600;">
                                        ${appointmentData.first_name} ${appointmentData.last_name}
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Email :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        <a href="mailto:${appointmentData.email}" style="color: #2563eb; text-decoration: none;">${appointmentData.email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Téléphone :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        <a href="tel:${appointmentData.phone}" style="color: #2563eb; text-decoration: none;">${appointmentData.phone}</a>
                                    </td>
                                </tr>
                                <tr style="background-color: #f9fafb;">
                                    <td style="padding: 10px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif; vertical-align: top;">
                                        <strong>Motif :</strong>
                                    </td>
                                    <td style="padding: 10px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif;">
                                        ${appointmentData.reason}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Appointment Details -->
                    <tr>
                        <td style="padding: 10px 30px 30px;">
                            <h2 style="margin: 0 0 15px 0; color: #111827; font-size: 18px; font-family: Arial, sans-serif; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                📅 Détails du rendez-vous
                            </h2>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3c7; border-radius: 6px; border: 2px solid #fbbf24;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="100" style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: Arial, sans-serif;">
                                                    <strong>📆 Date :</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 15px; font-family: Arial, sans-serif; font-weight: 600;">
                                                    ${formattedDate}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #92400e; font-size: 14px; font-family: Arial, sans-serif;">
                                                    <strong>⏰ Heure :</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #dc2626; font-size: 20px; font-family: Arial, sans-serif; font-weight: bold;">
                                                    ${appointmentData.appointment_time}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 10px 30px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="border-radius: 6px; background-color: #2563eb;">
                                        <a href="https://www.test-psychotechnique-permis.com/admin/dashboard" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block;">
                                            📊 Accéder au tableau de bord
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; border-top: 2px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 5px 0; color: #111827; font-size: 14px; font-family: Arial, sans-serif; font-weight: bold;">
                                            Test Psychotechnique Permis
                                        </p>
                                        <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 13px; font-family: Arial, sans-serif;">
                                            📍 82 Rue Henri Barbusse, 92110 Clichy
                                        </p>
                                        <p style="margin: 0; color: #6b7280; font-size: 13px; font-family: Arial, sans-serif;">
                                            📞 <a href="tel:0765565379" style="color: #2563eb; text-decoration: none; font-weight: 600;">07 65 56 53 79</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
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
