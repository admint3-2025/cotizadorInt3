// PLANTILLA 1: EJECUTIVO MINIMALISTA
export function getTemplate1(quote, items) {
  const formatDate = (date) => new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatCurrency = (amount) => `$${parseFloat(amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
    .page { padding: 40px; max-width: 800px; margin: 0 auto; }
    
    /* Header */
    .header { text-align: center; padding: 30px 0; border-bottom: 3px solid #0066cc; margin-bottom: 30px; }
    .header img { max-width: 250px; margin-bottom: 15px; }
    .header .company-info { font-size: 11px; color: #666; margin-top: 10px; }
    
    /* Título */
    .title { background: #0066cc; color: white; padding: 15px 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 30px 0; border-radius: 5px; }
    
    /* Info boxes */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #0066cc; }
    .info-box h3 { color: #0066cc; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; }
    .info-box p { font-size: 12px; margin: 5px 0; }
    .info-label { color: #666; font-weight: 600; }
    
    /* Tabla */
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    thead { background: #003366; color: white; }
    th { padding: 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid #e0e0e0; font-size: 12px; }
    tbody tr:hover { background: #f8f9fa; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    /* Totales */
    .totals { margin-top: 30px; float: right; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 10px 20px; font-size: 13px; }
    .totals-row.subtotal { background: #f8f9fa; }
    .totals-row.tax { background: #e9ecef; }
    .totals-row.total { background: #0066cc; color: white; font-weight: bold; font-size: 16px; margin-top: 5px; border-radius: 5px; }
    
    /* Footer */
    .footer { clear: both; margin-top: 60px; padding-top: 20px; border-top: 2px solid #e0e0e0; font-size: 11px; color: #666; }
    .footer-section { margin: 15px 0; }
    .footer-section h4 { color: #0066cc; font-size: 12px; margin-bottom: 8px; }
    
    .notes { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107; }
    .notes h4 { color: #856404; margin-bottom: 8px; }
    .notes p { font-size: 11px; color: #856404; }
    
    .page-number { text-align: center; margin-top: 30px; font-size: 10px; color: #999; }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <img src="${process.env.LOGO_PRINCIPAL}" alt="Integrational">
      <div class="company-info">
        ${process.env.EMPRESA_DIRECCION} | Tel: ${process.env.EMPRESA_TELEFONO}<br>
        ${process.env.EMPRESA_EMAIL} | ${process.env.EMPRESA_WEB}
      </div>
    </div>
    
    <!-- Título -->
    <div class="title">COTIZACIÓN ${quote.folio}</div>
    
    <!-- Información -->
    <div class="info-grid">
      <div class="info-box">
        <h3>Datos del Cliente</h3>
        <p><span class="info-label">Cliente:</span> ${quote.client_name}</p>
        ${quote.client_company ? `<p><span class="info-label">Empresa:</span> ${quote.client_company}</p>` : ''}
        <p><span class="info-label">Email:</span> ${quote.client_email}</p>
        ${quote.client_phone ? `<p><span class="info-label">Teléfono:</span> ${quote.client_phone}</p>` : ''}
      </div>
      
      <div class="info-box">
        <h3>Información de Cotización</h3>
        <p><span class="info-label">Fecha:</span> ${formatDate(quote.created_at)}</p>
        <p><span class="info-label">Vigencia:</span> ${quote.validity_days} días</p>
        ${quote.delivery_time ? `<p><span class="info-label">Entrega:</span> ${quote.delivery_time}</p>` : ''}
        ${quote.payment_terms ? `<p><span class="info-label">Pago:</span> ${quote.payment_terms}</p>` : ''}
      </div>
    </div>
    
    <!-- Tabla de productos -->
    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 60px;">CANT.</th>
          <th>DESCRIPCIÓN</th>
          <th class="text-right" style="width: 120px;">P. UNITARIO</th>
          <th class="text-right" style="width: 120px;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td class="text-center">${item.quantity}</td>
            <td>
              <strong>${item.description}</strong>
              ${item.code ? `<br><small style="color: #666;">Código: ${item.code}</small>` : ''}
              ${item.specs ? `<br><small style="color: #666;">${item.specs}</small>` : ''}
            </td>
            <td class="text-right">${formatCurrency(item.unit_price)}</td>
            <td class="text-right"><strong>${formatCurrency(item.quantity * item.unit_price)}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Totales -->
    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal:</span>
        <span>${formatCurrency(quote.subtotal)}</span>
      </div>
      <div class="totals-row tax">
        <span>IVA (16%):</span>
        <span>${formatCurrency(quote.tax)}</span>
      </div>
      <div class="totals-row total">
        <span>TOTAL:</span>
        <span>${formatCurrency(quote.total)}</span>
      </div>
    </div>
    
    <div style="clear: both;"></div>
    
    <!-- Notas -->
    ${quote.notes ? `
      <div class="notes">
        <h4>📌 Notas Importantes</h4>
        <p>${quote.notes}</p>
      </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-section">
        <h4>Términos y Condiciones</h4>
        <p>• Precios en pesos mexicanos (MXN) más IVA.<br>
        • Cotización válida por ${quote.validity_days} días a partir de la fecha de emisión.<br>
        • Los tiempos de entrega pueden variar según disponibilidad de inventario.<br>
        • Se requiere anticipo del 50% para iniciar el proyecto.</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <img src="${process.env.LOGO_PEQUENO}" alt="Logo" style="width: 25px; opacity: 0.5;">
      </div>
    </div>
    
    <div class="page-number">Página 1 de 1 | ${quote.folio}</div>
  </div>
</body>
</html>
  `;
}
