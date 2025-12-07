# Comparación: Schema Antiguo vs Nuevo

## 🔴 SCHEMA ANTIGUO (Multi-Hospital)

### Tablas:
- `municipios` - 67 municipios de Chihuahua
- `usuarios` - Donantes Y hospitales en misma tabla
- `hospitales` - Lista de hospitales
- `medicamentos` - Catálogo de medicinas
- `formularios` - Solicitudes de donación con hospital destino
- `invhospitales` - Inventario por hospital
- `invmed` - Stock por medicamento por hospital

### Problemas:
❌ Mezcla usuarios donantes con hospitales
❌ Complejo: múltiples hospitales
❌ Tabla "formularios" nombre confuso
❌ Inventario disperso por hospitales
❌ Triggers complejos para múltiples inventarios

---

## 🟢 SCHEMA NUEVO (Single Entity)

### Tablas:
- `municipios` - Mantiene los 67 municipios
- `usuarios` - Solo personas (donantes + admins) con campo `rol`
- `medicamentos` - Catálogo mejorado con descripción
- `donaciones` - Solicitudes de donación (antes "formularios")
- `inventario` - Stock único centralizado con lotes
- `movimientos` - Historial de entradas/salidas/ajustes

### Mejoras:
✅ **Separación clara**: usuarios vs roles
✅ **Simplicidad**: una sola entidad receptora
✅ **Trazabilidad**: tabla `movimientos` registra todo
✅ **Nombres claros**: "donaciones" en vez de "formularios"
✅ **Inventario por lote**: mejor control de caducidad
✅ **Trigger automático**: donación aceptada → inventario
✅ **Vistas útiles**: inventario actual, donaciones pendientes

---

## 📊 Comparación de Campos

### USUARIOS (antes y después)

**ANTES:**
```sql
name, lastname, tel, direcc, email, curp, id_municipio, 
id_hospital (NULL para donantes), password, rutaine
```

**AHORA:**
```sql
nombre, apellido, telefono, direccion, email, curp, id_municipio,
rol (ENUM: 'donor', 'admin'), password, ruta_ine, activo
```

### DONACIONES (antes: formularios)

**ANTES:**
```sql
id_medicamento, id_hospital, id_usuario, lote, caducidad, 
mgramos, cantidad, rutaimg, descripcion, estatus, active
```

**AHORA:**
```sql
id_medicamento, id_usuario, lote, fecha_caducidad, miligramos,
cantidad, ruta_imagen, descripcion, estatus, razon_rechazo,
revisado_por, fecha_revision
```

**Cambios clave:**
- ❌ Eliminado `id_hospital` (no hay múltiples destinos)
- ❌ Eliminado `active` (manejado por estatus)
- ✅ Agregado `razon_rechazo` (feedback al donante)
- ✅ Agregado `revisado_por` (auditoría)
- ✅ Agregado `fecha_revision` (trazabilidad)

---

## 🔄 Migracion de Datos (Si fuera necesario)

Si tuvieras datos del schema antiguo:

```sql
-- Migrar usuarios donantes
INSERT INTO usuarios (nombre, apellido, telefono, direccion, email, curp, id_municipio, rol, password, ruta_ine)
SELECT name, lastname, tel, direcc, email, curp, id_municipio, 'donor', password, rutaine
FROM usuarios_old
WHERE id_hospital IS NULL;

-- Migrar admins (antes usuarios de hospital)
INSERT INTO usuarios (nombre, apellido, telefono, direccion, email, id_municipio, rol, password)
SELECT name, '---', tel, direcc, email, id_municipio, 'admin', password
FROM usuarios_old
WHERE id_hospital IS NOT NULL;

-- Migrar formularios a donaciones
INSERT INTO donaciones (id_medicamento, id_usuario, lote, fecha_caducidad, miligramos, cantidad, ruta_imagen, descripcion, estatus)
SELECT id_medicamento, id_usuario, lote, caducidad, mgramos, cantidad, rutaimg, descripcion,
    CASE 
        WHEN estatus = 'Accepted' THEN 'aceptada'
        WHEN estatus = 'Rejected' THEN 'rechazada'
        ELSE 'pendiente'
    END
FROM formularios_old;
```

---

## 🎯 Nueva Funcionalidad

### Tabla MOVIMIENTOS (nueva)
Registra TODO cambio en inventario:
- **entrada**: Donación aceptada
- **salida**: Medicamento dispensado
- **ajuste**: Corrección manual de stock
- **vencido**: Marca como vencido y reduce stock

Campos: cantidad_anterior, cantidad_nueva, motivo, realizado_por

### Vistas útiles:
- `view_inventario_actual`: Stock vigente con alertas de caducidad
- `view_donaciones_pendientes`: Queue para admins

---

## 📝 Siguientes Pasos

1. ✅ Crear `schema-new.sql` 
2. ⬜ Crear modelos (models/) para cada tabla
3. ⬜ Crear controladores (controllers/)
4. ⬜ Crear rutas API (routes/)
5. ⬜ Migrar lógica de passport.js
6. ⬜ Implementar frontend React
