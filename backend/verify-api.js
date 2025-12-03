// Función para obtener token
async function login() {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  
  const data = await response.json();
  return data.token;
}

// Función para obtener cotizaciones
async function getQuotes(token) {
  const response = await fetch('http://localhost:3000/api/quotes', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const quotes = await response.json();
  return quotes;
}

// Ejecutar
(async () => {
  try {
    console.log('🔑 Obteniendo token...');
    const token = await login();
    console.log('✅ Token obtenido');
    
    console.log('\n📋 Consultando cotizaciones...');
    const quotes = await getQuotes(token);
    console.log(`Total de cotizaciones: ${quotes.length}`);
    
    if (quotes.length > 0) {
      console.log('\n⚠️ ATENCIÓN: Hay cotizaciones en el sistema:');
      quotes.forEach(q => {
        console.log(`  - ${q.folio}: ${q.client_name} - $${q.total}`);
      });
    } else {
      console.log('\n✅ Sistema limpio: 0 cotizaciones');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
