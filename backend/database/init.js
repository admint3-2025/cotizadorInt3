import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper functions para queries
export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const getOne = async (text, params) => {
  const result = await query(text, params);
  return result.rows[0];
};

export const getAll = async (text, params) => {
  const result = await query(text, params);
  return result.rows;
};

export async function initDatabase() {
  console.log('🔄 Inicializando base de datos PostgreSQL...');

  try {
    // Tabla de usuarios
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de clientes
    await query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        zip_code VARCHAR(20),
        rfc VARCHAR(50),
        contact_person VARCHAR(255),
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de productos y servicios
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        code VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        unit_price NUMERIC(10, 2) NOT NULL,
        cost NUMERIC(10, 2),
        stock INTEGER DEFAULT 0,
        unit VARCHAR(50) DEFAULT 'Pieza',
        is_service BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        tax_rate NUMERIC(5, 2) DEFAULT 16.0,
        notes TEXT,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de cotizaciones
    await query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        folio VARCHAR(100) UNIQUE NOT NULL,
        client_id INTEGER REFERENCES clients(id),
        client_name VARCHAR(255) NOT NULL,
        client_company VARCHAR(255),
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        client_address TEXT,
        items TEXT NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        tax NUMERIC(10, 2) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        notes TEXT,
        validity_days INTEGER DEFAULT 15,
        delivery_time VARCHAR(255),
        payment_terms VARCHAR(255),
        template_type INTEGER DEFAULT 1,
        created_by INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        sent_at TIMESTAMP,
        deleted_at TIMESTAMP,
        deleted_by INTEGER REFERENCES users(id),
        deletion_reason TEXT
      )
    `);

    // Tabla de auditoría de cotizaciones eliminadas
    await query(`
      CREATE TABLE IF NOT EXISTS quotes_audit (
        id SERIAL PRIMARY KEY,
        quote_id INTEGER NOT NULL,
        folio VARCHAR(100) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_company VARCHAR(255),
        client_email VARCHAR(255) NOT NULL,
        total NUMERIC(10, 2) NOT NULL,
        created_by INTEGER,
        created_by_name VARCHAR(255),
        created_at TIMESTAMP,
        deleted_at TIMESTAMP NOT NULL,
        deleted_by INTEGER NOT NULL,
        deleted_by_name VARCHAR(255),
        deletion_reason TEXT,
        full_data TEXT NOT NULL
      )
    `);

    // Crear usuario por defecto si no existe
    const userExists = await getOne('SELECT id FROM users WHERE username = $1', ['admin']);
    
    if (!userExists) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await query(
        'INSERT INTO users (username, password, email, full_name) VALUES ($1, $2, $3, $4)',
        ['admin', hashedPassword, 'administracion@integrational3.com.mx', 'Administrador']
      );
      
      console.log('✅ Usuario administrador creado: admin / admin123');
    }

    console.log('✅ Base de datos PostgreSQL inicializada');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    throw error;
  }
}

export default pool;
