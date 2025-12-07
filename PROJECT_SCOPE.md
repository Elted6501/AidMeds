# AidMeds - Sistema de Economía Circular de Medicamentos

## 🎯 Concepto del Proyecto

Sistema que conecta **donantes** con **pacientes necesitados** a través de una entidad intermediaria (hospital/gobierno/ONG), asegurando el control de medicamentos que requieren receta médica.

### Ciclo de Vida:
```
1. DONANTE → Dona medicamentos sobrantes
2. ENTIDAD → Recibe, valida y almacena en inventario  
3. PACIENTE → Solicita medicamentos que necesita
4. VALIDACIÓN → Si es controlado, requiere receta médica
5. ENTREGA → Medicamento se entrega al paciente
```

---

## 👥 Tipos de Usuarios

### 1. **Usuario Público** (Donante y/o Paciente)
- **Como DONANTE puede:**
  - Registrarse en el sistema
  - Enviar solicitudes de donación
  - Subir foto del medicamento
  - Ver historial de sus donaciones
  - Ver estado de solicitudes (pendiente/aceptada/rechazada)

- **Como PACIENTE puede:**
  - Buscar medicamentos disponibles
  - Solicitar medicamentos
  - Subir receta médica (si es controlado)
  - Ver historial de medicamentos recibidos
  - Recibir notificaciones de aprobación

- **Mismo usuario puede ser ambos roles**

### 2. **Admin** (Personal de la entidad)
- **Gestión de Donaciones:**
  - Ver donaciones pendientes
  - Aceptar/rechazar donaciones
  - Ingresar medicamento físico al inventario

- **Gestión de Solicitudes de Pacientes:**
  - Ver solicitudes pendientes
  - Validar recetas médicas
  - Aprobar/rechazar entregas
  - Registrar entrega física

- **Gestión de Inventario:**
  - Ver stock actual
  - Medicamentos próximos a vencer
  - Ajustes manuales
  - Dar de baja medicamentos vencidos

### 3. **Super Admin** (Opcional)
- Gestionar usuarios admin
- Ver reportes globales
- Estadísticas del sistema
- Configuración general

---

## 🔄 Flujos Principales

### A. FLUJO DE DONACIÓN

```
1. Usuario crea cuenta como DONANTE
2. Envía solicitud de donación:
   - Selecciona medicamento del catálogo
   - Ingresa: lote, caducidad, cantidad, miligramos
   - Sube foto del medicamento
   - Descripción opcional
3. Admin revisa la solicitud:
   - ¿Medicamento en buen estado?
   - ¿Fecha de caducidad válida?
   - ¿Foto corresponde?
4. Admin ACEPTA:
   - Donante lleva físicamente el medicamento
   - Admin ingresa al inventario
   - Se registra movimiento de entrada
5. Admin RECHAZA:
   - Especifica motivo
   - Notifica al donante
```

### B. FLUJO DE SOLICITUD DE PACIENTE

```
1. Usuario crea cuenta como PACIENTE (o ya existe)
2. Busca medicamento en catálogo disponible
3. Solicita medicamento:
   - Selecciona cantidad necesaria
   - Si es CONTROLADO → Debe subir receta médica
   - Si es SIN RECETA → Solicitud directa
4. Admin revisa la solicitud:
   - Verifica disponibilidad en stock
   - Si requiere receta → Valida receta
   - Verifica que cantidad sea razonable
5. Admin APRUEBA:
   - Notifica al paciente
   - Paciente recoge medicamento
   - Admin registra entrega (movimiento de salida)
6. Admin RECHAZA:
   - Especifica motivo (receta inválida, stock insuficiente, etc.)
   - Notifica al paciente
```

---

## 🗄️ Estructura de Base de Datos Actualizada

### Tablas Principales:

#### **usuarios**
```sql
- id_usuario
- nombre, apellido
- email (único)
- password (hasheado)
- telefono
- direccion
- id_municipio
- rol: ENUM('user', 'admin', 'super_admin')
- activo
- created_at, updated_at
```

#### **donaciones**
```sql
- id_donacion
- id_donante (FK usuarios)
- id_medicamento (FK medicamentos)
- lote
- fecha_caducidad
- miligramos
- cantidad
- ruta_imagen (foto del medicamento)
- descripcion
- estatus: ENUM('pendiente', 'aceptada', 'rechazada', 'entregada')
- razon_rechazo
- revisado_por (FK usuarios admin)
- fecha_revision
- created_at
```

