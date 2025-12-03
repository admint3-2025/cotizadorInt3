import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('integrational.db');

db.serialize(() => {
  // Ver usuarios
  db.all('SELECT id, username, email, full_name, created_at FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    
    console.log('\n📋 USUARIOS EN LA BASE DE DATOS:\n');
    if (rows.length === 0) {
      console.log('   ⚠️  No hay usuarios registrados');
    } else {
      rows.forEach(user => {
        console.log(`   ID: ${user.id}`);
        console.log(`   Usuario: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nombre: ${user.full_name}`);
        console.log(`   Creado: ${user.created_at}`);
        console.log('   ---');
      });
    }
    
    // Verificar contraseña del admin
    db.get('SELECT password FROM users WHERE username = ?', ['admin'], (err, row) => {
      if (row) {
        const testPassword = 'admin123';
        const isValid = bcrypt.compareSync(testPassword, row.password);
        console.log(`\n🔐 Verificación de contraseña para 'admin':`);
        console.log(`   Contraseña 'admin123': ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
        
        if (!isValid) {
          console.log('\n⚠️  La contraseña ha cambiado o el hash no coincide');
          console.log('   Hash almacenado:', row.password.substring(0, 30) + '...');
        }
      }
      
      db.close();
    });
  });
});
