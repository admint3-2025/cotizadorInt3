import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('integrational.db');

const newPassword = '72286428joe';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

db.run(
  'UPDATE users SET password = ? WHERE username = ?',
  [hashedPassword, 'admint3'],
  function(err) {
    if (err) {
      console.error('❌ Error al actualizar contraseña:', err);
    } else {
      console.log('✅ Contraseña actualizada para usuario: admint3');
      console.log('   Nueva contraseña: 72286428joe');
    }
    db.close();
  }
);
