import { generatePDF } from './services/pdfGenerator.js';
import { dbGet } from './database/init.js';
import fs from 'fs';

console.log('🧪 Probando generación de PDF completo...');

try {
  // Obtener una cotización de la base de datos
  const quote = await dbGet('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 1');
  
  if (!quote) {
    console.error('❌ No hay cotizaciones en la base de datos');
    process.exit(1);
  }
  
  console.log('📋 Cotización encontrada:', quote.folio);
  console.log('Cliente:', quote.client_name);
  console.log('Total:', quote.total);
  
  // Generar PDF
  const pdfBuffer = await generatePDF(quote);
  
  console.log('✅ PDF generado exitosamente');
  console.log('Tamaño:', pdfBuffer.length, 'bytes');
  
  // Guardar PDF
  const filename = `test-${quote.folio}.pdf`;
  fs.writeFileSync(filename, pdfBuffer);
  
  console.log('💾 PDF guardado como:', filename);
  console.log('\n✅ Prueba exitosa - El PDF debería abrirse correctamente');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
