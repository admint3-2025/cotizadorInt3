// PLANTILLA 2: DETALLADO PROFESIONAL (RECOMENDADO)
export function getTemplate2(quote, items) {
  const formatDate = (date) => new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatCurrency = (amount) => `$${parseFloat(amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c3e50; line-height: 1.6; }
    .page { padding: 35px; }
    
    /* Header con gradiente */
    .header { 
      background: linear-gradient(135deg, #0066cc 0%, #003366 100%);
      color: white;
      padding: 25px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 10px;
      margin-bottom: 25px;
    }
    .header-left img { max-width: 180px; }
    .header-right { text-align: right; font-size: 11px; line-height: 1.8; }
    .header-right strong { display: block; font-size: 14px; margin-bottom: 5px; }
    
    /* Título principal */
    .main-title { 
      background: linear-gradient(90deg, #4d94ff 0%, #0066cc 100%);
      color: white;
      padding: 18px 25px;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0,102,204,0.2);
    }
    
    /* Sección de proyecto */
    .project-info {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin: 25px 0;
    }
    
    .info-card {
      background: white;
      border: 2px solid #e8f4fd;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .info-card h3 {
      color: #0066cc;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e8f4fd;
      display: flex;
      align-items: center;
    }
    
    .info-card h3:before {
      content: "▶";
      margin-right: 10px;
      color: #4d94ff;
    }
    
    .info-row {
      display: flex;
      padding: 8px 0;
      font-size: 12px;
      border-bottom: 1px dashed #e8f4fd;
    }
    
    .info-row:last-child { border-bottom: none; }
    
    .info-label {
      font-weight: 600;
      color: #666;
      width: 120px;
      flex-shrink: 0;
    }
    
    .info-value {
      color: #2c3e50;
      flex-grow: 1;
    }
    
    /* Tabla detallada */
    .table-container {
      margin: 25px 0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    
    thead {
      background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
      color: white;
    }
    
    th {
      padding: 14px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 14px 12px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
    }
    
    tbody tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tbody tr:hover {
      background: #e8f4fd;
      transition: background 0.2s;
    }
    
    .item-code {
      color: #666;
      font-size: 10px;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      display: inline-block;
      margin-top: 3px;
    }
    
    .item-specs {
      color: #666;
      font-size: 10px;
      margin-top: 5px;
      padding-left: 15px;
      border-left: 2px solid #4d94ff;
    }
    
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    /* Resumen financiero mejorado */
    .financial-summary {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 350px;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .summary-header {
      background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
      color: white;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      font-size: 13px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .summary-row.highlight {
      background: #f8f9fa;
      font-weight: 600;
    }
    
    .summary-row.total {
      background: linear-gradient(135deg, #28a745 0%, #218838 100%);
      color: white;
      font-size: 18px;
      font-weight: bold;
      padding: 16px 20px;
    }
    
    /* Condiciones comerciales */
    .commercial-terms {
      margin-top: 30px;
      background: #f8f9fa;
      border-left: 4px solid #0066cc;
      padding: 20px;
      border-radius: 0 8px 8px 0;
    }
    
    .commercial-terms h4 {
      color: #0066cc;
      font-size: 13px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    
    .commercial-terms ul {
      list-style: none;
      padding: 0;
    }
    
    .commercial-terms li {
      padding: 6px 0;
      font-size: 11px;
      padding-left: 20px;
      position: relative;
    }
    
    .commercial-terms li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #28a745;
      font-weight: bold;
    }
    
    /* Notas */
    .notes-section {
      margin-top: 25px;
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      border-left: 4px solid #ffc107;
      padding: 18px;
      border-radius: 0 8px 8px 0;
    }
    
    .notes-section h4 {
      color: #856404;
      font-size: 13px;
      margin-bottom: 10px;
    }
    
    .notes-section p {
      font-size: 11px;
      color: #856404;
      line-height: 1.6;
    }
    
    /* Footer profesional */
    .footer {
      margin-top: 40px;
      padding-top: 25px;
      border-top: 3px solid #e8f4fd;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .footer-column h5 {
      color: #0066cc;
      font-size: 11px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    
    .footer-column p {
      font-size: 10px;
      color: #666;
      line-height: 1.8;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      font-size: 10px;
      color: #999;
    }
    
    .footer-logo {
      text-align: center;
      margin: 15px 0;
    }
    
    .footer-logo img {
      width: 30px;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <img src="${process.env.LOGO_PRINCIPAL}" alt="Integrational">
      </div>
      <div class="header-right">
        <strong>${process.env.EMPRESA_NOMBRE}</strong>
        ${process.env.EMPRESA_DIRECCION}<br>
        📞 ${process.env.EMPRESA_TELEFONO}<br>
        ✉️ ${process.env.EMPRESA_EMAIL}<br>
        🌐 ${process.env.EMPRESA_WEB}
      </div>
    </div>
    
    <!-- Título -->
    <div class="main-title">COTIZACIÓN ${quote.folio}</div>
    
    <!-- Información del proyecto -->
    <div class="project-info">
      <div class="info-card">
        <h3>Información del Cliente</h3>
        <div class="info-row">
          <span class="info-label">Cliente:</span>
          <span class="info-value">${quote.client_name}</span>
        </div>
        ${quote.client_company ? `
          <div class="info-row">
            <span class="info-label">Empresa:</span>
            <span class="info-value">${quote.client_company}</span>
          </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${quote.client_email}</span>
        </div>
        ${quote.client_phone ? `
          <div class="info-row">
            <span class="info-label">Teléfono:</span>
            <span class="info-value">${quote.client_phone}</span>
          </div>
        ` : ''}
        ${quote.client_address ? `
          <div class="info-row">
            <span class="info-label">Dirección:</span>
            <span class="info-value">${quote.client_address}</span>
          </div>
        ` : ''}
      </div>
      
      <div class="info-card">
        <h3>Detalles</h3>
        <div class="info-row">
          <span class="info-label">Fecha:</span>
          <span class="info-value">${formatDate(quote.created_at)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Vigencia:</span>
          <span class="info-value">${quote.validity_days} días</span>
        </div>
        ${quote.delivery_time ? `
          <div class="info-row">
            <span class="info-label">Entrega:</span>
            <span class="info-value">${quote.delivery_time}</span>
          </div>
        ` : ''}
        ${quote.payment_terms ? `
          <div class="info-row">
            <span class="info-label">Forma de pago:</span>
            <span class="info-value">${quote.payment_terms}</span>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Tabla de productos -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 50px;" class="text-center">#</th>
            <th style="width: 80px;">CÓDIGO</th>
            <th>DESCRIPCIÓN / ESPECIFICACIONES</th>
            <th style="width: 70px;" class="text-center">CANT.</th>
            <th style="width: 100px;" class="text-right">P. UNIT.</th>
            <th style="width: 110px;" class="text-right">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => `
            <tr>
              <td class="text-center"><strong>${index + 1}</strong></td>
              <td>${item.code ? `<span class="item-code">${item.code}</span>` : '-'}</td>
              <td>
                <strong>${item.description}</strong>
                ${item.specs ? `<div class="item-specs">${item.specs}</div>` : ''}
              </td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">${formatCurrency(item.unit_price)}</td>
              <td class="text-right"><strong>${formatCurrency(item.quantity * item.unit_price)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Resumen financiero -->
    <div class="financial-summary">
      <div class="summary-box">
        <div class="summary-header">Resumen Financiero</div>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(quote.subtotal)}</span>
        </div>
        <div class="summary-row highlight">
          <span>IVA (16%):</span>
          <span>${formatCurrency(quote.tax)}</span>
        </div>
        <div class="summary-row total">
          <span>TOTAL:</span>
          <span>${formatCurrency(quote.total)} MXN</span>
        </div>
      </div>
    </div>
    
    <!-- Notas -->
    ${quote.notes ? `
      <div class="notes-section">
        <h4>📌 Observaciones Importantes</h4>
        <p>${quote.notes}</p>
      </div>
    ` : ''}
    
    <!-- Condiciones comerciales -->
    <div class="commercial-terms">
      <h4>Condiciones Comerciales</h4>
      <ul>
        <li>Precios expresados en pesos mexicanos (MXN) más IVA</li>
        <li>Cotización válida por ${quote.validity_days} días naturales</li>
        <li>Se requiere anticipo del 50% para iniciar proyecto</li>
        <li>Tiempos de entrega sujetos a confirmación y disponibilidad</li>
        <li>Instalación y configuración incluida según especificaciones</li>
        <li>Garantía de fábrica vigente en todos los equipos</li>
      </ul>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-grid">
        <div class="footer-column">
          <h5>Contacto</h5>
          <p>
            Teléfono: ${process.env.EMPRESA_TELEFONO}<br>
            Email: ${process.env.EMPRESA_EMAIL}<br>
            Web: ${process.env.EMPRESA_WEB}
          </p>
        </div>
        <div class="footer-column">
          <h5>Ubicación</h5>
          <p>${process.env.EMPRESA_DIRECCION}</p>
        </div>
        <div class="footer-column">
          <h5>Horario de Atención</h5>
          <p>
            Lunes a Viernes<br>
            9:00 AM - 6:00 PM
          </p>
        </div>
      </div>
      
      <div class="footer-logo">
        <img src="${process.env.LOGO_PEQUENO}" alt="Logo">
      </div>
      
      <div class="footer-bottom">
        Documento generado electrónicamente | ${quote.folio} | Página 1 de 1
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
