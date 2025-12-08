-- AidMeds - Sistema de Economía Circular de Medicamentos
-- Versión Final Simplificada

-- Set charset for this session
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS movimientos;
DROP TABLE IF EXISTS solicitudes_paciente;
DROP TABLE IF EXISTS inventario;
DROP TABLE IF EXISTS donaciones;
DROP TABLE IF EXISTS medicamentos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS municipios;

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Municipios de Chihuahua
CREATE TABLE municipios (
    id_municipio INT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuarios (pueden ser donantes Y pacientes con misma cuenta)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    id_municipio INT NOT NULL,
    rol ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
    activo BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_municipio) REFERENCES municipios(id_municipio),
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Catálogo de Medicamentos
CREATE TABLE medicamentos (
    id_medicamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo ENUM('sin_receta', 'con_receta') NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Donaciones (usuarios donan medicamentos sobrantes)
CREATE TABLE donaciones (
    id_donacion INT AUTO_INCREMENT PRIMARY KEY,
    id_donante INT NOT NULL,
    id_medicamento INT NOT NULL,
    lote VARCHAR(50) COMMENT 'Número de lote (opcional)',
    fecha_caducidad DATE NOT NULL,
    presentacion ENUM('tableta', 'capsula', 'jarabe', 'suspension', 'ampolleta', 'crema', 'gel', 'ungüento', 'supositorio', 'ovulo', 'parche', 'inhalador', 'solucion', 'polvo') NOT NULL COMMENT 'Forma farmacéutica del medicamento',
    miligramos INT NOT NULL COMMENT 'Concentración por unidad (mg)',
    cantidad INT NOT NULL COMMENT 'Número de unidades donadas',
    ruta_imagen VARCHAR(255),
    estatus ENUM('pendiente', 'aceptada', 'rechazada', 'entregada') NOT NULL DEFAULT 'pendiente',
    razon_rechazo TEXT,
    revisado_por INT,
    fecha_revision DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_donante) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento),
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id_usuario),
    INDEX idx_estatus (estatus),
    INDEX idx_donante (id_donante),
    INDEX idx_fecha_caducidad (fecha_caducidad),
    INDEX idx_created (created_at),
    INDEX idx_presentacion (presentacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Solicitudes de Pacientes (usuarios solicitan medicamentos)
CREATE TABLE solicitudes_paciente (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_medicamento INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    ruta_receta VARCHAR(255) COMMENT 'Foto/PDF de receta (solo si requiere)',
    motivo TEXT COMMENT 'Por qué necesita el medicamento',
    estatus ENUM('pendiente', 'aprobada', 'rechazada', 'entregada') NOT NULL DEFAULT 'pendiente',
    razon_rechazo TEXT,
    revisado_por INT,
    fecha_revision DATETIME,
    fecha_entrega DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento),
    FOREIGN KEY (revisado_por) REFERENCES usuarios(id_usuario),
    INDEX idx_estatus (estatus),
    INDEX idx_paciente (id_paciente),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inventario (stock actual por lote)
CREATE TABLE inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_medicamento INT NOT NULL,
    lote VARCHAR(50),
    fecha_caducidad DATE NOT NULL,
    presentacion ENUM('tableta', 'capsula', 'jarabe', 'suspension', 'ampolleta', 'crema', 'gel', 'ungüento', 'supositorio', 'ovulo', 'parche', 'inhalador', 'solucion', 'polvo') NOT NULL,
    miligramos INT NOT NULL,
    cantidad_actual INT NOT NULL DEFAULT 0,
    cantidad_inicial INT NOT NULL,
    id_donacion INT COMMENT 'Donación que originó este lote',
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id_medicamento),
    FOREIGN KEY (id_donacion) REFERENCES donaciones(id_donacion),
    INDEX idx_medicamento (id_medicamento),
    INDEX idx_fecha_caducidad (fecha_caducidad),
    INDEX idx_lote (lote),
    INDEX idx_cantidad (cantidad_actual),
    INDEX idx_presentacion (presentacion),
    UNIQUE KEY unique_lote_medicamento (id_medicamento, lote)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Movimientos de Inventario (trazabilidad completa)
