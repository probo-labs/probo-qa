import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveOtp } from './store';

const OTP_EXPIRY_MINUTES = Number(process.env.MAILPIT_OTP_MINUTES ?? 10);
const OTP_TTL_MS = OTP_EXPIRY_MINUTES * 60_000;

const transporter = nodemailer.createTransport({
  host: process.env.MAILPIT_HOST ?? 'mailpit.probolabs.ai',
  port: Number(process.env.MAILPIT_PORT ?? 25),
  secure: false,
  auth:
    process.env.MAILPIT_USER && process.env.MAILPIT_PASS
      ? {
          user: process.env.MAILPIT_USER,
          pass: process.env.MAILPIT_PASS,
        }
      : undefined,
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function buildHtml(email: string, otp: string) {
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60_000);
  const expiryString = expiresAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:480px;font-family:Arial,Helvetica,sans-serif;background:#ffffff;border-radius:12px;box-shadow:0 10px 30px rgba(35,25,66,0.12);overflow:hidden;">
      <tr>
        <td style="background:#5b21b6;padding:24px 32px;color:#ffffff;">
          <h1 style="margin:0;font-size:22px;letter-spacing:0.4px;">Probo QA</h1>
          <p style="margin:6px 0 0;font-size:14px;opacity:0.85;">One-Time Passcode</p>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 32px 16px;color:#1f2937;">
          <p style="margin:0 0 16px;font-size:15px;">Hi ${email},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">
            Use the verification code below to finish signing in to <strong>Probo QA</strong>.
            This code expires at <strong>${expiryString}</strong> and can only be used once.
          </p>
          <div style="display:inline-block;padding:16px 32px;border-radius:10px;background:#ede9fe;color:#312e81;font-size:28px;font-weight:700;letter-spacing:6px;text-align:center;">
            ${otp}
          </div>
          <p style="margin:24px 0 0;font-size:13px;opacity:0.65;line-height:1.5;">
            Didn’t request this code? Simply ignore this email — your account remains secure.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;background:#f9fafb;color:#6b7280;font-size:12px;line-height:1.4;">
          <p style="margin:0 0 12px;">Need help? Reach us at <a href="mailto:support@probo.qa" style="color:#5b21b6;text-decoration:none;">support@probo.qa</a>.</p>
          <p style="margin:0;">If you’re having trouble clicking the button, copy and paste this code manually: <span style="color:#111827;font-weight:600;">${otp}</span></p>
        </td>
      </tr>
    </table>
  `;
}

function buildText(otp: string) {
  return [
    'Probo QA – One-Time Passcode',
    '',
    `Your OTP is ${otp}`,
    `Expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    '',
    'Didn’t request it? Ignore this email.',
  ].join('\n');
}

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = generateOtp();

  try {
    await transporter.sendMail({
      from: process.env.MAILPIT_FROM ?? 'login@probo.qa',
      to: email,
      subject: 'Your Probo QA verification code',
      text: buildText(otp),
      html: buildHtml(email, otp),
    });

    saveOtp(email, otp, OTP_TTL_MS);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to send Mailpit email', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
