import express from 'express';
import { query } from '../database/init.js';
import { authenticateToken } from './auth.js';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

const router = express.Router();

// Configurar multer para archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Importar clientes desde CSV
router.post('/clients', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const results = [];
    const errors = [];
    let lineNumber = 0;

    // Parsear CSV
    const stream = Readable.from(req.file.buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (data) => results.push({ ...data, line: ++lineNumber }))
      .on('end', async () => {
        let imported = 0;
        let failed = 0;

        for (const row of results) {
          try {
            // Validar campos requeridos
            if (!row.name || !row.email) {
              errors.push({
                line: row.line,
                error: 'Nombre y email son requeridos',
                data: row
              });
              failed++;
              continue;
            }

            // Insertar cliente
            await query(`
              INSERT INTO clients (
                name, company, email, phone, address, 
                rfc, payment_terms, notes, created_by
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
              row.name,
              row.company || null,
              row.email,
              row.phone || null,
              row.address || null,
              row.rfc || null,
              row.payment_terms || null,
              row.notes || null,
              req.user.id
            ]);

            imported++;
          } catch (error) {
            errors.push({
              line: row.line,
              error: error.message,
              data: row
            });
            failed++;
          }
        }

        res.json({
          success: true,
          imported,
          failed,
          total: results.length,
          errors: errors.length > 0 ? errors : undefined
        });
      })
      .on('error', (error) => {
        res.status(500).json({ error: 'Error al procesar archivo: ' + error.message });
      });

  } catch (error) {
    console.error('Error al importar clientes:', error);
    res.status(500).json({ error: 'Error al importar clientes' });
  }
});

// Importar productos desde CSV
router.post('/products', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const results = [];
    const errors = [];
    let lineNumber = 0;

    // Parsear CSV
    const stream = Readable.from(req.file.buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (data) => results.push({ ...data, line: ++lineNumber }))
      .on('end', async () => {
        let imported = 0;
        let failed = 0;

        for (const row of results) {
          try {
            // Validar campos requeridos
            if (!row.code || !row.name || !row.unit_price) {
              errors.push({
                line: row.line,
                error: 'Código, nombre y precio son requeridos',
                data: row
              });
              failed++;
              continue;
            }

            // Insertar producto
            await query(`
              INSERT INTO products (
                code, name, description, specs, 
                unit_price, category, stock, 
                is_active, created_by
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
              row.code,
              row.name,
              row.description || null,
              row.specs || null,
              parseFloat(row.unit_price),
              row.category || null,
              parseInt(row.stock || 0),
              row.is_active === 'false' || row.is_active === '0' ? false : true,
              req.user.id
            ]);

            imported++;
          } catch (error) {
            errors.push({
              line: row.line,
              error: error.message,
              data: row
            });
            failed++;
          }
        }

        res.json({
          success: true,
          imported,
          failed,
          total: results.length,
          errors: errors.length > 0 ? errors : undefined
        });
      })
      .on('error', (error) => {
        res.status(500).json({ error: 'Error al procesar archivo: ' + error.message });
      });

  } catch (error) {
    console.error('Error al importar productos:', error);
    res.status(500).json({ error: 'Error al importar productos' });
  }
});

// Descargar plantilla CSV para clientes
router.get('/template/clients', (req, res) => {
  const csv = 'name,company,email,phone,address,rfc,payment_terms,notes\n' +
              'Juan Pérez,Empresa SA,juan@empresa.com,4491234567,"Calle 123, Aguascalientes",RFC123456,30 días,Cliente frecuente\n';
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=plantilla_clientes.csv');
  res.send(csv);
});

// Descargar plantilla CSV para productos
router.get('/template/products', (req, res) => {
  const csv = 'code,name,description,specs,unit_price,category,stock,is_active\n' +
              'PROD-001,Producto Ejemplo,Descripción del producto,Especificaciones técnicas,1500.00,Categoría A,100,true\n';
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=plantilla_productos.csv');
  res.send(csv);
});

export default router;
