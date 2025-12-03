import express from 'express';
import { query, getOne, getAll } from '../database/init.js';
import { authenticateToken } from './auth.js';
import { generatePDF } from '../services/pdfGeneratorSimple.js';
import { sendQuoteEmail } from '../services/emailService.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    
    const query = includeDeleted 
      ? `SELECT q.*, u.username as created_by_username, u.full_name as created_by_name,
                d.username as deleted_by_username, d.full_name as deleted_by_name
         FROM quotes q
         LEFT JOIN users u ON q.created_by = u.id
         LEFT JOIN users d ON q.deleted_by = d.id
         ORDER BY q.created_at DESC`
      : `SELECT q.*, u.username as created_by_username, u.full_name as created_by_name
         FROM quotes q
         LEFT JOIN users u ON q.created_by = u.id
         WHERE q.deleted_at IS NULL
         ORDER BY q.created_at DESC`;

    const quotes = await getAll(query);

    res.json(quotes);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// Obtener una cotización por ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await getOne('SELECT * FROM quotes WHERE id = $1', [req.params.id]);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    res.json(quote);
  } catch (error) {
    console.error('Error al obtener cotización:', error);
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const {
    client_id,
    client_name,
    client_company,
    client_email,
    client_phone,
    client_address,
    items,
    subtotal,
    tax,
    total,
    notes,
    validity_days,
    delivery_time,
    payment_terms,
    template_type,
    send_email
  } = req.body;

  try {
    // Generar folio único
    const date = new Date();
    const folio = `INT-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Date.now().toString().slice(-4)}`;

    const result = await query(`
      INSERT INTO quotes (
        folio, client_id, client_name, client_company, client_email, client_phone,
        client_address, items, subtotal, tax, total, notes,
        validity_days, delivery_time, payment_terms, template_type, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING id
    `, [
      folio, client_id || null, client_name, client_company, client_email, client_phone,
      client_address, JSON.stringify(items), subtotal, tax, total, notes,
      validity_days, delivery_time, payment_terms, template_type, req.user.id
    ]);

    const quote = await getOne('SELECT * FROM quotes WHERE id = $1', [result.rows[0].id]);

    // Enviar por email si se solicita
    if (send_email) {
      try {
        const pdfBuffer = await generatePDF(quote);
        await sendQuoteEmail(quote, pdfBuffer);
        await query('UPDATE quotes SET sent_at = CURRENT_TIMESTAMP WHERE id = $1', [quote.id]);
      } catch (emailError) {
        console.log('⚠️ No se pudo enviar el email (problema de red local), pero la cotización fue creada correctamente');
        console.log('💡 Puedes descargar el PDF y enviarlo manualmente');
      }
    }

    res.status(201).json(quote);
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
});

// Reenviar cotización por email
router.post('/:id/send', async (req, res) => {
  try {
    const quote = await getOne('SELECT * FROM quotes WHERE id = $1', [req.params.id]);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    try {
      const pdfBuffer = await generatePDF(quote);
      await sendQuoteEmail(quote, pdfBuffer);
      await query('UPDATE quotes SET sent_at = CURRENT_TIMESTAMP WHERE id = $1', [quote.id]);
      res.json({ message: 'Cotización enviada correctamente' });
    } catch (emailError) {
      res.status(500).json({ 
        error: 'No se pudo enviar el email debido a configuración de red local. Descarga el PDF y envíalo manualmente.' 
      });
    }
  } catch (error) {
    console.error('Error al enviar cotización:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Descargar PDF de cotización
router.get('/:id/pdf', async (req, res) => {
  try {
    console.log('📥 Solicitando PDF para cotización:', req.params.id);
    
    const quote = await getOne('SELECT * FROM quotes WHERE id = $1', [req.params.id]);
    
    if (!quote) {
      console.log('❌ Cotización no encontrada:', req.params.id);
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    console.log('✅ Cotización encontrada:', quote.folio);
    console.log('🎨 Generando PDF...');
    
    const pdfBuffer = await generatePDF(quote);
    
    console.log('✅ PDF generado exitosamente, tamaño:', pdfBuffer.length, 'bytes');
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${quote.folio}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error('❌ Error completo al generar PDF:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Error al generar PDF',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Eliminar cotización (soft delete con auditoría)
router.delete('/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const quote = await getOne('SELECT * FROM quotes WHERE id = $1 AND deleted_at IS NULL', [req.params.id]);
    
    if (!quote) {
      return res.status(404).json({ error: 'Cotización no encontrada o ya eliminada' });
    }

    // Obtener información del creador
    const creator = await getOne('SELECT full_name FROM users WHERE id = $1', [quote.created_by]);
    
    // Obtener información del eliminador
    const deleter = await getOne('SELECT full_name FROM users WHERE id = $1', [req.user.id]);

    // Registrar en auditoría
    await query(`
      INSERT INTO quotes_audit (
        quote_id, folio, client_name, client_company, client_email, total,
        created_by, created_by_name, created_at, deleted_at, deleted_by, deleted_by_name,
        deletion_reason, full_data
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, $10, $11, $12, $13)
    `, [
      quote.id,
      quote.folio,
      quote.client_name,
      quote.client_company,
      quote.client_email,
      quote.total,
      quote.created_by,
      creator ? creator.full_name : 'Desconocido',
      quote.created_at,
      req.user.id,
      deleter ? deleter.full_name : 'Desconocido',
      reason || 'Sin razón especificada',
      JSON.stringify(quote)
    ]);

    // Soft delete
    await query(
      'UPDATE quotes SET deleted_at = CURRENT_TIMESTAMP, deleted_by = $1, deletion_reason = $2 WHERE id = $3',
      [req.user.id, reason || 'Sin razón especificada', req.params.id]
    );

    res.json({ message: 'Cotización eliminada y registrada en auditoría' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ error: 'Error al eliminar cotización' });
  }
});

// Obtener historial de auditoría
router.get('/audit/history', async (req, res) => {
  try {
    const audit = await getAll(`
      SELECT * FROM quotes_audit 
      ORDER BY deleted_at DESC
    `);

    res.json(audit);
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    res.status(500).json({ error: 'Error al obtener auditoría' });
  }
});

export default router;
