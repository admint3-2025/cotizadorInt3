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
         .text('Tel: (123) 456-7890', 50, 85);

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
      
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text('Producto', 60, yPos + 8)
         .text('Cant.', 330, yPos + 8)
         .text('Precio Unit.', 390, yPos + 8)
         .text('Total', 490, yPos + 8);
      
      yPos += 30;

      // Items con líneas alternas
      doc.font('Helvetica')
         .fontSize(10);
      
      let alternate = false;
      items.forEach(item => {
        if (yPos > 670) {
          doc.addPage();
          yPos = 50;
          alternate = false;
        }
        
        // Fondo alternado
        if (alternate) {
          doc.fillColor('#f8f9fa')
             .rect(50, yPos - 5, 500, 35)
             .fill();
        }
        
        doc.fillColor('black')
           .font('Helvetica-Bold')
           .text(item.name, 60, yPos, { width: 250, lineBreak: false });
        
        doc.font('Helvetica')
           .text(item.quantity.toString(), 330, yPos)
           .text(formatCurrency(item.price), 390, yPos)
           .font('Helvetica-Bold')
           .text(formatCurrency(item.quantity * item.price), 490, yPos);
        
        if (item.description) {
          yPos += 15;
          doc.fontSize(8)
             .font('Helvetica')
             .fillColor('#666')
             .text(item.description, 60, yPos, { width: 250 });
          doc.fillColor('black')
             .fontSize(10);
          yPos += 10;
        }
        
        yPos += 30;
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
      
      doc.text('Subtotal:', 400, yPos);
      doc.fillColor('black')
         .text(formatCurrency(quote.subtotal), 490, yPos, { align: 'right' });
      
      yPos += 20;
      doc.fillColor('#666')
         .text('IVA (16%):', 400, yPos);
      doc.fillColor('black')
         .text(formatCurrency(quote.tax), 490, yPos, { align: 'right' });
      
      yPos += 25;
      
      // Caja de total
      doc.fillColor('#0066cc')
         .rect(380, yPos - 5, 170, 30)
         .fill();
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('white')
         .text('TOTAL:', 390, yPos + 5);
      doc.fontSize(14)
         .text(formatCurrency(quote.total), 480, yPos + 5);

      // Sección de notas
      if (quote.notes) {
        yPos += 50;
        if (yPos > 650) {
          doc.addPage();
          yPos = 50;
        }
        
        doc.fillColor('#0066cc')
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('NOTAS Y OBSERVACIONES:', 50, yPos);
        
        doc.fillColor('#f8f9fa')
           .rect(50, yPos + 20, 500, 80)
           .fill()
           .strokeColor('#dee2e6')
           .rect(50, yPos + 20, 500, 80)
           .stroke();
        
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#444')
           .text(quote.notes, 60, yPos + 30, { width: 480 });
      }

      // Condiciones al final de la página
      doc.fontSize(8)
         .fillColor('#666')
         .text(`Vigencia de la cotización: ${quote.validity_days} días`, 50, 720)
         .text(`Tiempo de entrega: ${quote.delivery_time}`, 50, 735)
         .text(`Condiciones de pago: ${quote.payment_terms}`, 50, 750);

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
      
      // Nota de agradecimiento
      doc.fontSize(10)
         .fillColor('#666')
         .font('Helvetica-Oblique')
         .text('Gracias por su preferencia. Para cualquier duda o aclaración, no dude en contactarnos.', 50, 350, {
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
