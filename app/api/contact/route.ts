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
      subject: `Nuevo contacto de ${name} - ${service || 'Consulta general'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> <a href="tel:${phone}">${phone}</a></p>
            ${company ? `<p style="margin: 10px 0;"><strong>Empresa:</strong> ${company}</p>` : ''}
            ${service ? `<p style="margin: 10px 0;"><strong>Servicio:</strong> ${service}</p>` : ''}
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Mensaje:</h3>
            <p style="background-color: #fff; padding: 15px; border-left: 4px solid #4f46e5; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.</p>
            <p>Fecha: ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</p>
          </div>
        </div>
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