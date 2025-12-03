import puppeteer from 'puppeteer';

// Función para formatear moneda en formato mexicano (1,234.56)
function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export async function generatePDF(quote) {
  try {
    const items = JSON.parse(quote.items);
    const date = new Date(quote.created_at).toLocaleDateString('es-MX');
    
    console.log('📄 Generando PDF para:', quote.folio);
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 30px;
      font-size: 11pt;
    }
    .header {
      background: #0066cc;
      color: white;
      padding: 20px;
      margin: -30px -30px 20px -30px;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24pt;
      font-weight: bold;
    }
    .contact {
      text-align: right;
      font-size: 9pt;
    }
    .folio-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px 0;
      border-bottom: 2px solid #0066cc;
    }
    .folio { font-weight: bold; font-size: 12pt; }
    .boxes {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .box {
      flex: 1;
      border: 2px solid #0066cc;
      border-radius: 8px;
      padding: 15px;
    }
    .box-green { border-color: #10b981; }
    .box-title {
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 8px;
      font-size: 10pt;
    }
    .box-green .box-title { color: #10b981; }
    .box-content { font-size: 9pt; line-height: 1.6; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0 10px 0;
    }
    thead {
      background: #0066cc;
      color: white;
    }
    th {
      padding: 12px 8px;
      text-align: left;
      font-size: 9pt;
      font-weight: bold;
    }
    th.right { text-align: right; }
    tbody tr {
      border-bottom: 1px solid #e5e7eb;
    }
    tbody tr:nth-child(even) {
      background: #f9fafb;
    }
    td {
      padding: 8px 8px;
      font-size: 9pt;
    }
    td.right { text-align: right; }
    .code { color: #6b7280; font-size: 8pt; }
    .specs { color: #6b7280; font-size: 7.5pt; margin-top: 2px; }
    .totals {
      margin-top: 10px;
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      border: 1px solid #e5e7eb;
      margin-bottom: -1px;
    }
    .total-row.subtotal { background: #f9fafb; }
    .total-row.tax { background: #f9fafb; }
    .total-row.final {
      background: #0066cc;
      color: white;
      font-weight: bold;
      font-size: 12pt;
      padding: 10px 12px;
    }
    .notes {
      margin: 15px 0 10px 0;
      padding: 12px;
      background: #f0f9ff;
      border-left: 4px solid #0066cc;
      border-radius: 4px;
    }
    .notes-title {
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 6px;
      font-size: 9pt;
    }
    .notes-content {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.4;
    }
    .bank-info {
      margin-top: 15px;
      padding: 12px 15px;
      background: #f8fafc;
      border: 2px solid #3b82f6;
      border-radius: 8px;
    }
    .bank-title {
      font-size: 9pt;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 8px;
      text-align: center;
    }
    .bank-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      font-size: 8pt;
      margin-bottom: 8px;
    }
    .bank-item {
      text-align: center;
    }
    .bank-item.full {
      grid-column: span 3;
    }
    .bank-label {
      font-size: 7pt;
      color: #64748b;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .bank-value {
      font-weight: bold;
      color: #1e293b;
      font-size: 8.5pt;
    }
    .bank-instructions {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 7pt;
      color: #475569;
      line-height: 1.4;
    }
    .bank-instructions strong {
      color: #1e293b;
    }
    .footer {
      text-align: center;
      font-size: 7pt;
      color: #9ca3af;
      margin-top: 10px;
    }
    @page {
      margin: 0;
    }
    @media print {
      body {
        padding: 30px;
      }
    }
    .page-break {
      page-break-before: always;
      position: relative;
      min-height: 100vh;
    }
    .footer-page2 {
      text-align: center;
      font-size: 7pt;
      color: #9ca3af;
      margin-top: 50px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <div class="logo">integrational 3</div>
      <div class="contact">
        administracion@integrational3.com.mx<br>
        Tel: (449) 356-6356<br>
        www.integrational3.com.mx
      </div>
    </div>
  </div>

  <div class="folio-section">
    <div class="folio">FOLIO: ${quote.folio}</div>
    <div>FECHA: ${date}</div>
  </div>

  <div class="boxes">
    <div class="box">
      <div class="box-title">CLIENTE</div>
      <div class="box-content">
        <strong>${quote.client_name}</strong><br>
        ${quote.client_company ? quote.client_company + '<br>' : ''}
        ${quote.client_email}<br>
        ${quote.client_phone || ''}
      </div>
    </div>
    <div class="box box-green">
      <div class="box-title">CONDICIONES</div>
      <div class="box-content">
        Vigencia: ${quote.validity_days} días<br>
        ${quote.payment_terms ? 'Pago: ' + quote.payment_terms + '<br>' : ''}
        ${quote.delivery_time ? 'Entrega: ' + quote.delivery_time : ''}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">CANT</th>
        <th style="width: 80px;">CÓDIGO</th>
        <th>DESCRIPCIÓN</th>
        <th class="right" style="width: 100px;">P. UNIT</th>
        <th class="right" style="width: 100px;">TOTAL</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.quantity}</td>
          <td><span class="code">${item.code || ''}</span></td>
          <td>
            <strong>${item.description}</strong>
            ${item.specs ? '<div class="specs">' + item.specs + '</div>' : ''}
          </td>
          <td class="right">$${formatCurrency(item.unit_price)}</td>
          <td class="right"><strong>$${formatCurrency(item.quantity * item.unit_price)}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row subtotal">
      <span>Subtotal:</span>
      <span>$${formatCurrency(quote.subtotal)}</span>
    </div>
    <div class="total-row tax">
      <span>IVA (16%):</span>
      <span>$${formatCurrency(quote.tax)}</span>
    </div>
    <div class="total-row final">
      <span>TOTAL:</span>
      <span>$${formatCurrency(quote.total)}</span>
    </div>
  </div>

  ${quote.notes ? `
  <div class="notes">
    <div class="notes-title">NOTAS:</div>
    <div class="notes-content">${quote.notes}</div>
  </div>
  ` : ''}

  <div class="page-break">
    <div class="folio-section" style="margin-top: 0;">
      <div class="folio">INFORMACIÓN DE PAGO</div>
      <div>FOLIO: ${quote.folio}</div>
    </div>

    <div class="bank-info">
      <div class="bank-title">Información Bancaria</div>
      <div class="bank-grid">
        <div class="bank-item full">
          <div class="bank-label">Beneficiario</div>
          <div class="bank-value">Edgar Arturo Guerra Zermeño</div>
        </div>
        <div class="bank-item">
          <div class="bank-label">Banco</div>
          <div class="bank-value">BBVA</div>
        </div>
        <div class="bank-item">
          <div class="bank-label">Cuenta</div>
          <div class="bank-value">274 864 8042</div>
        </div>
        <div class="bank-item">
          <div class="bank-label">CLABE</div>
          <div class="bank-value">012 010 02748648042 5</div>
        </div>
      </div>
      <div class="bank-instructions">
        <strong>Instrucciones de pago:</strong><br>
        • Una vez realizada la transferencia, favor de enviar el comprobante al correo: <strong>administracion@integrational3.com.mx</strong><br>
        • Incluir en la referencia el número de folio: <strong>${quote.folio}</strong><br>
        • El tiempo de procesamiento de pago es de 24 a 48 horas hábiles<br>
        • Una vez confirmado el pago, se procederá con la entrega según los términos establecidos
      </div>
    </div>
  </div>

  <div class="footer">
    ${quote.folio} • Gracias por su preferencia
  </div>
</body>
</html>
  `;

  console.log('🌐 Iniciando navegador...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  console.log('📃 Generando página...');
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  console.log('🖨️  Generando PDF...');
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });
  
  console.log('✅ PDF generado:', pdfBuffer.length, 'bytes');
  await browser.close();
  
  return pdfBuffer;
  } catch (error) {
    console.error('❌ Error generando PDF:', error.message);
    console.error(error.stack);
    throw error;
  }
}
