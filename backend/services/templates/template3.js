// PLANTILLA 3: MODERNO VISUAL
export function getTemplate3(quote, items) {
  const formatDate = (date) => new Date(date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
  const formatCurrency = (amount) => `$${parseFloat(amount).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #2c3e50;
      background: #f5f7fa;
    }
    
    .page { 
      padding: 0;
      background: white;
    }
    
    /* Hero Section con imagen de fondo */
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 50px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .hero:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .hero-left img {
      max-width: 200px;
      filter: brightness(0) invert(1);
    }
    
    .hero-right {
      text-align: right;
    }
    
    .hero-title {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 5px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .hero-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    /* Contenido principal */
    .content {
      padding: 40px;
    }
    
    /* Cards modernos */
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px;
      margin-bottom: 30px;
    }
    
    .card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid #e8e8e8;
      position: relative;
      overflow: hidden;
    }
    
    .card:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 5px;
      height: 100%;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      margin-bottom: 15px;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .card h3 {
      color: #2c3e50;
      font-size: 16px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .card-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px dashed #e8e8e8;
      font-size: 13px;
    }
    
    .card-row:last-child {
      border-bottom: none;
    }
    
    .card-label {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .card-value {
      color: #2c3e50;
      font-weight: 600;
    }
    
    /* Tabla moderna con iconos */
    .table-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 15px 15px 0 0;
      margin-top: 30px;
    }
    
    .table-header h3 {
      font-size: 18px;
      display: flex;
      align-items: center;
    }
    
    .table-header h3:before {
      content: "📦";
      margin-right: 10px;
      font-size: 24px;
    }
    
    .table-container {
      background: white;
      border-radius: 0 0 15px 15px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    thead {
      background: linear-gradient(to right, #f8f9fa, #e9ecef);
    }
    
    th {
      padding: 15px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #495057;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 18px 12px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
    }
    
    tbody tr {
      transition: all 0.3s ease;
    }
    
    tbody tr:hover {
      background: linear-gradient(to right, #f8f9fa, white);
      transform: translateX(5px);
    }
    
    .item-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: bold;
      display: inline-block;
    }
    
    .item-description {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 5px;
    }
    
    .item-specs {
      font-size: 11px;
      color: #7f8c8d;
      padding-left: 15px;
      margin-top: 5px;
      border-left: 3px solid #e8e8e8;
    }
    
    .quantity-badge {
      background: #e8f5e9;
      color: #2e7d32;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: bold;
      display: inline-block;
    }
    
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    
    /* Gráfica visual de totales */
    .totals-visual {
      margin-top: 40px;
      background: white;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .totals-visual h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    .total-bar {
      margin: 15px 0;
      position: relative;
    }
    
    .total-label {
      font-size: 13px;
      color: #7f8c8d;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }
    
    .total-bar-bg {
      height: 40px;
      background: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }
    
    .total-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 15px;
      color: white;
      font-weight: bold;
      font-size: 14px;
      transition: width 1s ease;
    }
    
    .total-final {
      margin-top: 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }
    
    .total-final-label {
      font-size: 20px;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .total-final-amount {
      font-size: 32px;
      font-weight: bold;
    }
    
    /* Timeline de información */
    .timeline {
      margin: 30px 0;
      padding: 30px;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .timeline h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      font-size: 18px;
    }
    
    .timeline-items {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .timeline-item {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      position: relative;
    }
    
    .timeline-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      color: white;
      font-size: 24px;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    .timeline-label {
      font-size: 11px;
      color: #7f8c8d;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .timeline-value {
      font-size: 14px;
      color: #2c3e50;
      font-weight: 600;
    }
    
    /* Notas modernas */
    .notes-modern {
      margin: 30px 0;
      background: linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%);
      border-radius: 15px;
      padding: 25px;
      border-left: 5px solid #ffc107;
      box-shadow: 0 5px 15px rgba(255, 193, 7, 0.2);
    }
    
    .notes-modern h4 {
      color: #856404;
      margin-bottom: 12px;
      font-size: 16px;
      display: flex;
      align-items: center;
    }
    
    .notes-modern h4:before {
      content: "💡";
      margin-right: 10px;
      font-size: 24px;
    }
    
    .notes-modern p {
      color: #856404;
      font-size: 13px;
      line-height: 1.8;
    }
    
    /* Footer moderno */
    .footer-modern {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: white;
      padding: 40px;
      margin-top: 40px;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .footer-column h5 {
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 15px;
      opacity: 0.8;
      letter-spacing: 1px;
    }
    
    .footer-column p {
      font-size: 11px;
      line-height: 1.8;
      opacity: 0.9;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 25px;
      border-top: 1px solid rgba(255,255,255,0.1);
      font-size: 11px;
      opacity: 0.7;
    }
    
    .footer-logo {
      text-align: center;
      margin: 20px 0;
    }
    
    .footer-logo img {
      width: 35px;
      filter: brightness(0) invert(1);
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Hero Section -->
    <div class="hero">
      <div class="hero-content">
        <div class="hero-left">
          <img src="${process.env.LOGO_PRINCIPAL}" alt="Integrational">
        </div>
        <div class="hero-right">
          <div class="hero-title">${quote.folio}</div>
          <div class="hero-subtitle">Cotización Profesional</div>
        </div>
      </div>
    </div>
    
    <!-- Contenido -->
    <div class="content">
      <!-- Cards de información -->
      <div class="cards-grid">
        <div class="card">
          <div class="card-icon">👤</div>
          <h3>Cliente</h3>
          <div class="card-row">
            <span class="card-label">Nombre:</span>
            <span class="card-value">${quote.client_name}</span>
          </div>
          ${quote.client_company ? `
            <div class="card-row">
              <span class="card-label">Empresa:</span>
              <span class="card-value">${quote.client_company}</span>
            </div>
          ` : ''}
          <div class="card-row">
            <span class="card-label">Email:</span>
            <span class="card-value">${quote.client_email}</span>
          </div>
          ${quote.client_phone ? `
            <div class="card-row">
              <span class="card-label">Teléfono:</span>
              <span class="card-value">${quote.client_phone}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="card">
          <div class="card-icon">📋</div>
          <h3>Detalles del Proyecto</h3>
          <div class="card-row">
            <span class="card-label">Fecha:</span>
            <span class="card-value">${formatDate(quote.created_at)}</span>
          </div>
          <div class="card-row">
            <span class="card-label">Vigencia:</span>
            <span class="card-value">${quote.validity_days} días</span>
          </div>
          ${quote.delivery_time ? `
            <div class="card-row">
              <span class="card-label">Tiempo de entrega:</span>
              <span class="card-value">${quote.delivery_time}</span>
            </div>
          ` : ''}
          ${quote.payment_terms ? `
            <div class="card-row">
              <span class="card-label">Forma de pago:</span>
              <span class="card-value">${quote.payment_terms}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Timeline -->
      <div class="timeline">
        <h3>Información Clave</h3>
        <div class="timeline-items">
          <div class="timeline-item">
            <div class="timeline-icon">📅</div>
            <div class="timeline-label">Fecha de Emisión</div>
            <div class="timeline-value">${formatDate(quote.created_at)}</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">⏱️</div>
            <div class="timeline-label">Vigencia</div>
            <div class="timeline-value">${quote.validity_days} días</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">🚚</div>
            <div class="timeline-label">Entrega Estimada</div>
            <div class="timeline-value">${quote.delivery_time || 'Por confirmar'}</div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de productos -->
      <div class="table-header">
        <h3>Productos y Servicios</h3>
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 50px;" class="text-center">#</th>
              <th style="width: 90px;">CÓDIGO</th>
              <th>DESCRIPCIÓN</th>
              <th style="width: 80px;" class="text-center">CANTIDAD</th>
              <th style="width: 110px;" class="text-right">P. UNITARIO</th>
              <th style="width: 120px;" class="text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td class="text-center"><strong>${index + 1}</strong></td>
                <td>${item.code ? `<span class="item-badge">${item.code}</span>` : '-'}</td>
                <td>
                  <div class="item-description">${item.description}</div>
                  ${item.specs ? `<div class="item-specs">📌 ${item.specs}</div>` : ''}
                </td>
                <td class="text-center">
                  <span class="quantity-badge">${item.quantity}</span>
                </td>
                <td class="text-right">${formatCurrency(item.unit_price)}</td>
                <td class="text-right"><strong>${formatCurrency(item.quantity * item.unit_price)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Totales visuales -->
      <div class="totals-visual">
        <h3>💰 Desglose Financiero</h3>
        
        <div class="total-bar">
          <div class="total-label">
            <span>Subtotal</span>
            <span><strong>${formatCurrency(quote.subtotal)}</strong></span>
          </div>
          <div class="total-bar-bg">
            <div class="total-bar-fill" style="width: ${(quote.subtotal / quote.total) * 100}%">
              ${((quote.subtotal / quote.total) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div class="total-bar">
          <div class="total-label">
            <span>IVA (16%)</span>
            <span><strong>${formatCurrency(quote.tax)}</strong></span>
          </div>
          <div class="total-bar-bg">
            <div class="total-bar-fill" style="width: ${(quote.tax / quote.total) * 100}%; background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);">
              ${((quote.tax / quote.total) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div class="total-final">
          <span class="total-final-label">Total a Pagar</span>
          <span class="total-final-amount">${formatCurrency(quote.total)} MXN</span>
        </div>
      </div>
      
      <!-- Notas -->
      ${quote.notes ? `
        <div class="notes-modern">
          <h4>Observaciones</h4>
          <p>${quote.notes}</p>
        </div>
      ` : ''}
    </div>
    
    <!-- Footer -->
    <div class="footer-modern">
      <div class="footer-grid">
        <div class="footer-column">
          <h5>Contacto</h5>
          <p>
            📞 ${process.env.EMPRESA_TELEFONO}<br>
            ✉️ ${process.env.EMPRESA_EMAIL}
          </p>
        </div>
        <div class="footer-column">
          <h5>Web</h5>
          <p>🌐 ${process.env.EMPRESA_WEB}</p>
        </div>
        <div class="footer-column">
          <h5>Ubicación</h5>
          <p>📍 ${process.env.EMPRESA_DIRECCION}</p>
        </div>
        <div class="footer-column">
          <h5>Términos</h5>
          <p>
            • Precios en MXN + IVA<br>
            • Válido ${quote.validity_days} días<br>
            • Anticipo 50%
          </p>
        </div>
      </div>
      
      <div class="footer-logo">
        <img src="${process.env.LOGO_PEQUENO}" alt="Logo">
      </div>
      
      <div class="footer-bottom">
        ${quote.folio} | Documento generado por ${process.env.EMPRESA_NOMBRE} | Página 1 de 1
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
