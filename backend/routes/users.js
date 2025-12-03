import express from 'express';
import bcrypt from 'bcryptjs';
import { query, getOne, getAll } from '../database/init.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await getAll(`
      SELECT id, username, email, full_name, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getOne(
      'SELECT id, username, email, full_name, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  const { username, password, email, full_name } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await getOne(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await query(
      'INSERT INTO users (username, password, email, full_name) VALUES ($1, $2, $3, $4)',
      [username, hashedPassword, email, full_name]
    );

    const newUser = await getOne(
      'SELECT id, username, email, full_name, created_at FROM users WHERE id = $1',
      [result.lastID]
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { username, email, full_name, password } = req.body;

  try {
    const user = await getOne('SELECT id FROM users WHERE id = $1', [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo username/email ya existe en otro usuario
    const existingUser = await getOne(
      'SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3',
      [username, email, req.params.id]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'El usuario o email ya existe' });
    }

    // Actualizar datos básicos
    await query(
      'UPDATE users SET username = $1, email = $2, full_name = $3 WHERE id = $4',
      [username, email, full_name, req.params.id]
    );

    // Si se proporcionó una nueva contraseña, actualizarla
    if (password && password.trim() !== '') {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, req.params.id]
      );
    }

    const updatedUser = await getOne(
      'SELECT id, username, email, full_name, created_at FROM users WHERE id = $1',
      [req.params.id]
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    // No permitir eliminar al admin principal
    if (req.params.id === '1') {
      return res.status(400).json({ error: 'No se puede eliminar el administrador principal' });
    }

    const user = await getOne('SELECT id FROM users WHERE id = $1', [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el usuario tiene cotizaciones asociadas
    const quotesCount = await getOne(
      'SELECT COUNT(*) as count FROM quotes WHERE created_by = $1',
      [req.params.id]
    );

    if (quotesCount.count > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar el usuario porque tiene ${quotesCount.count} cotización(es) asociada(s)` 
      });
    }

    await query('DELETE FROM users WHERE id = $1', [req.params.id]);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default router;
