# Integrational 3 - Sistema de Cotizaciones

Sistema completo de gestión de cotizaciones con generación automática de PDFs.

## 🚀 Deploy en Render

### Pre-requisitos
1. Cuenta en [Render.com](https://render.com)
2. Repositorio Git con el código

### Pasos para Deploy

1. **Crear PostgreSQL Database en Render:**
   - En el dashboard de Render, click en "New +"
   - Seleccionar "PostgreSQL"
   - Nombre: `integrational-db`
   - Database: `integrational`
   - User: `integrational`
   - Plan: Free
   - Click "Create Database"
   - **Guardar la "Internal Database URL"**

2. **Crear Web Service:**
   - Click en "New +" → "Web Service"
   - Conectar tu repositorio Git
   - Configuración:
     - Name: `integrational-app`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Plan: Free

3. **Configurar Variables de Entorno:**
   En la sección "Environment" del Web Service, agregar:
   ```
   NODE_ENV=production
   DATABASE_URL=[La Internal Database URL de PostgreSQL]
   JWT_SECRET=[Generar un string aleatorio seguro]
   PORT=10000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=administracion@integrational3.com.mx
   SMTP_PASS=[Contraseña de aplicación de Gmail]
   EMAIL_FROM=administracion@integrational3.com.mx
   ```

4. **Deploy Automático:**
   - Render detectará cambios en tu rama principal
   - El deploy se ejecutará automáticamente
   - La primera vez tomará 5-10 minutos

5. **Acceder a la Aplicación:**
   - URL: `https://integrational-app.onrender.com`
   - Usuario por defecto: `admin`
   - Contraseña: `admin123`

### 📧 Configuración de Email (Gmail)

Para enviar emails de cotizaciones:

1. Habilitar "Verificación en 2 pasos" en tu cuenta Gmail
2. Generar una "Contraseña de aplicación":
   - Google Account → Security → 2-Step Verification → App passwords
   - Seleccionar "Mail" y "Other"
   - Copiar la contraseña generada
3. Usar esa contraseña en `SMTP_PASS`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en modo producción
npm start
```

## 📝 Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

**⚠️ IMPORTANTE:** Cambiar la contraseña después del primer login.

## 🔧 Características

- ✅ Gestión de clientes y productos
- ✅ Creación de cotizaciones con cálculos automáticos
- ✅ Generación de PDFs profesionales
- ✅ Envío automático por email
- ✅ Historial de cotizaciones eliminadas
- ✅ Sistema de autenticación JWT
- ✅ Base de datos PostgreSQL

## 📞 Soporte

Para problemas o preguntas: administracion@integrational3.com.mx
