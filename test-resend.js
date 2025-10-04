const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('🧪 Testing Resend configuration...');
    console.log('From:', process.env.FROM_EMAIL);
    console.log('To:', process.env.ADMIN_EMAIL);
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'f.sebti@outlook.com',
      subject: 'Test Email - Permis Expert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Test Email ✅</h2>
          <p>This is a test email from your Permis Expert application.</p>
          <p><strong>Sent at:</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: 'Test email from Permis Expert'
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', data.id);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

testEmail();
