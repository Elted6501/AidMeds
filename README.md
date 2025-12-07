# 🏥 AidMeds - Sistema de Gestión de Medicamentos

Plataforma web para gestionar donaciones y distribución de medicamentos en comunidades.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 📖 Descripción

**AidMeds** conecta a donantes de medicamentos con personas que los necesitan, facilitando la economía circular de medicamentos a través de una organización coordinadora.

### Flujo del Sistema

1. **Donantes** registran medicamentos disponibles con foto y fecha de caducidad
2. **Administradores** revisan y aprueban/rechazan donaciones
3. **Pacientes** solicitan medicamentos (con receta si es necesario)
4. **Administradores** aprueban solicitudes y gestionan entregas
5. **Recolección física** en sede de la organización

---

## ✨ Características

- 🔐 **Autenticación JWT** - Segura y stateless
- 👥 **Roles de usuario** - Usuario regular y Administrador
- 💊 **Catálogo de medicamentos** - Con/sin receta
- 💝 **Sistema de donaciones** - Con imágenes y seguimiento
- 🏥 **Sistema de solicitudes** - Con recetas médicas
- 📦 **Gestión de inventario** - Control de stock y caducidad
- 🏛️ **Multi-municipio** - Chihuahua, México
- 📱 **Responsive design** - Funciona en móvil y desktop

---

## 🚀 Inicio Rápido

### Opción 1: Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd AidMeds

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Iniciar servicios
docker-compose up -d

# 4. Esperar ~30 segundos para inicialización
docker-compose logs -f

# 5. Abrir navegador
open http://localhost:5173
```

### Opción 2: Local

```bash
# 1. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 2. Configurar backend
cd backend
cp .env.example .env
# Editar .env

# 3. Crear base de datos
mysql -u root -p -e "CREATE DATABASE aidmeds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p aidmeds < db/schema.sql

# 4. Iniciar backend
npm run dev

# 5. Iniciar frontend (nueva terminal)
cd frontend
npm run dev
```

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express** - Servidor API REST
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación stateless
- **bcryptjs** - Encriptación de contraseñas
- **Cloudinary** - Almacenamiento de imágenes
- **Multer** - Manejo de archivos

### Frontend
- **React 19** - Framework UI
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos utility-first
- **Vite** - Build tool

### Base de Datos
- **MySQL 8.0** - Con UTF-8mb4
- **7 Tablas** - Usuarios, medicamentos, donaciones, solicitudes, inventario

---

## 📁 Estructura del Proyecto

```
AidMeds/
├── backend/                 # API REST
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # JWT, uploads
│   │   ├── models/         # Modelos de datos
│   │   ├── routes/         # Endpoints API
│   │   └── server.js       # Servidor Express
│   ├── db/
│   │   └── schema.sql      # Esquema de base de datos
│   └── package.json
│
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── contexts/       # AuthContext
│   │   ├── pages/          # Páginas de la app
│   │   ├── services/       # Servicios API
│   │   └── App.jsx
│   └── package.json
│
├── docker-compose.yml       # Configuración Docker
├── API_DOCUMENTATION.md     # Documentación de API
├── FRONTEND_DOCUMENTATION.md # Documentación de Frontend
└── README.md
```

---

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para autenticación:

- **Registro/Login** retorna un token JWT
- **Token** se almacena en `localStorage`
- **Todas las peticiones** incluyen `Authorization: Bearer <token>`
- **Token expira** en 7 días
- **Roles:** `user` (usuario regular) y `admin` (administrador)

---

## 📡 API Endpoints

Consulta [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) para la documentación completa.

### Principales Endpoints

```
Auth
  POST   /api/auth/register      - Registrar usuario
  POST   /api/auth/login         - Iniciar sesión
  GET    /api/auth/me            - Obtener usuario actual

Medicines
  GET    /api/medicines          - Listar medicamentos
  GET    /api/medicines/:id      - Obtener medicamento

Donations
  GET    /api/donations          - Listar donaciones
  POST   /api/donations          - Crear donación

