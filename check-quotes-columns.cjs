const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./integrational.db');

db.all("PRAGMA table_info(quotes)", [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log('\n📋 Columnas de la tabla quotes:\n');
    rows.forEach(r => {
      console.log(`  ${r.cid}. ${r.name} (${r.type}) ${r.notnull ? 'NOT NULL' : ''} ${r.pk ? 'PRIMARY KEY' : ''}`);
    });
    
    const hasClientId = rows.some(r => r.name === 'client_id');
    console.log(`\n✅ ¿Tiene client_id? ${hasClientId ? 'SÍ' : 'NO'}`);
  }
  db.close();
});
