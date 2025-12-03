import express from 'express';
import { query, getOne, getAll } from '../database/init.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clients = await getAll(`
      SELECT c.*, u.full_name as created_by_name
      FROM clients c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.name ASC
    `);

    res.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const client = await getOne('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// Buscar clientes por email o nombre
router.get('/search/:term', async (req, res) => {
  try {
    const term = `%${req.params.term}%`;
    const clients = await getAll(`
      SELECT * FROM clients 
      WHERE email LIKE ? OR name LIKE ? OR company LIKE ?
      LIMIT 10
    `, [term, term, term]);

    res.json(clients);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
});

// Crear nuevo cliente
router.post('/', async (req, res) => {
  const { name, company, email, phone, address, city, state, zip_code, rfc, contact_person, notes } = req.body;

  try {
    // Verificar si el email ya existe
    const existingClient = await getOne(
      'SELECT id FROM clients WHERE email = $1',
      [email]
    );

    if (existingClient) {
      return res.status(400).json({ error: 'Ya existe un cliente con ese email' });
    }

    const result = await query(
      `INSERT INTO clients (name, company, email, phone, address, city, state, zip_code, rfc, contact_person, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [name, company, email, phone, address, city, state, zip_code, rfc, contact_person, notes, req.user.id]
    );

    const newClient = await getOne('SELECT * FROM clients WHERE id = $1', [result.rows[0].id]);

    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  const { name, company, email, phone, address, city, state, zip_code, rfc, contact_person, notes } = req.body;

  try {
    const client = await getOne('SELECT id FROM clients WHERE id = $1', [req.params.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el nuevo email ya existe en otro cliente
    const existingClient = await getOne(
      'SELECT id FROM clients WHERE email = $1 AND id != $2',
      [email, req.params.id]
    );

    if (existingClient) {
      return res.status(400).json({ error: 'Ya existe un cliente con ese email' });
    }

    await query(
      `UPDATE clients 
       SET name = $1, company = $2, email = $3, phone = $4, address = $5, 
           city = $6, state = $7, zip_code = $8, rfc = $9, contact_person = $10, 
           notes = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12`,
      [name, company, email, phone, address, city, state, zip_code, rfc, contact_person, notes, req.params.id]
    );

    const updatedClient = await getOne('SELECT * FROM clients WHERE id = $1', [req.params.id]);

    res.json(updatedClient);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    const client = await getOne('SELECT id FROM clients WHERE id = $1', [req.params.id]);
    
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el cliente tiene cotizaciones asociadas
    const quotesCount = await getOne(
      'SELECT COUNT(*) as count FROM quotes WHERE client_id = $1',
      [req.params.id]
    );

    if (quotesCount.count > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar el cliente porque tiene ${quotesCount.count} cotización(es) asociada(s)` 
      });
    }

    await query('DELETE FROM clients WHERE id = $1', [req.params.id]);

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

export default router;