Requests
  GET    /api/requests           - Listar solicitudes
  POST   /api/requests           - Crear solicitud
```

---

## 🎨 Frontend

Consulta [`FRONTEND_DOCUMENTATION.md`](./FRONTEND_DOCUMENTATION.md) para guía completa.

### Páginas Disponibles

- `/` - Página principal
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/medicines` - Catálogo de medicamentos
- `/donate` - Donar medicamentos
- `/my-donations` - Mis donaciones
- `/request` - Solicitar medicamentos
- `/my-requests` - Mis solicitudes
- `/profile` - Perfil de usuario
- `/admin` - Panel de administración (solo admins)

---

## ⚙️ Configuración

### Variables de Entorno Backend

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=aidmeds

# JWT
JWT_SECRET=your_super_secure_secret_key_here

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:5173
```

### Variables de Entorno Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

**Nota:** Para Docker, el frontend se construye con la URL del API y se sirve con Vite preview server.

---

## 🐳 Docker

### Servicios

- **MySQL** - Base de datos (puerto 3306)
- **Backend** - API REST (puerto 5000)
- **Frontend** - App React (puerto 5173)

### Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reiniciar servicio
docker-compose restart backend

# Detener servicios
docker-compose down

# Reiniciar todo (eliminar datos)
docker-compose down -v
docker-compose up -d
```

**Nota:** El frontend usa Vite preview server. Para producción de alto tráfico, considera desplegar en Vercel, Netlify, o usar nginx.

---

## 🗄️ Base de Datos

### Tablas Principales

- `usuarios` - Usuarios del sistema
- `medicamentos` - Catálogo de medicamentos
- `donaciones` - Donaciones de usuarios
- `solicitudes_paciente` - Solicitudes de medicamentos
- `inventario` - Control de stock
- `movimientos` - Historial de inventario
- `municipios` - Municipios de Chihuahua

### Crear Base de Datos

```bash
mysql -u root -p -e "CREATE DATABASE aidmeds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p aidmeds < backend/db/schema.sql
```

---

## 🧪 Testing

### Verificar Backend

```bash
# Healthcheck
curl http://localhost:5000/api/medicines

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Verificar Frontend

1. Abrir http://localhost:5173
2. Registrarse con un nuevo usuario
3. Verificar que se muestre el nombre en la navbar
4. Navegar a "Mis Donaciones"
5. Verificar que no hay errores 401

---

## 📝 Desarrollo

### Agregar Nueva Página

1. Crear componente en `frontend/src/pages/`
2. Importar en `App.jsx`
3. Agregar ruta con o sin `ProtectedRoute`

```javascript
// App.jsx
import MyNewPage from './pages/MyNewPage';

<Route 
  path="/new-page" 
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  } 
/>
```

### Agregar Nuevo Endpoint

1. Crear función en `backend/src/controllers/`
2. Agregar ruta en `backend/src/routes/`
3. Agregar servicio en `frontend/src/services/`

---

## 🚢 Deployment

### Backend (Node.js)

- Heroku
- AWS EC2
- Digital Ocean
- Railway
- Render

### Frontend (React)

- Vercel (recomendado)
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

### Base de Datos

- AWS RDS
- PlanetScale
- Digital Ocean Managed Database
- Railway Database

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT tokens con expiración
- ✅ Validación de entrada
- ✅ SQL injection protection
- ✅ CORS configurado
- ✅ HTTPS recomendado en producción

---

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

Para preguntas o soporte, consulta la documentación:
- [API Documentation](./API_DOCUMENTATION.md)
- [Frontend Documentation](./FRONTEND_DOCUMENTATION.md)

---

## 🙏 Agradecimientos

Gracias por usar AidMeds para ayudar a tu comunidad a acceder a medicamentos esenciales.

**¡Juntos podemos hacer la diferencia! 💊❤️**

---

**Versión:** 1.0.0  
**Última actualización:** Diciembre 7, 2024
