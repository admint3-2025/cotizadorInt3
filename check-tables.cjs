const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./integrational.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log(`\n📋 Tablas en la base de datos:\n`);
    rows.forEach(r => console.log(`  - ${r.name}`));
  }
  db.close();
});
