# AidMeds API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
La API utiliza sesiones con cookies. Después de login/register, las siguientes peticiones incluyen automáticamente las credenciales.

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "6141234567",
  "direccion": "Calle Principal #123",
  "id_municipio": 14
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Logout
```http
POST /api/auth/logout
```

### Get Current User
```http
GET /api/auth/me
```

---

## 👤 User Endpoints

### Get Profile
```http
GET /api/users/profile
Authorization: Required (session)
```

### Update Profile
```http
PUT /api/users/profile
Authorization: Required
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "telefono": "6141234567",
  "direccion": "Nueva Calle #456",
  "id_municipio": 14
}
```

### Update Password
```http
PUT /api/users/password
Authorization: Required
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

### Delete Account
```http
DELETE /api/users/profile
Authorization: Required
Content-Type: application/json

{
  "password": "password123"
}
```

---

## 💊 Medicine Endpoints

### Get All Medicines
```http
GET /api/medicines
Query params:
  - tipo: sin_receta | con_receta
  - activo: true | false
```

### Search Medicines
```http
GET /api/medicines/search?nombre=paracetamol
```

### Get Medicine Summary (with inventory)
```http
GET /api/medicines/summary
```

### Get Medicine by ID
```http
GET /api/medicines/:id
```

### Create Medicine (Admin only)
```http
POST /api/medicines
Authorization: Required (admin)
Content-Type: application/json

{
  "nombre": "Ibuprofeno 600mg",
  "tipo": "sin_receta",
  "descripcion": "Antiinflamatorio no esteroideo"
}
```

### Update Medicine (Admin only)
```http
PUT /api/medicines/:id
Authorization: Required (admin)
Content-Type: application/json

{
  "nombre": "Ibuprofeno 800mg",
  "tipo": "con_receta",
  "descripcion": "Antiinflamatorio no esteroideo de alta dosis"
}
```

### Deactivate Medicine (Admin only)
```http
DELETE /api/medicines/:id
Authorization: Required (admin)
```

---

## 🎁 Donation Endpoints

### Get All Donations
```http
GET /api/donations
Authorization: Required
Query params:
  - estatus: pendiente | aceptada | rechazada
  
Note: Usuarios regulares solo ven sus propias donaciones
      Admins ven todas las donaciones
```

### Get Pending Donations (Admin only)
```http
GET /api/donations/pending
Authorization: Required (admin)
```

### Get Donation Stats (Admin only)
```http
GET /api/donations/stats
Authorization: Required (admin)
```

### Get Donation by ID
```http
GET /api/donations/:id
Authorization: Required
```

### Create Donation
```http
POST /api/donations
Authorization: Required
Content-Type: multipart/form-data

Form data:
  - id_medicamento: number
  - lote: string
  - fecha_caducidad: YYYY-MM-DD
  - miligramos: number
  - cantidad: number
  - descripcion: string (optional)
  - imagen: file (JPG/PNG, max 5MB)
```

### Accept Donation (Admin only)
```http
PUT /api/donations/:id/accept
Authorization: Required (admin)
```

### Reject Donation (Admin only)
```http
PUT /api/donations/:id/reject
Authorization: Required (admin)
Content-Type: application/json

{
  "razon_rechazo": "Medicamento no apto para donación"
}
```

---

## 🏥 Patient Request Endpoints

### Get All Requests
```http
GET /api/requests
Authorization: Required
Query params:
  - estatus: pendiente | aprobada | rechazada | entregada
  
Note: Usuarios regulares solo ven sus propias solicitudes
      Admins ven todas las solicitudes
```

### Get Pending Requests (Admin only)
```http
GET /api/requests/pending
Authorization: Required (admin)
```

### Get Request Stats (Admin only)
```http
GET /api/requests/stats
Authorization: Required (admin)
```

### Get Request by ID
```http
GET /api/requests/:id
Authorization: Required
```

### Create Request
```http
POST /api/requests
Authorization: Required
Content-Type: multipart/form-data

Form data:
  - id_medicamento: number
  - cantidad_solicitada: number
  - motivo: string
  - receta: file (JPG/PNG/PDF, max 5MB) - OBLIGATORIO si medicamento requiere receta
```

### Approve Request (Admin only)
```http
PUT /api/requests/:id/approve
Authorization: Required (admin)
```

### Reject Request (Admin only)
```http
PUT /api/requests/:id/reject
Authorization: Required (admin)
Content-Type: application/json

{
  "razon_rechazo": "Receta no válida"
}
```

### Deliver Request (Admin only)
```http
PUT /api/requests/:id/deliver
Authorization: Required (admin)

Note: Esto registra la entrega física y actualiza el inventario automáticamente
```

---

## 📦 Inventory Endpoints

### Get All Inventory (Admin only)
```http
GET /api/inventory
Authorization: Required (admin)
```

### Get Inventory Summary
```http
GET /api/inventory/summary
Authorization: Required
```

### Get Expiring Medicines
```http
GET /api/inventory/expiring
Authorization: Required
Query params:
  - dias: number (default: 90)
```

### Get Expired Medicines
```http
GET /api/inventory/expired
Authorization: Required
```

### Get Inventory Stats (Admin only)
```http
GET /api/inventory/stats
Authorization: Required (admin)
```

### Get Inventory by Medicine
```http
GET /api/inventory/medicine/:id
Authorization: Required
```

### Adjust Inventory (Admin only)
```http
PUT /api/inventory/:id/adjust
Authorization: Required (admin)
Content-Type: application/json

{
  "cantidad_nueva": 50,
  "motivo": "Corrección de conteo físico"
}
```

### Mark as Expired (Admin only)
```http
PUT /api/inventory/:id/expire
Authorization: Required (admin)
```

---

## 🌎 Municipio Endpoints

### Get All Municipios
```http
GET /api/municipios
```

### Get Municipio by ID
```http
GET /api/municipios/:id
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Notes

1. **File Uploads**: Use `multipart/form-data` for endpoints that accept files
2. **Authentication**: After login, session cookie is set automatically
3. **Admin Actions**: Routes marked with "(Admin only)" require admin or super_admin role
4. **Automatic Triggers**: 
   - Accepting a donation automatically adds it to inventory
   - Delivering a request automatically reduces inventory (FIFO)
5. **CORS**: Frontend must be on `http://localhost:5173` or update FRONTEND_URL in `.env`
