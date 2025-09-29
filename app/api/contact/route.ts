import { NextRequest, NextResponse } from 'next/server'
const nodemailer = require('nodemailer')

export async function POST(request: NextRequest) {
  try {
    console.log('=== INICIO API CONTACT ===')
    const body = await request.json()
    console.log('Body recibido:', body)
    
    const { name, email, phone, company, service, message } = body

    // Validación básica
    if (!name || !email || !phone || !message) {
      console.log('Error de validación: campos faltantes')
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Error de validación: email inválido')
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    console.log('Variables de entorno:')
    console.log('GMAIL_USER:', process.env.GMAIL_USER)
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET')
    console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL)

    // Verificar que las variables de entorno estén presentes
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log('Error: Variables de entorno faltantes')
      return NextResponse.json(
        { error: 'Configuración de email no disponible' },
        { status: 500 }
      )
    }

    // Configurar transporter de Nodemailer con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '') // Remover espacios
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    console.log('Transporter creado correctamente')

    // Configurar el contenido del email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nuevo mensaje de ${name} - ${service || 'Consulta general'}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Contacto - hardcoded.space</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafafa; color: #0a0a0a;">
          <div style="max-width: 600px; margin: 0 auto; padding: 24px;">

            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #0a0a0a; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; letter-spacing: -0.02em;">
                hardcoded.space
              </h1>
              <p style="color: #737373; margin: 0; font-size: 16px; font-weight: 400;">
                Nuevo mensaje de contacto
              </p>
            </div>

            <!-- Main Card -->
            <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">

              <!-- Contact Information -->
              <div style="padding: 24px; border-bottom: 1px solid #e4e4e7;">
                <h2 style="color: #0a0a0a; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; letter-spacing: -0.01em;">
                  Información del cliente
                </h2>

                <div style="space-y: 16px;">

                  <!-- Name -->
                  <div style="display: flex; align-items: center; padding: 12px 0;">
                    <div style="min-width: 0; flex: 1;">
                      <div style="flex: none; width: 80px; color: #737373; font-size: 14px; font-weight: 500; display: inline-block;">Nombre</div>
                      <span style="color: #0a0a0a; font-size: 14px; font-weight: 500;">${name}</span>
                    </div>
                  </div>

                  <!-- Email -->
                  <div style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid #f4f4f5;">
                    <div style="min-width: 0; flex: 1;">
                      <div style="flex: none; width: 80px; color: #737373; font-size: 14px; font-weight: 500; display: inline-block;">Email</div>
                      <a href="mailto:${email}" style="color: #0a0a0a; font-size: 14px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px;">${email}</a>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid #f4f4f5;">
                    <div style="min-width: 0; flex: 1;">
                      <div style="flex: none; width: 80px; color: #737373; font-size: 14px; font-weight: 500; display: inline-block;">Teléfono</div>
                      <a href="tel:${phone}" style="color: #0a0a0a; font-size: 14px; font-weight: 500; text-decoration: underline; text-underline-offset: 4px;">${phone}</a>
                    </div>
                  </div>

                  ${company ? `
                  <!-- Company -->
                  <div style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid #f4f4f5;">
                    <div style="min-width: 0; flex: 1;">
                      <div style="flex: none; width: 80px; color: #737373; font-size: 14px; font-weight: 500; display: inline-block;">Empresa</div>
                      <span style="color: #0a0a0a; font-size: 14px; font-weight: 500;">${company}</span>
                    </div>
                  </div>
                  ` : ''}

                  ${service ? `
                  <!-- Service -->
                  <div style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid #f4f4f5;">
                    <div style="flex: none; width: 80px; color: #737373; font-size: 14px; font-weight: 500;">Servicio</div>
                    <span style="display: inline-block; ${service.includes('Tienda Online') ? 'background-color: #16a34a; color: #ffffff;' : 'background-color: #0a0a0a; color: #fafafa;'} font-size: 12px; font-weight: 500; padding: 4px 8px; border-radius: 6px;">
                      ${service.includes('Presencia Digital') ? 'Presencia Digital' :
                        service.includes('Tienda Online') ? 'Tienda Online' :
                        service}
                    </span>
                  </div>
                  ` : ''}

                </div>
              </div>

              <!-- Message -->
              <div style="padding: 24px;">
                <h3 style="color: #0a0a0a; font-size: 18px; font-weight: 600; margin: 0 0 16px 0; letter-spacing: -0.01em;">
                  Mensaje
                </h3>

                <div style="background-color: #f9fafb; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px;">
                  <p style="color: #0a0a0a; line-height: 1.6; margin: 0; font-size: 14px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 32px 0; border-top: 1px solid #e4e4e7; margin-top: 32px;">
              <p style="color: #737373; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">
                Enviado desde <strong style="color: #0a0a0a;">hardcoded.space</strong>
              </p>
              <p style="color: #a3a3a3; margin: 0; font-size: 12px;">
                ${new Date().toLocaleString('es-MX', {
                  timeZone: 'America/Mexico_City',
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    }

    console.log('Intentando enviar email...')
    
    // Verificar conexión antes de enviar
    await transporter.verify()
    console.log('Conexión SMTP verificada correctamente')
    
    // Enviar el email
    const result = await transporter.sendMail(mailOptions)
    console.log('Email enviado exitosamente:', result.messageId)

    return NextResponse.json({ 
      success: true,
      message: '¡Mensaje enviado exitosamente! Te contactaremos pronto.' 
    })

  } catch (error) {
    console.error('Error completo al enviar email:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' 
      },
      { status: 500 }
    )
  }
}