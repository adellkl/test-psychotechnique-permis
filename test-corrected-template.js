// Test du template corrigé avec le bon nom d'équipe
// Envoi d'un email à adelloukal2@gmail.com avec "test psychotechnique Clichy"

const ELASTIC_EMAIL_API_KEY = 'B0D3C9F949F85DF5B9045463F6B4A04C1194929A06D05B8B972AAC0B14682CEFB03CA8FA79579D005F264103C6C92987';
const FROM_EMAIL = 'contact@test-psychotechnique-permis.com';
const TO_EMAIL = 'adelloukal2@gmail.com';

async function sendCorrectedTestEmail() {
  console.log('🚀 Envoi d\'un email de test avec le nom d\'équipe corrigé...');
  console.log(`📧 De: ${FROM_EMAIL}`);
  console.log(`📧 À: ${TO_EMAIL}`);

  try {
    const formData = new URLSearchParams();
    formData.append('apikey', ELASTIC_EMAIL_API_KEY);
    formData.append('from', FROM_EMAIL);
    formData.append('fromName', 'Test Psychotechnique Permis');
    formData.append('to', TO_EMAIL);
    formData.append('subject', 'Test - Template corrigé (test psychotechnique Clichy)');
    formData.append('bodyHtml', `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header simple -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">✅ Rendez-vous confirmé</h1>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #2563eb; margin-top: 0;">Bonjour Adel Loukal,</h2>

        <p>Votre rendez-vous pour le test psychotechnique a été confirmé avec succès.</p>

        <!-- Informations principales -->
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">📅 Détails du rendez-vous</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">📆 Date :</td>
                    <td style="padding: 8px 0; color: #1f2937;">15 novembre 2024</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">⏰ Heure :</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">14:30</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">📍 Lieu :</td>
                    <td style="padding: 8px 0; color: #1f2937;">Centre Test Psychotechnique Permis</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">🏠 Adresse :</td>
                    <td style="padding: 8px 0; color: #1f2937;">82 Rue Henri Barbusse, 92110 Clichy</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #1f2937;">💰 Tarif :</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">90€</td>
                </tr>
            </table>
        </div>

        <!-- Informations importantes -->
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⚠️ À noter</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Arrivez 15 minutes avant l'heure</li>
                <li>Munissez-vous d'une pièce d'identité valide</li>
                <li>Apportez vos lunettes si vous en portez</li>
                <li>Paiement en espèces</li>
            </ul>
        </div>

        <!-- Contact -->
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Contact :</strong> 07 65 56 53 79</p>
            <p><a href="https://test-psychotechnique-permis.com" style="color: #2563eb; text-decoration: none;">🌐 Visitez notre site web</a></p>
        </div>

        <p style="text-align: center; color: #6b7280; font-size: 14px;">
            Merci de votre confiance !<br>
            L'équipe de test psychotechnique Clichy
        </p>
    </div>
</body>
</html>
    `);
    formData.append('bodyText', `
Bonjour Adel Loukal,

Votre rendez-vous a été confirmé avec succès.

📅 DÉTAILS DU RENDEZ-VOUS :
Date : 15 novembre 2024
Heure : 14:30
Lieu : Centre Test Psychotechnique Permis
Adresse : 82 Rue Henri Barbusse, 92110 Clichy
Tarif : 90€

⚠️ À NOTER :
- Arrivez 15 minutes avant l'heure
- Munissez-vous d'une pièce d'identité valide
- Apportez vos lunettes si vous en portez
- Paiement en espèces

Contact : 07 65 56 53 79
Site web : https://test-psychotechnique-permis.com

Merci de votre confiance !
L'équipe de test psychotechnique Clichy
`);

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
      console.log('✅ Email corrigé envoyé avec succès !');
      console.log('📬 Transaction ID:', result.data?.transactionid || 'N/A');
      console.log('📬 Message ID:', result.data?.messageid || 'N/A');
      console.log('\n🎉 Vérifiez votre boîte email adelloukal2@gmail.com');
      console.log('📧 Le template maintenant affiche "L\'équipe de test psychotechnique Clichy"');
    } else {
      throw new Error(`Échec de l'envoi: ${result.error || 'Erreur inconnue'}`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email corrigé:');
    console.error(error.message);
  }
}

sendCorrectedTestEmail();