CREATE TABLE movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_inventario INT NOT NULL,
    tipo ENUM('entrada_donacion', 'salida_paciente', 'ajuste', 'vencido') NOT NULL,
    cantidad INT NOT NULL,
    cantidad_anterior INT NOT NULL,
    cantidad_nueva INT NOT NULL,
    motivo TEXT,
    id_donacion INT COMMENT 'Si tipo=entrada_donacion',
    id_solicitud INT COMMENT 'Si tipo=salida_paciente',
    realizado_por INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inventario) REFERENCES inventario(id_inventario),
    FOREIGN KEY (id_donacion) REFERENCES donaciones(id_donacion),
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_paciente(id_solicitud),
    FOREIGN KEY (realizado_por) REFERENCES usuarios(id_usuario),
    INDEX idx_tipo (tipo),
    INDEX idx_inventario (id_inventario),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar Municipios de Chihuahua
INSERT INTO municipios (id_municipio, nombre) VALUES
(1, 'Ahumada'), (2, 'Aldama'), (3, 'Allende'), (4, 'Aquiles Serdán'), (5, 'Ascensión'),
(6, 'Bachíniva'), (7, 'Balleza'), (8, 'Batopilas'), (9, 'Bocoyna'), (10, 'Buenaventura'),
(11, 'Camargo'), (12, 'Carichí'), (13, 'Casas Grandes'), (14, 'Chihuahua'), (15, 'Coronado'),
(16, 'Coyame del Sotol'), (17, 'Cuauhtémoc'), (18, 'Cusihuiriachi'), (19, 'Delicias'),
(20, 'Dr. Belisario Domínguez'), (21, 'Galeana'), (22, 'Gómez Farías'), (23, 'Gran Morelos'),
(24, 'Guachochi'), (25, 'Guadalupe'), (26, 'Guadalupe y Calvo'), (27, 'Guazapares'),
(28, 'Guerrero'), (29, 'Hidalgo del Parral'), (30, 'Huejotitán'), (31, 'Ignacio Zaragoza'),
(32, 'Janos'), (33, 'Jiménez'), (34, 'Juárez'), (35, 'Julimes'), (36, 'López'),
(37, 'Madera'), (38, 'Maguarichi'), (39, 'Manuel Benavides'), (40, 'Matachí'),
(41, 'Matamoros'), (42, 'Meoqui'), (43, 'Morelos'), (44, 'Moris'), (45, 'Namiquipa'),
(46, 'Nonoava'), (47, 'Nuevo Casas Grandes'), (48, 'Ocampo'), (49, 'Ojinaga'),
(50, 'Praxedis G. Guerrero'), (51, 'Riva Palacio'), (52, 'Rosales'), (53, 'Rosario'),
(54, 'San Francisco de Borja'), (55, 'San Francisco de Conchos'), (56, 'San Francisco del Oro'),
(57, 'Santa Bárbara'), (58, 'Santa Isabel'), (59, 'Santiago de Chuco'), (60, 'Saucillo'),
(61, 'Temósachic'), (62, 'Urique'), (63, 'Uruachi'), (64, 'Valle de Zaragoza'),
(65, 'Valle de Allende'), (66, 'Villa Ahumada'), (67, 'Zaragoza');

-- Insertar Medicamentos Comunes
INSERT INTO medicamentos (nombre, tipo, descripcion) VALUES
('Paracetamol', 'sin_receta', 'Analgésico y antipirético de venta libre'),
('Ibuprofeno', 'sin_receta', 'Antiinflamatorio no esteroideo'),
('Omeprazol', 'sin_receta', 'Inhibidor de la bomba de protones'),
('Losartán', 'con_receta', 'Antihipertensivo'),
('Metoprolol', 'con_receta', 'Betabloqueador para hipertensión'),
('Metformina', 'con_receta', 'Antidiabético oral'),
('Atorvastatina', 'con_receta', 'Hipolipemiante, control de colesterol'),
('Ácido Acetilsalicílico', 'sin_receta', 'Antiagregante plaquetario'),
('Insulina NPH', 'con_receta', 'Antidiabético inyectable'),
('Insulina Glargina', 'con_receta', 'Antidiabético inyectable de acción prolongada'),
('Diclofenaco', 'sin_receta', 'Antiinflamatorio no esteroideo'),
('Complejo B', 'sin_receta', 'Suplemento vitamínico');

