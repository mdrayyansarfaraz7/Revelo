import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to, code) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to,
      subject: 'Verify your Revelo Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a202c;">Welcome to Revelo!</h2>
          <p style="font-size: 16px; color: #333;">Your verification code is:</p>
          <div style="margin: 24px 0; font-size: 28px; font-weight: bold; color: #1d4ed8; text-align: center;">
            ${code}
          </div>
          <p style="font-size: 14px; color: #555;">Enter this code in the app to verify your email address.</p>
          <p style="margin-top: 32px; font-size: 14px; color: #999;">– The Revelo Team</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Resend email error:', err);
    throw new Error("Failed to send verification email.");
  }
}
