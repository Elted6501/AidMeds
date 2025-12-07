# AidMeds - Sistema de Gestión de Medicamentos

Sistema completo para gestionar donaciones y solicitudes de medicamentos con arquitectura frontend/backend separada.

---

## 📋 Tabla de Contenidos
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Características Principales](#características-principales)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Uso con Docker](#uso-con-docker)
7. [API Endpoints](#api-endpoints)

---

## 📖 Descripción del Proyecto

**AidMeds** es una plataforma web para gestionar el ciclo completo de donaciones y distribución de medicamentos. Una organización (hospital, gobierno u ONG) recibe donaciones de medicamentos de usuarios y los redistribuye a personas que los necesitan.

### Flujo Principal:
1. **Usuarios donan** medicamentos con imagen y fecha de caducidad
2. **Administradores revisan** y aprueban/rechazan donaciones
3. **Usuarios solicitan** medicamentos (con receta si es necesario)
4. **Administradores gestionan** solicitudes y entregas
5. **Recolección física** en sede de la organización

---

## ✨ Características Principales

### Para Usuarios:
- ✅ Registro y autenticación con JWT
- 💊 Búsqueda y visualización de medicamentos disponibles
- 📦 Donación de medicamentos con upload de imágenes
- 🏥 Solicitud de medicamentos (con/sin receta)
- 📊 Historial de donaciones y solicitudes
- 👤 Gestión de perfil personal

### Para Administradores:
- 📈 Dashboard con estadísticas en tiempo real
- ✔️ Aprobación/rechazo de donaciones
- ✔️ Gestión de solicitudes de medicamentos
- 💊 CRUD completo de medicamentos
- 📋 Filtrado por estado (pendiente, aprobada, etc.)
- 🔍 Visualización de recetas médicas

---

## 🛠️ Tecnologías Utilizadas

### Backend:
- Node.js + Express.js
- MySQL 8.0 con mysql2
- JWT para autenticación
- Multer para manejo de archivos
- Bcrypt para encriptación

### Frontend:
- React 19 con Vite
- React Router v7
- Axios para peticiones HTTP
- Tailwind CSS (via CDN)
- Context API para estado global

### DevOps:
- Docker + Docker Compose
- MySQL Container
- Volúmenes persistentes

---

## 📁 Estructura del Proyecto

```
AidMeds/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración (DB, JWT)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Auth, uploads, errores
│   │   ├── models/         # Modelos de BD
│   │   ├── routes/         # Rutas de API
│   │   └── index.js        # Servidor Express
│   ├── uploads/            # Imágenes subidas
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, ProtectedRoute
│   │   ├── contexts/       # AuthContext
│   │   ├── pages/          # 10 páginas principales
│   │   ├── services/       # API services (axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docker-compose.yml
└── docker-start.sh
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos:
- Node.js 18+ 
- npm o yarn
- MySQL 8.0 (o Docker)

### Método 1: Docker (Recomendado)

```bash
# Iniciar todos los servicios
./docker-start.sh

# O manualmente:
docker-compose up -d
```

**Servicios disponibles:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MySQL: localhost:3307

### Método 2: Manual

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

### Autenticación:
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (retorna JWT)
- `GET /api/auth/profile` - Obtener perfil [Auth]

### Medicamentos:
- `GET /api/medicamentos` - Listar todos
- `POST /api/medicamentos` - Crear [Admin]
- `PUT /api/medicamentos/:id` - Actualizar [Admin]
- `DELETE /api/medicamentos/:id` - Eliminar [Admin]

### Donaciones:
- `GET /api/donaciones` - Listar todas [Admin]
- `GET /api/donaciones/mis` - Mis donaciones [Auth]
- `POST /api/donaciones` - Crear donación [Auth]
- `PUT /api/donaciones/:id` - Actualizar estado [Admin]

### Solicitudes:
- `GET /api/solicitudes` - Listar todas [Admin]
- `GET /api/solicitudes/mis` - Mis solicitudes [Auth]
- `POST /api/solicitudes` - Crear solicitud [Auth]
- `PUT /api/solicitudes/:id` - Actualizar estado [Admin]

---

## 👥 Usuarios y Roles

### Usuario de Prueba:
```
Email: admin@aidmeds.com
Password: admin123
Rol: admin
```

### Permisos:
| Acción | Usuario | Admin |
|--------|---------|-------|
| Ver medicamentos | ✅ | ✅ |
| Donar medicamentos | ✅ | ✅ |
| Solicitar medicamentos | ✅ | ✅ |
| Aprobar donaciones | ❌ | ✅ |
| Gestionar solicitudes | ❌ | ✅ |
| CRUD medicamentos | ❌ | ✅ |

---

## 📝 Notas

### Medicamentos con Receta:
- Tipo: `con_receta` o `sin_receta`
- Los medicamentos `con_receta` requieren subir receta médica
- El administrador puede ver la receta antes de aprobar

### Flujo de Estados:
```
pendiente → aprobada → entregada
          ↘ rechazada
```

---

## 🔧 Scripts Disponibles

**Backend:**
```bash
npm run dev      # Servidor con nodemon
npm start        # Servidor producción
```

**Frontend:**
```bash
npm run dev      # Dev server (Vite)
npm run build    # Build producción
```

---

**¿Preguntas?** Abre un issue en el repositorio.
