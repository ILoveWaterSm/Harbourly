/**
 * Email provider interface with mock for development.
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>
}

class MockEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    console.log('[MockEmail] Sending email:', {
      to: options.to,
      subject: options.subject,
      from: options.from ?? process.env.EMAIL_FROM,
    })
  }
}

class ResendEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: options.from ?? process.env.EMAIL_FROM ?? 'noreply@habourly.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
  }
}

export const emailProvider: EmailProvider =
  process.env.RESEND_API_KEY
    ? new ResendEmailProvider()
    : new MockEmailProvider()

export async function sendBookingConfirmation(
  to: string,
  details: { coachName: string; date: string; serviceName: string }
): Promise<void> {
  await emailProvider.send({
    to,
    subject: 'Your Habourly session is confirmed!',
    html: `
      <h1>Session Confirmed</h1>
      <p>Your session with <strong>${details.coachName}</strong> has been confirmed.</p>
      <p><strong>Service:</strong> ${details.serviceName}</p>
      <p><strong>Date:</strong> ${details.date}</p>
      <p>Visit your dashboard to view full details.</p>
    `,
  })
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await emailProvider.send({
    to,
    subject: 'Welcome to Habourly!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>We're excited to have you on Habourly – the platform that connects you with verified gaming coaches.</p>
      <p>Browse coaches and book your first session today.</p>
    `,
  })
}
