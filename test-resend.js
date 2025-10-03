const { Resend } = require('resend');

const resend = new Resend('re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT');

async function testResendAPI() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'adelloukal2@gmail.com',
      subject: 'Test API Resend - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Configuration API Testée ✅</h2>
          <p>Votre nouvelle clé API Resend fonctionne parfaitement !</p>
          <p><strong>Clé API:</strong> re_DdhZzjoL_DWUXFDm8hq4dFBokVfSYgavT</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: 'Configuration API Resend testée avec succès.'
    });

    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }

    console.log('✅ Email envoyé avec succès!');
    console.log('📧 ID de l\'email:', data.id);
    console.log('🎯 Destinataire: adelloukal2@gmail.com');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testResendAPI();