#### **solicitudes_paciente** (NUEVA)
```sql
- id_solicitud
- id_paciente (FK usuarios)
- id_medicamento (FK medicamentos)
- cantidad_solicitada
- ruta_receta (foto/PDF de receta médica - NULL si no requiere)
- motivo (descripción de por qué necesita el medicamento)
- estatus: ENUM('pendiente', 'aprobada', 'rechazada', 'entregada')
- razon_rechazo
- revisado_por (FK usuarios admin)
- fecha_revision
- fecha_entrega
- created_at
```

#### **medicamentos**
```sql
- id_medicamento
- nombre
- tipo: ENUM('sin_receta', 'con_receta')
- descripcion
- requiere_receta: BOOLEAN (TRUE si tipo='con_receta')
- activo
- created_at
```

#### **inventario**
```sql
- id_inventario
- id_medicamento
- lote
- fecha_caducidad
- miligramos
- cantidad_actual
- cantidad_inicial
- id_donacion (FK donaciones)
- fecha_ingreso
- updated_at
```

#### **movimientos**
```sql
- id_movimiento
- id_inventario
- tipo: ENUM('entrada_donacion', 'salida_paciente', 'ajuste', 'vencido')
- cantidad
- cantidad_anterior
- cantidad_nueva
- motivo
- id_donacion (FK - si es entrada)
- id_solicitud (FK - si es salida a paciente)
- realizado_por (FK usuarios admin)
- created_at
```

---

## 🔒 Validaciones y Reglas

### Medicamentos Con Receta:
1. **Con receta** → Requiere subir foto (JPG/PNG) o PDF de receta
2. Admin valida que:
   - Receta sea legible
   - Tenga fecha vigente (no mayor a 30 días)
   - Nombre del paciente coincida con usuario
   - Medicamento y dosis coincidan con receta
   - Cantidad solicitada sea razonable

### Límites y Restricciones:
- **Por ahora:** Sin límites de cantidad
- **Futuro:** Preparar estructura para límites por paciente/mes
- Medicamentos próximos a vencer (< 3 meses) se priorizan

### Entrega:
- **Presencial:** Paciente recoge en sede física
- Admin registra entrega y actualiza inventario
- Sin servicio de envío a domicilio (por ahora)

### Notificaciones:
- Email/SMS cuando donación es aceptada/rechazada
- Email/SMS cuando solicitud es aprobada
- Alerta cuando medicamento está listo para recoger

---

## 📊 Dashboards y Vistas

### Dashboard Público:
- Estadísticas generales (medicamentos donados/entregados)
- Medicamentos más necesitados
- Catálogo de medicamentos disponibles

### Dashboard Donante:
- Mis donaciones
- Estado de solicitudes
- Historial

### Dashboard Paciente:
- Medicamentos disponibles (búsqueda/filtros)
- Mis solicitudes
- Historial de medicamentos recibidos

### Dashboard Admin:
- Donaciones pendientes de revisión
- Solicitudes de pacientes pendientes
- Inventario actual
- Medicamentos próximos a vencer
- Recetas por validar

---

## 🚀 MVP (Producto Mínimo Viable)

### Fase 1 - Core Básico:
✅ Registro de usuarios (email + password)
✅ Donación de medicamentos
✅ Aceptar/rechazar donaciones
✅ Inventario básico

### Fase 2 - Solicitudes de Pacientes:
✅ Catálogo público de medicamentos disponibles
✅ Solicitudes de pacientes
✅ Subir receta si es controlado
✅ Aprobar/rechazar solicitudes

### Fase 3 - Mejoras Futuras:
⏳ Notificaciones por email/SMS
⏳ Reportes y estadísticas avanzadas
⏳ Alertas automáticas de vencimientos
⏳ Límites de cantidad por paciente/mes
⏳ Envío a domicilio
⏳ Verificación de identidad (CURP/INE) opcional

---

## ✅ Decisiones Finales

1. **Verificación de identidad:** ❌ NO requerido (CURP/INE eliminados)
2. **Receta médica:** ✅ Foto JPG/PNG o PDF, validez 30 días
3. **Entrega:** ✅ Recogen en sede física, sin envío a domicilio
4. **Límites:** ⏳ No por ahora, estructura preparada para futuro
5. **Usuario dual:** ✅ Misma cuenta puede donar Y recibir medicamentos

## 🎯 Definición Final

**Sistema simplificado de economía circular de medicamentos:**
- Registro simple: email + password + datos básicos
- Medicamentos: "sin receta" o "con receta"
- Usuario puede donar y recibir con misma cuenta
- Recetas aceptadas en foto (JPG/PNG) o PDF
- Entrega presencial en sede física
- Sin límites de cantidad (por ahora)