-- Insertar Usuario Admin Inicial (password: 123456789)
INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, id_municipio, rol) VALUES
('Admin', 'Principal', 'admin@example.com', '$2a$10$PY9nCeyB359RaraFor3VZ.gUxhlZQJmBhD0/aO3IHCMw231lU0wMa', '1234567890', 'Calle Falsa 123', 14, 'admin');

-- ============================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================

-- Trigger: Agregar a inventario cuando donación es aceptada
DELIMITER //
CREATE TRIGGER after_donacion_aceptada
AFTER UPDATE ON donaciones
FOR EACH ROW
BEGIN
    DECLARE inv_id INT;
    DECLARE lote_generado VARCHAR(50);
    
    IF NEW.estatus = 'aceptada' AND OLD.estatus != 'aceptada' THEN
        -- Generar lote automático si es NULL
        IF NEW.lote IS NULL THEN
            SET lote_generado = CONCAT('AUTO-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', NEW.id_donacion);
        ELSE
            SET lote_generado = NEW.lote;
        END IF;
        
        -- Intentar insertar o actualizar inventario
        INSERT INTO inventario (
            id_medicamento,
            lote,
            fecha_caducidad,
            presentacion,
            miligramos,
            cantidad_actual,
            cantidad_inicial,
            id_donacion,
            fecha_ingreso
        ) VALUES (
            NEW.id_medicamento,
            lote_generado,
            NEW.fecha_caducidad,
            NEW.presentacion,
            NEW.miligramos,
            NEW.cantidad,
            NEW.cantidad,
            NEW.id_donacion,
            NOW()
        )
        ON DUPLICATE KEY UPDATE
            cantidad_actual = cantidad_actual + NEW.cantidad,
            cantidad_inicial = cantidad_inicial + NEW.cantidad;
        
        -- Obtener ID del inventario
        SET inv_id = LAST_INSERT_ID();
        IF inv_id = 0 THEN
            SELECT id_inventario INTO inv_id 
            FROM inventario 
            WHERE id_medicamento = NEW.id_medicamento AND lote = lote_generado;
        END IF;
        
        -- Registrar movimiento de entrada
        INSERT INTO movimientos (
            id_inventario,
            tipo,
            cantidad,
            cantidad_anterior,
            cantidad_nueva,
            motivo,
            id_donacion,
            realizado_por
        ) VALUES (
            inv_id,
            'entrada_donacion',
            NEW.cantidad,
            0,
            NEW.cantidad,
            CONCAT('Donación aceptada #', NEW.id_donacion),
            NEW.id_donacion,
            NEW.revisado_por
        );
    END IF;
END;
//
DELIMITER ;

-- Trigger: Reducir inventario cuando solicitud es entregada
DELIMITER //
CREATE TRIGGER after_solicitud_entregada
AFTER UPDATE ON solicitudes_paciente
FOR EACH ROW
BEGIN
    DECLARE inv_id INT;
    DECLARE cant_actual INT;
    
    IF NEW.estatus = 'entregada' AND OLD.estatus != 'entregada' THEN
        -- Buscar inventario con stock disponible (FIFO - primero en expirar)
        SELECT id_inventario, cantidad_actual INTO inv_id, cant_actual
        FROM inventario
        WHERE id_medicamento = NEW.id_medicamento
          AND cantidad_actual >= NEW.cantidad_solicitada
        ORDER BY fecha_caducidad ASC
        LIMIT 1;
        
        IF inv_id IS NOT NULL THEN
            -- Actualizar cantidad en inventario
            UPDATE inventario
            SET cantidad_actual = cantidad_actual - NEW.cantidad_solicitada
            WHERE id_inventario = inv_id;
            
            -- Registrar movimiento de salida
            INSERT INTO movimientos (
                id_inventario,
                tipo,
                cantidad,
                cantidad_anterior,
                cantidad_nueva,
                motivo,
                id_solicitud,
                realizado_por
            ) VALUES (
                inv_id,
                'salida_paciente',
                NEW.cantidad_solicitada,
                cant_actual,
                cant_actual - NEW.cantidad_solicitada,
                CONCAT('Entregado a paciente - Solicitud #', NEW.id_solicitud),
                NEW.id_solicitud,
                NEW.revisado_por
            );
        END IF;
    END IF;
