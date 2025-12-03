# 🚀 Sistema de Cotizaciones Integrational

Sistema profesional de gestión y envío de cotizaciones con 3 diseños de plantillas PDF.

## ✨ Características

- 🔐 **Sistema de autenticación** seguro con JWT
- 📋 **3 plantillas profesionales** de PDF personalizables
- 📧 **Envío automático** por correo empresarial
- 💾 **Base de datos SQLite** para historial
- 📱 **Diseño responsive** y moderno
- 🎨 **Interfaz intuitiva** con React + TailwindCSS
- 📊 **Gestión completa** de cotizaciones

## 🎨 Plantillas Disponibles

### 1. Ejecutivo Minimalista
Diseño simple, limpio y profesional. Ideal para cotizaciones rápidas.

### 2. Detallado Profesional ⭐ (Recomendado)
Plantilla completa con especificaciones técnicas, ideal para proyectos complejos como equipos de audio/video.

### 3. Moderno Visual
Diseño atractivo con gradientes, gráficas y elementos visuales modernos.

## 📦 Requisitos

- Node.js 18+ 
- NPM o Yarn
- Cuenta de correo empresarial (SMTP)

## 🔧 Instalación

1. **Instalar dependencias:**
```powershell
npm install
```

2. **Configurar variables de entorno:**
Copia `.env.example` a `.env` y configura tus credenciales:

```env
# Configuración de correo empresarial
SMTP_HOST=smtp.tu-servidor.com
SMTP_PORT=587
SMTP_USER=cotizaciones@integracional3.com.mx
SMTP_PASS=tu_contraseña

# Información de la empresa
EMPRESA_NOMBRE=Integrational
EMPRESA_EMAIL=cotizaciones@integracional3.com.mx
EMPRESA_TELEFONO=+52 33 1234 5678
```

3. **Iniciar el sistema:**
```powershell
npm run dev
```

El sistema estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 👤 Credenciales por defecto

- **Usuario:** admin
- **Contraseña:** admin123

## 📧 Configuración de Correo

### Para Gmail:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
```
**Nota:** Necesitas generar una "Contraseña de aplicación" en la configuración de seguridad de Google.

### Para Office 365/Outlook:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=tu-correo@tudominio.com
SMTP_PASS=tu_contraseña
```

### Para cPanel/Hosting:
```env
SMTP_HOST=mail.tudominio.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=cotizaciones@tudominio.com
SMTP_PASS=tu_contraseña
```

## 🎯 Uso del Sistema

1. **Iniciar sesión** con las credenciales
2. **Crear nueva cotización:**
   - Llenar datos del cliente
   - Agregar productos/servicios
   - Seleccionar plantilla de diseño (1, 2 o 3)
   - Opción de envío automático por email
3. **Gestionar cotizaciones:**
   - Ver historial completo
   - Descargar PDFs
   - Reenviar por correo

## 📁 Estructura del Proyecto

```
Proyecto4Init/
├── backend/
│   ├── server.js              # Servidor Express
│   ├── database/
│   │   └── init.js           # Configuración SQLite
│   ├── routes/
│   │   ├── auth.js           # Rutas de autenticación
│   │   └── quotes.js         # Rutas de cotizaciones
│   └── services/
│       ├── emailService.js   # Envío de correos
│       ├── pdfGenerator.js   # Generación de PDFs
│       └── templates/
│           ├── template1.js  # Ejecutivo Minimalista
│           ├── template2.js  # Detallado Profesional
│           └── template3.js  # Moderno Visual
├── src/
│   ├── components/
│   │   ├── Login.jsx         # Pantalla de login
│   │   ├── Dashboard.jsx     # Panel principal
│   │   ├── QuoteForm.jsx     # Formulario de cotización
│   │   └── QuoteList.jsx     # Lista de cotizaciones
│   ├── App.jsx               # Componente principal
│   └── main.jsx              # Entry point
└── package.json
```

## 🚀 Despliegue en Producción

### Opción 1: VPS (Recomendado)
```powershell
# Build del frontend
npm run build

# Configurar Nginx/Apache para servir archivos estáticos
# Ejecutar backend con PM2
pm2 start backend/server.js --name "integrational-quotes"
```

### Opción 2: Servicios en la Nube

**Frontend:** Vercel, Netlify
```powershell
npm run build
# Subir carpeta dist/
```

**Backend:** Railway, Render, Heroku
```powershell
# Conectar repositorio Git
# Configurar variables de entorno
# Deploy automático
```

## 🔒 Seguridad

- Cambiar `JWT_SECRET` en producción
- Usar HTTPS en producción
- Configurar CORS apropiadamente
- No exponer el archivo `.env`

## 🛠️ Scripts Disponibles

```powershell
npm run dev          # Ejecuta frontend y backend en desarrollo
npm run dev:frontend # Solo frontend
npm run dev:backend  # Solo backend
npm run build        # Build para producción
npm run preview      # Vista previa del build
```

## 📝 Personalización

### Cambiar colores corporativos:
Editar `tailwind.config.js`:
```javascript
colors: {
  'integrational-blue': '#0066cc',    // Tu color
  'integrational-dark': '#003366',    // Tu color oscuro
  'integrational-light': '#4d94ff',   // Tu color claro
}
```

### Modificar plantillas PDF:
Editar archivos en `backend/services/templates/`

## 🆘 Solución de Problemas

### Error de conexión con la base de datos:
- Verificar que SQLite esté instalado
- Revisar permisos de escritura en la carpeta

### Error al enviar emails:
- Verificar credenciales SMTP en `.env`
- Comprobar que el puerto no esté bloqueado
- Para Gmail, usar contraseña de aplicación

### Error al generar PDFs:
- Puppeteer requiere dependencias del sistema
- En Linux: `apt-get install -y libx11-xcb1 libxcomposite1`

## 📞 Soporte

Sistema desarrollado para Integrational
- Web: https://integracional3.com.mx
- Email: cotizaciones@integracional3.com.mx

## 📄 Licencia

Uso exclusivo para Integrational © 2025
