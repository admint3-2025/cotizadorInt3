import puppeteer from 'puppeteer';
import fs from 'fs';

console.log('🧪 Probando Puppeteer...');

try {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('✅ Navegador iniciado');
  
  const page = await browser.newPage();
  await page.setContent('<html><body><h1>Test PDF</h1><p>Esto es una prueba</p></body></html>');
  
  console.log('✅ Contenido cargado');
  
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true
  });
  
  console.log('✅ PDF generado, tamaño:', pdfBuffer.length, 'bytes');
  
  fs.writeFileSync('test-pdf.pdf', pdfBuffer);
  console.log('✅ PDF guardado como test-pdf.pdf');
  
  await browser.close();
  console.log('✅ Navegador cerrado');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}
