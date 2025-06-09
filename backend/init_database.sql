-- Crear base de datos
CREATE DATABASE IF NOT EXISTS fruteria_nina;
USE fruteria_nina;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'operador', 'cajero') DEFAULT 'operador',
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(150),
    direccion TEXT,
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla productos actualizada para inventario
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria ENUM('frutas', 'verduras', 'otros') NOT NULL,
    unidad ENUM('kg', 'unidad', 'litro', 'gramo') DEFAULT 'kg',
    stock_actual DECIMAL(10,3) DEFAULT 0,
    stock_minimo DECIMAL(10,3) DEFAULT 0,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_compra DECIMAL(10,2),
    codigo_barras VARCHAR(50) UNIQUE,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    proveedor_id INT,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE SET NULL,
    INDEX idx_nombre (nombre),
    INDEX idx_categoria (categoria),
    INDEX idx_stock_bajo (stock_actual, stock_minimo),
    INDEX idx_activo (activo),
    INDEX idx_codigo_barras (codigo_barras)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150),
    telefono VARCHAR(20),
    direccion TEXT,
    documento VARCHAR(20),
    notas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_correo (correo),
    INDEX idx_documento (documento),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    usuario_id INT NOT NULL,
    numero_venta VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    forma_pago ENUM('efectivo', 'tarjeta', 'transferencia', 'credito') DEFAULT 'efectivo',
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('borrador', 'completada', 'cancelada') DEFAULT 'completada',
    observaciones TEXT,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_total (total),
    INDEX idx_forma_pago (forma_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla detalle_ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    INDEX idx_venta (venta_id),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NUEVAS TABLAS PARA FACTURACIÓN
-- Crear tabla facturas
CREATE TABLE IF NOT EXISTS facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nro_factura VARCHAR(20) UNIQUE NOT NULL,
    id_venta INT,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_documento VARCHAR(20),
    cliente_direccion TEXT,
    cliente_telefono VARCHAR(20),
    subtotal DECIMAL(10,2) NOT NULL,
    iva DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    generado_por INT NOT NULL,
    observaciones TEXT,
    estado ENUM('emitida', 'anulada') DEFAULT 'emitida',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES ventas(id) ON DELETE SET NULL,
    FOREIGN KEY (generado_por) REFERENCES usuarios(id) ON DELETE RESTRICT,
    INDEX idx_nro_factura (nro_factura),
    INDEX idx_fecha (fecha),
    INDEX idx_cliente (cliente_nombre),
    INDEX idx_estado (estado),
    INDEX idx_generado_por (generado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla detalle_factura
CREATE TABLE IF NOT EXISTS detalle_factura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    producto VARCHAR(100) NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total_producto DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES facturas(id) ON DELETE CASCADE,
    INDEX idx_factura (id_factura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla movimientos de stock
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('ingreso', 'egreso', 'ajuste') NOT NULL,
    cantidad DECIMAL(10,3) NOT NULL,
    cantidad_anterior DECIMAL(10,3),
    cantidad_nueva DECIMAL(10,3),
    motivo VARCHAR(200),
    observaciones TEXT,
    referencia_id INT,
    referencia_tipo ENUM('venta', 'compra', 'ajuste') DEFAULT 'ajuste',
    usuario_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_producto_fecha (producto_id, fecha),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla cierres_caja
CREATE TABLE IF NOT EXISTS cierres_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha_cierre DATE NOT NULL,
    hora_cierre TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_ventas_esperado DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_efectivo_contado DECIMAL(10,2) NOT NULL,
    diferencia DECIMAL(10,2) GENERATED ALWAYS AS (total_efectivo_contado - total_ventas_esperado) STORED,
    numero_ventas INT NOT NULL DEFAULT 0,
    observaciones TEXT,
    estado ENUM('abierto', 'cerrado') DEFAULT 'cerrado',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    UNIQUE KEY unique_cierre_diario (usuario_id, fecha_cierre),
    INDEX idx_fecha_cierre (fecha_cierre),
    INDEX idx_usuario_fecha (usuario_id, fecha_cierre),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Insertar usuario administrador de prueba
INSERT IGNORE INTO usuarios (nombre, correo, password_hash, rol) VALUES 
('Administrador', 'admin@fruteria.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'admin');
-- Contraseña: admin123

-- Insertar usuario cajero de prueba
INSERT IGNORE INTO usuarios (nombre, correo, password_hash, rol) VALUES 
('Cajero Principal', 'cajero@fruteria.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', 'cajero');
-- Contraseña: cajero123
-- Insertar proveedores de ejemplo
INSERT IGNORE INTO proveedores (nombre, contacto, telefono, correo, direccion) VALUES
('Distribuidora Central', 'Juan Pérez', '099123456', 'juan@distribuidora.com', 'Av. Central 123'),
('Frutas del Norte', 'María González', '098765432', 'maria@frutasnorte.com', 'Ruta 5 Km 45'),
('Verduras Orgánicas', 'Carlos López', '097654321', 'carlos@organicas.com', 'Zona Rural 456');

-- Insertar productos de ejemplo
INSERT IGNORE INTO productos (nombre, categoria, unidad, stock_actual, stock_minimo, precio_unitario, precio_compra, descripcion, proveedor_id) VALUES
('Manzana Roja', 'frutas', 'kg', 50.0, 10.0, 3.50, 2.80, 'Manzanas rojas frescas y crujientes', 1),
('Banana', 'frutas', 'kg', 30.0, 5.0, 2.80, 2.20, 'Bananas maduras y dulces', 1),
('Naranja', 'frutas', 'kg', 40.0, 8.0, 4.20, 3.50, 'Naranjas jugosas para zumo', 1),
('Pera', 'frutas', 'kg', 25.0, 6.0, 4.80, 3.90, 'Peras dulces y suaves', 1),
('Uva Verde', 'frutas', 'kg', 15.0, 3.0, 6.50, 5.20, 'Uvas verdes sin semilla', 1),
('Tomate', 'verduras', 'kg', 35.0, 8.0, 5.20, 4.10, 'Tomates frescos de invernadero', 2),
('Lechuga', 'verduras', 'unidad', 20.0, 5.0, 2.50, 1.80, 'Lechuga crespa fresca', 2),
('Papa', 'verduras', 'kg', 80.0, 15.0, 1.80, 1.20, 'Papas lavadas nacionales', 3),
('Zanahoria', 'verduras', 'kg', 30.0, 7.0, 3.20, 2.50, 'Zanahorias frescas', 3),
('Cebolla', 'verduras', 'kg', 45.0, 10.0, 2.90, 2.10, 'Cebollas blancas', 3),
('Aceite de Oliva', 'otros', 'litro', 12.0, 2.0, 8.90, 6.50, 'Aceite de oliva extra virgen', 2),
('Miel Natural', 'otros', 'unidad', 8.0, 1.0, 12.50, 9.80, 'Miel pura de abeja', 2);

-- Insertar clientes de ejemplo
INSERT IGNORE INTO clientes (nombre, correo, telefono, direccion, documento, notas) VALUES
('Cliente General', '', '', '', '', 'Cliente por defecto para ventas sin cliente específico'),
('Restaurante El Buen Sabor', 'restaurante@buensabor.com', '099887766', 'Av. Principal 456', '12345678', 'Cliente mayorista'),
('Supermercado Villa', 'compras@villa.com', '098776655', 'Calle Comercial 789', '87654321', 'Cliente corporativo'),
('Panadería Central', 'panaderia@central.com', '097665544', 'Centro 123', '11223344', 'Cliente frecuente'),
('Hotel Plaza', 'compras@hotelplaza.com', '096554433', 'Plaza Principal 456', '44332211', 'Cliente premium');
