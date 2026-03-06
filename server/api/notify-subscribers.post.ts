import nodemailer from 'nodemailer'

const CONTENT_LABELS: Record<string, string> = {
  dergi: 'Yeni Dergi',
  blog: 'Yeni Blog Yazısı',
  calisma: 'Yeni Çalışma',
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { type, title, emails } = body as { type: string; title: string; emails: string[] }

  if (!type || !title || !Array.isArray(emails) || emails.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'type, title ve emails gerekli',
    })
  }

  if (!config.mail || !config.mailPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Mail ayarları eksik.',
    })
  }

  const label = CONTENT_LABELS[type] || type
  const siteUrl = (config.public.siteUrl as string) || 'https://semanur-tufan.vercel.app'

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mail,
      pass: config.mailPassword,
    },
  })

  const html = `
  <div style="background:#f4f6f8;padding:30px;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.08)">
      <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:20px;color:white">
        <h2 style="margin:0;font-size:22px;">📬 ${label} - Gökgerdan Dergisi</h2>
      </div>
      <div style="padding:24px;color:#111827">
        <p style="margin:0 0 16px;font-size:16px;">Merhaba,</p>
        <p style="margin:0 0 16px;line-height:1.6;">
          Gökgerdan Dergisi'nde yeni bir içerik yayınlandı:
        </p>
        <p style="margin:0 0 20px;font-size:18px;font-weight:600;color:#16a34a;">${title}</p>
        <a href="${siteUrl}" style="display:inline-block;background:#16a34a;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;">
          İncele
        </a>
      </div>
      <div style="background:#f3f4f6;padding:12px;text-align:center;font-size:12px;color:#6b7280">
        Bu mail abonelik bildirimi olarak gönderilmiştir.
      </div>
    </div>
  </div>
  `

  try {
    for (const email of emails) {
      if (!email || typeof email !== 'string') continue
      await transporter.sendMail({
        from: `"Gökgerdan Dergisi" <${config.mail}>`,
        to: email.trim(),
        subject: `📬 ${label}: ${title}`,
        html,
      })
    }
    return { ok: true, sent: emails.length }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[notify-subscribers] Hata:', msg)
    throw createError({
      statusCode: 500,
      statusMessage: msg.includes('Invalid login') || msg.includes('authentication')
        ? 'Gmail giriş hatası.'
        : `Mail gönderilemedi: ${msg}`,
    })
  }
})
