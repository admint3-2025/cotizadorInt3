import nodemailer from 'nodemailer';
import dns from 'dns';

// Configurar DNS de Google para resolver correctamente
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  dnsTimeout: 10000,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  debug: true,
  logger: true
});

// Verificar conexión al iniciar (sin detener el servidor si falla)
transporter.verify(function(error, success) {
  if (error) {
    console.log('⚠️ Advertencia: No se pudo conectar al servidor SMTP');
    console.log('📧 El sistema funcionará sin envío automático de emails');
    console.log('💡 Podrás descargar los PDFs y enviarlos manualmente');
  } else {
    console.log('✅ Servidor SMTP listo para enviar correos');
  }
});

export async function sendQuoteEmail(quote, pdfBuffer) {
  const items = JSON.parse(quote.items);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #0066cc 0%, #003366 100%); color: white; border-radius: 10px 10px 0 0; }
        .logo { max-width: 200px; margin-bottom: 10px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        h2 { color: #0066cc; margin-top: 0; }
        .highlight { color: #0066cc; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${process.env.LOGO_PRINCIPAL}" alt="Integrational" class="logo">
          <h1>Cotización ${quote.folio}</h1>
        </div>
        
        <div class="content">
          <p>Estimado/a <strong>${quote.client_name}</strong>,</p>
          
          <p>Agradecemos su interés en nuestros servicios. Adjunto encontrará la cotización solicitada con el detalle de productos y servicios.</p>
          
          <div class="info-box">
            <h2>Resumen de Cotización</h2>
            <p><span class="highlight">Folio:</span> ${quote.folio}</p>
            <p><span class="highlight">Empresa:</span> ${quote.client_company || 'N/A'}</p>
            <p><span class="highlight">Total:</span> $${quote.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</p>
            <p><span class="highlight">Vigencia:</span> ${quote.validity_days} días</p>
          </div>
          
          <p>El documento PDF adjunto contiene:</p>
          <ul>
            <li>Detalle completo de productos/servicios</li>
            <li>Precios y especificaciones técnicas</li>
            <li>Términos y condiciones</li>
            <li>Información de contacto</li>
          </ul>
          
          <p>Quedamos a sus órdenes para cualquier aclaración o ajuste que requiera.</p>
          
          <p><strong>Atentamente,</strong><br>
          Equipo ${process.env.EMPRESA_NOMBRE}</p>
        </div>
        
        <div class="footer">
          <p>${process.env.EMPRESA_NOMBRE}<br>
          ${process.env.EMPRESA_DIRECCION}<br>
          Tel: ${process.env.EMPRESA_TELEFONO}<br>
          Email: ${process.env.EMPRESA_EMAIL}<br>
          Web: ${process.env.EMPRESA_WEB}</p>
          <img src="${process.env.LOGO_PEQUENO}" alt="Logo" style="width: 25px; margin-top: 10px;">
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `${process.env.EMPRESA_NOMBRE} <${process.env.SMTP_USER}>`,
    to: quote.client_email,
    subject: `Cotización ${quote.folio} - ${process.env.EMPRESA_NOMBRE}`,
    html: htmlContent,
    attachments: [
      {
        filename: `${quote.folio}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
}
