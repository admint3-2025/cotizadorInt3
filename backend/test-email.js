import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Configurar DNS de Google
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

console.log('🔧 Probando conexión SMTP...');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Pass:', process.env.SMTP_PASS ? '***configurada***' : '❌ NO CONFIGURADA');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  dnsTimeout: 10000,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
  authMethod: 'PLAIN',
  debug: true
});

console.log('\n📧 Verificando conexión...\n');

transporter.verify()
  .then(() => {
    console.log('\n✅ ¡Conexión SMTP exitosa!');
    console.log('El servidor está listo para enviar correos.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.log('\n❌ Error de conexión SMTP:');
    console.log('Código:', error.code);
    console.log('Mensaje:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que el servidor SMTP sea correcto: smtp.titan.email');
    console.log('2. Verifica que el puerto sea 587');
    console.log('3. Verifica que el usuario y contraseña sean correctos');
    console.log('4. Verifica que no haya firewall bloqueando el puerto 587');
    console.log('5. Intenta con puerto 465 (SSL) si 587 no funciona\n');
    process.exit(1);
  });
