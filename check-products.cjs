const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./integrational.db');

db.all('SELECT id, code, name, unit_price, is_active FROM products', [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log(`\n📦 Total productos en BD: ${rows.length}\n`);
    rows.forEach(p => {
      console.log(`  ${p.id}. [${p.code}] ${p.name} - $${p.unit_price} (activo: ${p.is_active})`);
    });
  }
  db.close();
});
