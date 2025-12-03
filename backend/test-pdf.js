import puppeteer from 'puppeteer';

console.log('🔍 Verificando instalación de Puppeteer...\n');

try {
  console.log('📦 Lanzando navegador...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  console.log('✅ Navegador lanzado correctamente');
  
  const page = await browser.newPage();
  console.log('✅ Página creada');
  
  await page.setContent('<html><body><h1>Test PDF</h1></body></html>');
  console.log('✅ Contenido establecido');
  
  const pdf = await page.pdf({ format: 'A4' });
  console.log('✅ PDF generado:', pdf.length, 'bytes');
  
  await browser.close();
  console.log('\n✅ ¡Puppeteer funciona correctamente!\n');
  process.exit(0);
} catch (error) {
  console.log('\n❌ Error con Puppeteer:');
  console.log('Mensaje:', error.message);
  console.log('\n💡 Solución: Puppeteer necesita descargar Chromium');
  console.log('Ejecuta: npx puppeteer browsers install chrome\n');
  process.exit(1);
}
