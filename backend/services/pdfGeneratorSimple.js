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

      // Header
      doc.fillColor('#0066cc')
         .rect(0, 0, doc.page.width, 100)
         .fill();
      
      doc.fillColor('white')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('INTEGRATIONAL 3', 50, 30);
      
      doc.fontSize(9)
         .font('Helvetica')
         .text('administracion@integrational3.com.mx', 50, 60)
         .text('Tel: (123) 456-7890', 50, 75);

      // Folio
      doc.fillColor('black')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text(`COTIZACIÓN ${quote.folio}`, 50, 120);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text(`Fecha: ${date}`, 50, 150)
         .text(`Vigencia: ${quote.validity_days} días`, 50, 165);

      // Cliente
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('CLIENTE:', 50, 200);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text(quote.client_name, 50, 220);
      
      if (quote.client_company) {
        doc.text(quote.client_company, 50, 235);
      }
      
      if (quote.client_email) {
        doc.text(`Email: ${quote.client_email}`, 50, 250);
      }
      
      if (quote.client_phone) {
        doc.text(`Tel: ${quote.client_phone}`, 50, 265);
      }

      // Tabla de productos
      let yPos = 310;
      
      // Header tabla
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Producto', 50, yPos)
         .text('Cant.', 280, yPos)
         .text('P. Unit.', 350, yPos)
         .text('Total', 470, yPos);
      
      doc.moveTo(50, yPos + 15)
         .lineTo(550, yPos + 15)
         .stroke();
      
      yPos += 25;

      // Items
      doc.font('Helvetica')
         .fontSize(9);
      
      items.forEach(item => {
        if (yPos > 680) {
          doc.addPage();
          yPos = 50;
        }
        
        doc.text(item.name, 50, yPos, { width: 220 });
        doc.text(item.quantity.toString(), 280, yPos);
        doc.text(formatCurrency(item.price), 350, yPos);
        doc.text(formatCurrency(item.quantity * item.price), 470, yPos);
        
        if (item.description) {
          yPos += 15;
          doc.fontSize(8)
             .fillColor('#666')
             .text(item.description, 50, yPos, { width: 220 });
          doc.fillColor('black')
             .fontSize(9);
        }
        
        yPos += 30;
      });

      // Totales
      yPos += 10;
      doc.fontSize(10);
      
      doc.text('Subtotal:', 400, yPos);
      doc.text(formatCurrency(quote.subtotal), 470, yPos);
      
      yPos += 20;
      doc.text('IVA (16%):', 400, yPos);
      doc.text(formatCurrency(quote.tax), 470, yPos);
      
      yPos += 20;
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('TOTAL:', 400, yPos);
      doc.text(formatCurrency(quote.total), 470, yPos);

      // Notas
      if (quote.notes) {
        yPos += 40;
        if (yPos > 650) {
          doc.addPage();
          yPos = 50;
        }
        
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .text('NOTAS:', 50, yPos);
        
        doc.fontSize(9)
           .font('Helvetica')
           .text(quote.notes, 50, yPos + 20, { width: 500 });
      }

      // Nueva página para datos bancarios
      doc.addPage();
      
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('DATOS BANCARIOS', 50, 50);
      
      doc.fontSize(10)
         .font('Helvetica')
         .text('Banco: BBVA Bancomer', 50, 80)
         .text('Titular: Integrational 3 S.A. de C.V.', 50, 100)
         .text('Cuenta: 0123456789', 50, 120)
         .text('CLABE: 012345678901234567', 50, 140);
      
      doc.fontSize(9)
         .fillColor('#666')
         .text(`Tiempo de entrega: ${quote.delivery_time}`, 50, 180)
         .text(`Condiciones de pago: ${quote.payment_terms}`, 50, 200);

      doc.end();
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      reject(error);
    }
  });
}
