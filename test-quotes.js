import http from 'http';
import fs from 'fs';

const API_URL = 'http://localhost:3000/api';

// Helper para hacer requests
function makeRequest(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Descargar PDF
function downloadPDF(path, filename, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ PDF descargado: ${filename}`);
        resolve();
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function createTestQuotes() {
  try {
    console.log('🔑 Iniciando sesión...');
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'admin',
      password: 'admin123'
    });
    const token = loginResponse.token;
    console.log('✅ Login exitoso\n');

    // Verificar clientes
    console.log('👤 Verificando clientes...');
    const clients = await makeRequest('/api/clients', 'GET', null, token);
    let clientId;

    if (clients.length === 0) {
      console.log('📝 Creando cliente de prueba...');
      const newClient = await makeRequest('/api/clients', 'POST', {
        name: 'Juan Pérez García',
        company: 'Tech Solutions SA de CV',
        email: 'juan.perez@techsolutions.com.mx',
        phone: '5551234567',
        address: 'Av. Revolución 1234, CDMX'
      }, token);
      clientId = newClient.id;
      console.log(`✅ Cliente creado con ID: ${clientId}\n`);
    } else {
      clientId = clients[0].id;
      console.log(`✅ Usando cliente existente: ${clients[0].name} (ID: ${clientId})\n`);
    }

    // Verificar productos
    console.log('📦 Verificando productos...');
    const products = await makeRequest('/api/products', 'GET', null, token);
    
    if (products.length === 0) {
      console.log('📝 Creando productos de prueba...');
      await makeRequest('/api/products', 'POST', {
        code: 'SOFT-001',
        name: 'Licencia Microsoft Office 365',
        description: 'Suite ofimática completa',
        specifications: 'Incluye Word, Excel, PowerPoint, Outlook. Licencia anual para 1 usuario',
        unit_price: 2500.00,
        category: 'Software'
      }, token);
      
      await makeRequest('/api/products', 'POST', {
        code: 'HARD-002',
        name: 'Laptop Dell Latitude 5420',
        description: 'Laptop empresarial',
        specifications: 'Intel Core i7-1185G7, 16GB RAM, SSD 512GB, Windows 11 Pro',
        unit_price: 25000.00,
        category: 'Hardware'
      }, token);
      
      await makeRequest('/api/products', 'POST', {
        code: 'SERV-003',
        name: 'Soporte Técnico Premium',
        description: 'Plan de soporte mensual',
        specifications: 'Atención 24/7, respuesta en 2 horas, mantenimiento preventivo incluido',
        unit_price: 5000.00,
        category: 'Servicios'
      }, token);
      
      console.log('✅ 3 productos creados\n');
    } else {
      console.log(`✅ ${products.length} productos disponibles\n`);
    }

    // Crear las 3 cotizaciones
    const templates = [
      { name: 'Minimalista', value: 'minimalist' },
      { name: 'Profesional', value: 'professional' },
      { name: 'Moderno', value: 'modern' }
    ];

    for (const template of templates) {
      console.log(`\n📄 Creando cotización con plantilla: ${template.name}`);
      
      const quoteData = {
        client_id: clientId,
        client_name: 'Juan Pérez García',
        client_company: 'Tech Solutions SA de CV',
        client_email: 'juan.perez@techsolutions.com.mx',
        client_phone: '5551234567',
        items: [
          {
            code: 'SOFT-001',
            description: 'Licencia Microsoft Office 365',
            specs: 'Suite completa - Licencia anual',
            quantity: 5,
            unit_price: 2500.00
          },
          {
            code: 'HARD-002',
            description: 'Laptop Dell Latitude 5420',
            specs: 'Intel i7, 16GB RAM, 512GB SSD, Win11 Pro',
            quantity: 2,
            unit_price: 25000.00
          },
          {
            code: 'SERV-003',
            description: 'Soporte Técnico Premium',
            specs: 'Atención 24/7, mantenimiento incluido',
            quantity: 1,
            unit_price: 5000.00
          }
        ],
        subtotal: 67500.00,
        tax: 10800.00,
        total: 78300.00,
        validity_days: 30,
        payment_terms: '50% anticipo, 50% contra entrega',
        delivery_time: '15 días hábiles',
        notes: 'Incluye instalación y capacitación básica. Garantía de 12 meses en hardware.',
        template: template.value
      };

      const quoteResponse = await makeRequest('/api/quotes', 'POST', quoteData, token);
      console.log(`✅ Cotización creada: ${quoteResponse.folio}`);

      // Descargar el PDF
      const filename = `TEST_${template.name}_${quoteResponse.folio}.pdf`;
      await downloadPDF(`/api/quotes/${quoteResponse.id}/pdf`, filename, token);
    }

    console.log('\n\n🎉 ¡Proceso completado!');
    console.log('📂 Verifica los 3 archivos PDF generados:');
    console.log('   - TEST_Minimalista_*.pdf (diseño gris limpio)');
    console.log('   - TEST_Profesional_*.pdf (diseño azul/verde corporativo)');
    console.log('   - TEST_Moderno_*.pdf (diseño púrpura/rosa vibrante)');
    console.log('\n✨ Cada PDF debe mostrar el logo de Integrational y diseño único');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestQuotes();
