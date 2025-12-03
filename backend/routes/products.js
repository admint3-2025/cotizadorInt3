import express from 'express';
import { query, getOne, getAll } from '../database/init.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los productos/servicios
router.get('/', async (req, res) => {
  try {
    const { active_only } = req.query;
    
    let query = `
      SELECT p.*, u.full_name as created_by_name
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
    `;
    
    if (active_only === 'true') {
      query += ' WHERE p.is_active = TRUE';
    }
    
    query += ' ORDER BY p.name ASC';

    const products = await getAll(query);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await getOne('SELECT * FROM products WHERE id = $1', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Buscar productos por código o nombre
router.get('/search/:term', async (req, res) => {
  try {
    const term = `%${req.params.term}%`;
    const products = await getAll(`
      SELECT * FROM products 
      WHERE (code LIKE ? OR name LIKE ? OR description LIKE ?) AND is_active = 1
      ORDER BY name ASC
      LIMIT 20
    `, [term, term, term]);

    res.json(products);
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
});

// Crear nuevo producto/servicio
router.post('/', async (req, res) => {
  const { 
    code, name, description, category, unit_price, cost, stock, 
    unit, is_service, tax_rate, notes 
  } = req.body;

  try {
    // Verificar si el código ya existe
    const existingProduct = await getOne(
      'SELECT id FROM products WHERE code = $1',
      [code]
    );

    if (existingProduct) {
      return res.status(400).json({ error: 'Ya existe un producto con ese código' });
    }

    const result = await query(
      `INSERT INTO products (
        code, name, description, category, unit_price, cost, stock, 
        unit, is_service, tax_rate, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        code, name, description, category, unit_price, cost || 0, stock || 0,
        unit || 'Pieza', is_service, tax_rate || 16.0, notes, req.user.id
      ]
    );

    const newProduct = await getOne('SELECT * FROM products WHERE id = $1', [result.rows[0].id]);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Actualizar producto/servicio
router.put('/:id', async (req, res) => {
  const { 
    code, name, description, category, unit_price, cost, stock, 
    unit, is_service, is_active, tax_rate, notes 
  } = req.body;

  try {
    const product = await getOne('SELECT id FROM products WHERE id = $1', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el nuevo código ya existe en otro producto
    const existingProduct = await getOne(
      'SELECT id FROM products WHERE code = $1 AND id != $2',
      [code, req.params.id]
    );

    if (existingProduct) {
      return res.status(400).json({ error: 'Ya existe un producto con ese código' });
    }

    await query(
      `UPDATE products 
       SET code = $1, name = $2, description = $3, category = $4, unit_price = $5, 
           cost = $6, stock = $7, unit = $8, is_service = $9, is_active = $10, 
           tax_rate = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
       WHERE id = $13`,
      [
        code, name, description, category, unit_price, cost || 0, stock || 0,
        unit || 'Pieza', is_service, is_active, 
        tax_rate || 16.0, notes, req.params.id
      ]
    );

    const updatedProduct = await getOne('SELECT * FROM products WHERE id = $1', [req.params.id]);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Desactivar producto (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const product = await getOne('SELECT id FROM products WHERE id = $1', [req.params.id]);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await query(
      'UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [req.params.id]
    );

    res.json({ message: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('Error al desactivar producto:', error);
    res.status(500).json({ error: 'Error al desactivar producto' });
  }
});

// Obtener categorías únicas
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await getAll(`
      SELECT DISTINCT category 
      FROM products 
      WHERE category IS NOT NULL AND category != ''
      ORDER BY category ASC
    `);

    res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

export default router;
