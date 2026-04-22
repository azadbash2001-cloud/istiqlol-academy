// app/api/send-email/route.js
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json()
    
    const data = await resend.emails.send({
      from: 'Istiqlol Academy <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    })
    
    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error: error.message })
  }
}