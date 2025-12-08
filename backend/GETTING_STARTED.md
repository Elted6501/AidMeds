# 🚀 Guía de Inicio Rápido - AidMeds Backend

## 1. Configurar Base de Datos

### Crear base de datos en MySQL:
```sql
CREATE DATABASE aidmeds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Importar schema:
```bash
mysql -u root -p aidmeds < db/schema.sql
```

## 2. Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password_mysql
DB_NAME=aidmeds

# Session
SESSION_SECRET=tu_secreto_aleatorio_aqui

# Cloudinary (obtener de https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# CORS
FRONTEND_URL=http://localhost:5173
```

## 3. Instalar Dependencias

```bash
cd backend
npm install
```

## 4. Iniciar Servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:3000**

## 5. Probar API

### Usando cURL:

#### Registrar usuario:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "telefono": "6141234567",
    "direccion": "Calle Principal #123",
    "id_municipio": 14
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

#### Obtener medicamentos:
```bash
curl http://localhost:3000/api/medicines
```

#### Ver perfil (requiere autenticación):
```bash
curl http://localhost:3000/api/users/profile \
  -b cookies.txt
```

### Usando Thunder Client (VS Code Extension)

1. Instalar extensión "Thunder Client"
2. Importar colección desde `API_DOCUMENTATION.md`
3. Probar endpoints con interfaz gráfica

## 6. Crear Usuario Admin

Conectar a MySQL y ejecutar:

```sql
-- Registrar usuario normal primero desde la API
-- Luego cambiar su rol a admin:
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'admin@example.com';
```

## 7. Verificar Que Todo Funciona

### Health Check:
```bash
curl http://localhost:3000/api/health
```

Debería responder:
```json
{
  "status": "ok",
  "message": "AidMeds API is running"
}
```

### Verificar Base de Datos:
```bash
curl http://localhost:3000/api/municipios
```

Debería devolver 67 municipios de Chihuahua.

## 8. Estructura de Carpetas Esperada

```
backend/
├── .env                    ← Crear este archivo
├── node_modules/           ← Creado por npm install
├── public/
│   └── files/             ← Archivos subidos aquí
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── db/
│   └── schema.sql
├── package.json
└── API_DOCUMENTATION.md
```

## 9. Comandos Útiles

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start

# Ver logs de MySQL
tail -f /var/log/mysql/error.log

# Reiniciar base de datos
mysql -u root -p aidmeds < db/schema.sql
```

## 10. Solución de Problemas Comunes

### Error: Cannot connect to MySQL
- Verificar que MySQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos existe

### Error: Port 3000 already in use
- Cambiar PORT en `.env`
- O matar proceso: `lsof -ti:3000 | xargs kill`

### Error: Session not working
- Verificar que SESSION_SECRET esté en `.env`
- Verificar que la tabla `sessions` exista en MySQL

### Error: File upload not working
- Verificar que carpeta `public/files/` exista
- Verificar permisos de escritura
- Verificar credenciales de Cloudinary

### Error: CORS blocked
- Verificar FRONTEND_URL en `.env`
- Asegurarse de que el frontend corre en ese puerto

## 11. Próximos Pasos

Una vez que el backend funcione:

1. ✅ Implementar frontend React
2. ✅ Conectar frontend con API
3. ✅ Agregar validación de formularios
4. ✅ Implementar notificaciones
5. ✅ Agregar tests
6. ✅ Desplegar a producción

---

## 📚 Recursos

- [Documentación API completa](./API_DOCUMENTATION.md)
- [Definición del proyecto](../PROJECT_SCOPE.md)
- [Comparación de schemas](../SCHEMA_COMPARISON.md)
- [Express.js Docs](https://expressjs.com/)
- [Passport.js Docs](http://www.passportjs.org/)

---

¿Problemas? Revisa los logs de consola y la documentación de la API.