END;
//
DELIMITER ;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Inventario actual con alertas de caducidad
CREATE VIEW view_inventario_disponible AS
SELECT 
    i.id_inventario,
    m.nombre AS medicamento,
    m.tipo,
    i.lote,
    i.fecha_caducidad,
    i.presentacion,
    i.miligramos,
    i.cantidad_actual,
    i.fecha_ingreso,
    CASE 
        WHEN i.fecha_caducidad < CURDATE() THEN 'vencido'
        WHEN i.fecha_caducidad < DATE_ADD(CURDATE(), INTERVAL 3 MONTH) THEN 'por_vencer'
        ELSE 'vigente'
    END AS estado_caducidad,
    DATEDIFF(i.fecha_caducidad, CURDATE()) AS dias_para_vencer
FROM inventario i
JOIN medicamentos m ON i.id_medicamento = m.id_medicamento
WHERE i.cantidad_actual > 0
ORDER BY i.fecha_caducidad ASC;

-- Vista: Donaciones pendientes para admin
CREATE VIEW view_donaciones_pendientes AS
SELECT 
    d.id_donacion,
    m.nombre AS medicamento,
    m.tipo,
    CONCAT(u.nombre, ' ', u.apellido) AS donante,
    u.email AS donante_email,
    u.telefono AS donante_telefono,
    d.lote,
    d.fecha_caducidad,
    d.presentacion,
    d.miligramos,
    d.cantidad,
    d.ruta_imagen,
    d.created_at AS fecha_solicitud,
    DATEDIFF(CURDATE(), d.created_at) AS dias_pendiente
FROM donaciones d
JOIN medicamentos m ON d.id_medicamento = m.id_medicamento
JOIN usuarios u ON d.id_donante = u.id_usuario
WHERE d.estatus = 'pendiente'
ORDER BY d.created_at ASC;

-- Vista: Solicitudes de pacientes pendientes
CREATE VIEW view_solicitudes_pendientes AS
SELECT 
    s.id_solicitud,
    m.nombre AS medicamento,
    m.tipo,
    CONCAT(u.nombre, ' ', u.apellido) AS paciente,
    u.email AS paciente_email,
    u.telefono AS paciente_telefono,
    s.cantidad_solicitada,
    s.ruta_receta,
    s.motivo,
    s.created_at AS fecha_solicitud,
    DATEDIFF(CURDATE(), s.created_at) AS dias_pendiente
FROM solicitudes_paciente s
JOIN medicamentos m ON s.id_medicamento = m.id_medicamento
JOIN usuarios u ON s.id_paciente = u.id_usuario
WHERE s.estatus = 'pendiente'
ORDER BY s.created_at ASC;

-- Vista: Resumen de inventario por medicamento
CREATE VIEW view_resumen_inventario AS
SELECT 
    m.id_medicamento,
    m.nombre AS medicamento,
    m.tipo,
    COALESCE(SUM(i.cantidad_actual), 0) AS cantidad_total,
    COUNT(DISTINCT i.lote) AS lotes_disponibles,
    MIN(i.fecha_caducidad) AS proxima_caducidad
FROM medicamentos m
LEFT JOIN inventario i ON m.id_medicamento = i.id_medicamento AND i.cantidad_actual > 0
WHERE m.activo = TRUE
GROUP BY m.id_medicamento, m.nombre, m.tipo
ORDER BY cantidad_total DESC;
