import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'integrational.db'));

console.log('🗑️  Eliminando cotizaciones...');
const result = db.prepare('DELETE FROM quotes').run();
console.log('✅ Cotizaciones eliminadas:', result.changes);

const count = db.prepare('SELECT COUNT(*) as total FROM quotes').get();
console.log('📊 Cotizaciones restantes:', count.total);

db.close();
