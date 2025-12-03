import PDFDocument from 'pdfkit';

function formatCurrency(amount) {
  return '$' + parseFloat(amount).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export async function generatePDF(quote) {
  return new Promise((resolve, reject) => {
    try {
      const items = JSON.parse(quote.items);
      const date = new Date(quote.created_at).toLocaleDateString('es-MX');
      
      const doc = new PDFDocument({ margin: 50, size: 'LETTER' });
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header azul con logo
      doc.fillColor('#0066cc')
         .rect(0, 0, doc.page.width, 120)
         .fill();
      
      doc.fillColor('white')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('INTEGRATIONAL 3', 50, 35);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text('administracion@integrational3.com.mx', 50, 70)
         .text('Tel: (449) 356 - 6356', 50, 85);

      // Caja de folio (derecha)
      doc.fillColor('#f8f9fa')
         .rect(400, 140, 150, 80)
         .fill()
         .strokeColor('#dee2e6')
         .rect(400, 140, 150, 80)
         .stroke();
      
      doc.fillColor('#0066cc')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('COTIZACIÓN', 410, 150);
      
      doc.fillColor('black')
         .fontSize(14)
         .text(quote.folio, 410, 170);
      
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#666')
         .text(`Fecha: ${date}`, 410, 195);

      // Información del cliente (izquierda)
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text('DATOS DEL CLIENTE', 50, 150);
      
      // Caja del cliente
      doc.fillColor('#f8f9fa')
         .rect(50, 170, 330, 100)
         .fill()
         .strokeColor('#dee2e6')
         .rect(50, 170, 330, 100)
         .stroke();
      
      let clientY = 180;
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor('black')
         .text(quote.client_name, 60, clientY);
      
      clientY += 20;
      if (quote.client_company) {
        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#444')
           .text(quote.client_company, 60, clientY);
        clientY += 18;
      }
      
      if (quote.client_email) {
        doc.fontSize(9)
           .fillColor('#666')
           .text(`Email: ${quote.client_email}`, 60, clientY);
        clientY += 15;
      }
      
      if (quote.client_phone) {
        doc.text(`Teléfono: ${quote.client_phone}`, 60, clientY);
      }

      // Tabla de productos
      let yPos = 300;
      
      // Header tabla con fondo
      doc.fillColor('#0066cc')
         .rect(50, yPos, 500, 25)
         .fill();
      
      doc.fontSize(9)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text('Código', 60, yPos + 8)
         .text('Producto', 120, yPos + 8)
         .text('Cant.', 360, yPos + 8)
         .text('Precio Unit.', 410, yPos + 8)
         .text('Total', 495, yPos + 8);
      
      yPos += 30;

      // Items con líneas alternas
      doc.font('Helvetica')
         .fontSize(9);
      
      let alternate = false;
      items.forEach((item, index) => {
        const itemHeight = item.description ? 50 : 30;
        
        if (yPos + itemHeight > 650) {
          doc.addPage();
          yPos = 50;
          alternate = false;
        }
        
        // Fondo alternado
        if (alternate) {
          doc.fillColor('#f8f9fa')
             .rect(50, yPos - 5, 500, itemHeight)
             .fill();
        }
        
        // Código/SKU
        doc.fillColor('#666')
           .fontSize(8)
           .font('Helvetica')
           .text(item.code || `P${String(index + 1).padStart(3, '0')}`, 60, yPos);
        
        // Nombre del producto
        doc.fillColor('black')
           .fontSize(9)
           .font('Helvetica-Bold')
           .text(item.name, 120, yPos, { width: 230, lineBreak: false });
        
        // Cantidad
        doc.font('Helvetica')
           .text(item.quantity, 360, yPos, { width: 40, align: 'center' });
        
        // Precio unitario
        const unitPrice = parseFloat(item.unit_price || item.price || 0);
        doc.text(formatCurrency(unitPrice), 410, yPos, { width: 70, align: 'right' });
        
        // Total
        doc.font('Helvetica-Bold')
           .text(formatCurrency(item.quantity * unitPrice), 490, yPos, { width: 50, align: 'right' });
        
        // Descripción
        if (item.description) {
          yPos += 13;
          doc.fontSize(7)
             .font('Helvetica')
             .fillColor('#666')
             .text(item.description, 120, yPos, { width: 230 });
          doc.fillColor('black')
             .fontSize(9);
        }
        
        yPos += item.description ? 37 : 30;
        alternate = !alternate;
      });

      // Línea separadora antes de totales
      doc.strokeColor('#dee2e6')
         .moveTo(380, yPos)
         .lineTo(550, yPos)
         .stroke();
      
      yPos += 15;

      // Totales con mejor formato
      doc.fontSize(10)
         .font('Helvetica')
         .fillColor('#666');
      
      doc.text('Subtotal:', 360, yPos, { width: 120 });
      doc.fillColor('black')
         .text(formatCurrency(quote.subtotal), 480, yPos, { width: 70, align: 'right' });
      
      yPos += 20;
      doc.fillColor('#666')
         .text('IVA (16%):', 360, yPos, { width: 120 });
      doc.fillColor('black')
         .text(formatCurrency(quote.tax), 480, yPos, { width: 70, align: 'right' });
      
      yPos += 25;
      
      // Caja de total
      doc.fillColor('#0066cc')
         .rect(350, yPos - 5, 200, 30)
         .fill();
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text('TOTAL:', 360, yPos + 5, { width: 110 });
      doc.fontSize(14)
         .text(formatCurrency(quote.total), 470, yPos + 5, { width: 75, align: 'right' });

      // Sección de notas
      if (quote.notes) {
        yPos += 50;
        if (yPos > 620) {
          doc.addPage();
          yPos = 50;
        }
        
        doc.fillColor('#0066cc')
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('NOTAS Y OBSERVACIONES:', 50, yPos);
        
        doc.fillColor('#f8f9fa')
           .rect(50, yPos + 20, 500, 60)
           .fill()
           .strokeColor('#dee2e6')
           .rect(50, yPos + 20, 500, 60)
           .stroke();
        
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#444')
           .text(quote.notes, 60, yPos + 30, { width: 480, height: 50 });
      }

      // Condiciones al final de la página 1 (solo si hay espacio)
      if (yPos < 680) {
        doc.fontSize(8)
           .fillColor('#999')
           .text(`Vigencia: ${quote.validity_days} días | Entrega: ${quote.delivery_time} | Pago: ${quote.payment_terms}`, 50, 720, {
             width: 500,
             align: 'center'
           });
      }

      // Nueva página para datos bancarios
      doc.addPage();
      
      // Header de página 2
      doc.fillColor('#0066cc')
         .rect(0, 0, doc.page.width, 80)
         .fill();
      
      doc.fillColor('white')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('DATOS BANCARIOS', 50, 30);
      
      // Caja de información bancaria
      doc.fillColor('#f8f9fa')
         .rect(50, 120, 500, 180)
         .fill()
         .strokeColor('#dee2e6')
         .rect(50, 120, 500, 180)
         .stroke();
      
      let bankY = 140;
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#0066cc')
         .text('Información para transferencias:', 60, bankY);
      
      bankY += 30;
      doc.fontSize(11)
         .fillColor('black')
         .text('Banco:', 60, bankY);
      doc.font('Helvetica')
         .text('BBVA Bancomer', 200, bankY);
      
      bankY += 25;
      doc.font('Helvetica-Bold')
         .text('Titular:', 60, bankY);
      doc.font('Helvetica')
         .text('Integrational 3 S.A. de C.V.', 200, bankY);
      
      bankY += 25;
      doc.font('Helvetica-Bold')
         .text('Cuenta:', 60, bankY);
      doc.font('Helvetica')
         .text('0123456789', 200, bankY);
      
      bankY += 25;
      doc.font('Helvetica-Bold')
         .text('CLABE:', 60, bankY);
      doc.font('Helvetica')
         .text('012345678901234567', 200, bankY);
      
      // Condiciones y términos
      bankY += 50;
      doc.fontSize(10)
         .fillColor('#0066cc')
         .font('Helvetica-Bold')
         .text('Condiciones Comerciales:', 60, bankY);
      
      bankY += 20;
      doc.fontSize(9)
         .fillColor('#666')
         .font('Helvetica')
         .text(`• Tiempo de entrega: ${quote.delivery_time}`, 60, bankY);
      
      bankY += 18;
      doc.text(`• Condiciones de pago: ${quote.payment_terms}`, 60, bankY);
      
      bankY += 18;
      doc.text(`• Esta cotización tiene una vigencia de ${quote.validity_days} días`, 60, bankY);
      
      // Nota de agradecimiento
      doc.fontSize(10)
         .fillColor('#666')
         .font('Helvetica-Oblique')
         .text('Gracias por su preferencia. Para cualquier duda o aclaración, no dude en contactarnos.', 50, 450, {
           width: 500,
           align: 'center'
         });

      doc.end();
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      reject(error);
    }
  });
}
