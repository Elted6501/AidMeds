# 📡 API Documentation - AidMeds

Base URL: `http://localhost:5001/api`

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "password": "string (min 8 chars)",
  "telefono": "string",
  "direccion": "string",
  "id_municipio": "integer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": 1,
    "nombre": "John",
    "apellido": "Doe",
    "email": "john@example.com",
    "rol": "user"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as register

### Get Current User
```http
GET /api/auth/me
```
🔒 **Requires authentication**

**Response:**
```json
{
  "success": true,
  "user": {
    "id_usuario": 1,
    "nombre": "John",
    "apellido": "Doe",
    "email": "john@example.com",
    "rol": "user",
    "telefono": "1234567890",
    "direccion": "123 Street",
    "id_municipio": 1
  }
}
```

### Logout
```http
POST /api/auth/logout
```
🔒 **Requires authentication**

**Response:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

## 👤 User Endpoints

### Get Profile
```http
GET /api/users/profile
```
🔒 **Requires authentication**

**Response:** Same as GET /api/auth/me

### Update Profile
```http
PUT /api/users/profile
```
🔒 **Requires authentication**

**Body:**
```json
{
  "nombre": "string",
  "apellido": "string",
  "telefono": "string",
  "direccion": "string",
  "id_municipio": "integer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "user": { /* updated user data */ }
}
```

### Change Password
```http
PUT /api/users/password
```
🔒 **Requires authentication**

**Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string (min 8 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

---

## 💊 Medicine Endpoints

### Get All Medicines
```http
GET /api/medicines
```

**Query Parameters:**
- `tipo` (optional): `con_receta` | `sin_receta`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "medicamentos": [
    {
      "id_medicamento": 1,
      "nombre": "Paracetamol 500mg",
      "tipo": "sin_receta",
      "descripcion": "Analgésico y antipirético",
      "presentacion": "Tabletas",
      "cantidad_disponible": 100
    }
  ]
}
```

### Search Medicines
```http
GET /api/medicines/search?q=paracetamol
```

**Query Parameters:**
- `q` (required): Search query

**Response:** Same as Get All Medicines

### Get Medicine by ID
```http
GET /api/medicines/:id
```

**Response:**
```json
{
  "success": true,
  "medicamento": {
    "id_medicamento": 1,
    "nombre": "Paracetamol 500mg",
    "tipo": "sin_receta",
    "descripcion": "Analgésico y antipirético",
    "presentacion": "Tabletas",
    "cantidad_disponible": 100
  }
}
```

---

## 💝 Donation Endpoints

### Get Donations
```http
GET /api/donations
```
🔒 **Requires authentication**

**Query Parameters:**
- `estatus` (optional): `pendiente` | `aprobada` | `rechazada`

**Note:** Regular users see only their donations, admins see all

**Response:**
```json
{
  "success": true,
  "count": 5,
  "donaciones": [
    {
      "id_donacion": 1,
      "id_medicamento": 1,
      "nombre_medicamento": "Paracetamol 500mg",
      "cantidad": 50,
      "fecha_caducidad": "2025-12-31",
      "estatus": "pendiente",
      "imagen": "url_to_image",
      "observaciones": "En buen estado",
      "created_at": "2024-12-07T12:00:00Z"
    }
  ]
}
```

### Create Donation
```http
POST /api/donations
```
🔒 **Requires authentication**  
**Content-Type:** `multipart/form-data`

**Body:**
```
id_medicamento: integer
cantidad: integer
fecha_caducidad: date (YYYY-MM-DD)
observaciones: string (optional)
imagen: file (required)
```

**Response:**
```json
{
  "success": true,
  "message": "Donación creada exitosamente",
  "donacion": { /* donation data */ }
}
```

### Accept Donation (Admin)
```http
PUT /api/donations/:id/accept
```
🔒 **Requires authentication (admin)**

**Response:**
```json
{
  "success": true,
  "message": "Donación aceptada"
}
```

### Reject Donation (Admin)
```http
PUT /api/donations/:id/reject
```
🔒 **Requires authentication (admin)**

**Body:**
```json
{
  "motivo": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donación rechazada"
}
```

### Get Pending Donations (Admin)
```http
GET /api/donations/pending
```
🔒 **Requires authentication (admin)**

**Response:** Same as Get Donations

---

## 🏥 Request Endpoints

### Get Requests
```http
GET /api/requests
```
🔒 **Requires authentication**

**Query Parameters:**
- `estatus` (optional): `pendiente` | `aprobada` | `rechazada` | `entregada`

**Note:** Regular users see only their requests, admins see all

**Response:**
```json
{
  "success": true,
  "count": 3,
  "solicitudes": [
    {
      "id_solicitud": 1,
      "id_medicamento": 1,
      "nombre_medicamento": "Paracetamol 500mg",
      "cantidad_solicitada": 10,
      "justificacion": "Dolor de cabeza frecuente",
      "receta": "url_to_prescription",
      "estatus": "pendiente",
      "created_at": "2024-12-07T12:00:00Z"
    }
  ]
}
```

### Create Request
```http
POST /api/requests
```
🔒 **Requires authentication**  
**Content-Type:** `multipart/form-data`

**Body:**
```
id_medicamento: integer
cantidad_solicitada: integer
justificacion: string
receta: file (required if medicine tipo is "con_receta")
```

**Response:**
```json
{
  "success": true,
  "message": "Solicitud creada exitosamente",
  "solicitud": { /* request data */ }
}
```

### Approve Request (Admin)
```http
PUT /api/requests/:id/approve
```
🔒 **Requires authentication (admin)**

**Response:**
```json
{
  "success": true,
  "message": "Solicitud aprobada"
}
```

### Reject Request (Admin)
```http
PUT /api/requests/:id/reject
```
🔒 **Requires authentication (admin)**

**Body:**
```json
{
  "motivo": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Solicitud rechazada"
}
```

### Deliver Request (Admin)
```http
PUT /api/requests/:id/deliver
```
🔒 **Requires authentication (admin)**

**Response:**
```json
{
  "success": true,
  "message": "Solicitud marcada como entregada"
}
```

### Get Pending Requests (Admin)
```http
GET /api/requests/pending
```
🔒 **Requires authentication (admin)**

**Response:** Same as Get Requests

---

## 📦 Inventory Endpoints

### Get Inventory
```http
GET /api/inventory
```
🔒 **Requires authentication (admin)**

**Response:**
```json
{
  "success": true,
  "inventario": [
    {
      "id_inventario": 1,
      "id_medicamento": 1,
      "nombre_medicamento": "Paracetamol 500mg",
      "cantidad": 100,
      "fecha_caducidad": "2025-12-31",
      "lote": "LOT123",
      "disponible": true
    }
  ]
}
```

### Get Inventory Summary
```http
GET /api/inventory/summary
```
🔒 **Requires authentication**

**Response:**
```json
{
  "success": true,
  "resumen": {
    "total_medicamentos": 10,
    "total_unidades": 500,
    "proximos_vencer": 5,
    "vencidos": 2
  }
}
```

---

## 🏛️ Municipality Endpoints

### Get All Municipalities
```http
GET /api/municipios
```

**Response:**
```json
{
  "success": true,
  "municipios": [
    {
      "id_municipio": 1,
      "nombre": "Chihuahua"
    },
    {
      "id_municipio": 2,
      "nombre": "Juárez"
    }
  ]
}
```

### Get Municipality by ID
```http
GET /api/municipios/:id
```

**Response:**
```json
{
  "success": true,
  "municipio": {
    "id_municipio": 1,
    "nombre": "Chihuahua"
  }
}
```

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided" | "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (only in development)"
}
```

---

## 📝 Notes

1. **JWT Token**: Expires in 7 days. Store securely in localStorage
2. **File Uploads**: Maximum size 10MB for images
3. **Dates**: Use ISO 8601 format (YYYY-MM-DD)
4. **Pagination**: Not yet implemented (returns all results)
5. **Rate Limiting**: Not yet implemented

---

## 🧪 Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","apellido":"User","email":"test@example.com","password":"password123","telefono":"1234567890","direccion":"Test Address","id_municipio":1}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get medicines (with token)
curl http://localhost:5001/api/medicines \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript

```javascript
// Login
const response = await fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('token', token);

// Authenticated request
const medicines = await fetch('http://localhost:5001/api/medicines', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

**Last Updated:** December 7, 2024  
**API Version:** 1.0.0
