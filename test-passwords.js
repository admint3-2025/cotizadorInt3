import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('integrational.db');

const testPasswords = [
  'admin123',
  'Temporal2024#',
  'temporal2024',
  'Admin123',
  'admint3'
];

db.get('SELECT password FROM users WHERE username = ?', ['admint3'], (err, row) => {
  if (err) {
    console.error('Error:', err);
    db.close();
    return;
  }
  
  if (!row) {
    console.log('❌ Usuario admint3 no encontrado');
    db.close();
    return;
  }
  
  console.log('\n🔐 Probando contraseñas para usuario: admint3\n');
  
  testPasswords.forEach(pwd => {
    const isValid = bcrypt.compareSync(pwd, row.password);
    console.log(`   ${pwd.padEnd(20)} ${isValid ? '✅ VÁLIDA' : '❌ Inválida'}`);
  });
  
  console.log('\n💡 Si ninguna funciona, resetea la contraseña ejecutando reset-password.js\n');
  
  db.close();
});
