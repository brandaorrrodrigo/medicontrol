import nodemailer from 'nodemailer'
import { env } from '../config/env'

// Criar transporter do nodemailer
const transporter = nodemailer.createTransporter({
  host: env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(env.SMTP_PORT) || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

// Verificar configuração do transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Erro na configuração do email:', error)
  } else {
    console.log('Servidor de email pronto para enviar mensagens')
  }
})

/**
 * Envia um email de recuperação de senha
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: `"MedicControl" <${env.SMTP_USER}>`,
    to,
    subject: 'Recuperação de Senha - MedicControl',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">MedicControl</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px;">Recuperação de Senha</h2>
                    <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                      Você solicitou a recuperação de senha da sua conta no MedicControl.
                    </p>
                    <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.5;">
                      Clique no botão abaixo para redefinir sua senha:
                    </p>

                    <!-- Button -->
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 0;">
                          <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                            Redefinir Senha
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 20px; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      Ou copie e cole este link no seu navegador:
                    </p>
                    <p style="margin: 0 0 30px; padding: 12px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all; font-size: 12px; color: #4b5563;">
                      ${resetUrl}
                    </p>

                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      <strong>Este link expira em 1 hora.</strong>
                    </p>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">

                    <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                      Se você não solicitou a recuperação de senha, ignore este email. Sua senha permanecerá inalterada.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                    <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px;">
                      © ${new Date().getFullYear()} MedicControl. Todos os direitos reservados.
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      Este é um email automático, por favor não responda.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    text: `
Recuperação de Senha - MedicControl

Você solicitou a recuperação de senha da sua conta no MedicControl.

Para redefinir sua senha, acesse o link abaixo:
${resetUrl}

Este link expira em 1 hora.

Se você não solicitou a recuperação de senha, ignore este email.

© ${new Date().getFullYear()} MedicControl
    `.trim(),
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email de recuperação de senha enviado para: ${to}`)
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw new Error('Falha ao enviar email de recuperação')
  }
}

/**
 * Envia um email genérico
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> {
  const mailOptions = {
    from: `"MedicControl" <${env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email enviado para: ${to}`)
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw new Error('Falha ao enviar email')
  }
}
