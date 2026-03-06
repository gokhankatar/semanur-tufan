import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, email, msg } = body

  if (!name || !email || !msg) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Eksik alan',
    })
  }

  if (!config.mail || !config.mailPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Mail ayarları eksik. .env dosyasında MAIL_USER ve MAIL_PASSWORD tanımlayın.',
    })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.mail,
      pass: config.mailPassword,
    },
  })

  try {
    await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: config.mail,
    replyTo: email,
    subject: '📩 Yeni İletişim Mesajı',
    html: `
  <div style="background:#f4f6f8;padding:30px;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,.08)">
      
      <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:20px;color:white">
        <h2 style="margin:0;font-size:22px;">📬 Yeni İletişim Mesajı (Gökgerdan Dergisi)</h2>
      </div>

      <div style="padding:24px;color:#111827">
        <p style="margin:0 0 12px;"><strong>👤 İsim:</strong> ${name}</p>
        <p style="margin:0 0 12px;"><strong>📧 Email:</strong> ${email}</p>

        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>

        <p style="margin:0 0 8px;font-weight:bold;">📝 Mesaj:</p>
        <div style="background:#f9fafb;padding:16px;border-radius:8px;line-height:1.6;">
          ${String(msg).replace(/\n/g, '<br/>')}
        </div>
      </div>

      <div style="background:#f3f4f6;padding:12px;text-align:center;font-size:12px;color:#6b7280">
        Bu mail iletişim formu üzerinden gönderildi.
      </div>

    </div>
  </div>
  `,
    })

    return { ok: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[contact] Mail gönderim hatası:', msg)
    throw createError({
      statusCode: 500,
      statusMessage:
        msg.includes('Invalid login') || msg.includes('authentication')
          ? 'Gmail giriş hatası. Uygulama şifresi kullanın (Google Hesap > Güvenlik > Uygulama Şifreleri).'
          : `Mail gönderilemedi: ${msg}`,
    })
  }
})
