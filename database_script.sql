-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tienda;
USE tienda;

-- Crear tabla de empleados
CREATE TABLE IF NOT EXISTS empleados (
    id_empleado INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    nivel INT CHECK (nivel BETWEEN 1 AND 3),
    turno ENUM('Diurno', 'Nocturno') NOT NULL,
    plus_nocturnidad DECIMAL(5,2),
    retencion DECIMAL(5,2),
    productividad DECIMAL(10,2) DEFAULT 0
);

-- Crear tabla de ofertas
CREATE TABLE IF NOT EXISTS ofertas (
    id_oferta INT PRIMARY KEY,
    tipo ENUM('2x1', '3x2', 'porcentaje') NOT NULL,
    porcentaje_descuento DECIMAL(5,2),
    max_unidades INT
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    unidades INT CHECK (unidades >= 0),
    tipo ENUM('Perecedero', 'NoPerecedero') NOT NULL,
    dias_para_caducar INT,
    id_oferta INT,
    FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
);

-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

-- Crear tabla de detalle de pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Verificar si ya existen datos en las tablas
SET @empleados_count = (SELECT COUNT(*) FROM empleados);
SET @ofertas_count = (SELECT COUNT(*) FROM ofertas);
SET @productos_count = (SELECT COUNT(*) FROM productos);

-- Solo insertar datos si las tablas están vacías
-- Insertar datos de prueba: empleados
INSERT INTO empleados (id_empleado, nombre, password, nivel, turno, plus_nocturnidad, retencion, productividad)
SELECT 1234, 'Arturo', 'art1+', 2, 'Nocturno', 10.5, NULL, 0 FROM dual WHERE @empleados_count = 0
UNION ALL
SELECT 1235, 'Manuel', 'man2-', 1, 'Diurno', NULL, 0.0, 0 FROM dual WHERE @empleados_count = 0
UNION ALL
SELECT 1236, 'Laura', 'lau3*', 3, 'Nocturno', 15.0, NULL, 0 FROM dual WHERE @empleados_count = 0
UNION ALL
SELECT 1237, 'Carlos', 'car1#', 1, 'Diurno', NULL, 5.0, 0 FROM dual WHERE @empleados_count = 0
UNION ALL
SELECT 1238, 'Elena', 'ele2@', 2, 'Nocturno', 12.5, NULL, 0 FROM dual WHERE @empleados_count = 0;
-- Insertar datos de prueba: ofertas
INSERT INTO ofertas (id_oferta, tipo, porcentaje_descuento, max_unidades)
SELECT 1, '2x1', NULL, NULL FROM dual WHERE @ofertas_count = 0
UNION ALL
SELECT 2, '3x2', NULL, NULL FROM dual WHERE @ofertas_count = 0
UNION ALL
SELECT 3, 'porcentaje', 20, 5 FROM dual WHERE @ofertas_count = 0
UNION ALL
SELECT 4, 'porcentaje', 15, 3 FROM dual WHERE @ofertas_count = 0;
-- Insertar datos de prueba: productos
INSERT INTO productos (id_producto, nombre, precio, unidades, tipo, dias_para_caducar, id_oferta)
SELECT 101, 'Leche', 1.20, 50, 'NoPerecedero', NULL, 1 FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 102, 'Pan', 0.90, 30, 'NoPerecedero', NULL, 2 FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 103, 'Manzanas', 2.50, 40, 'Perecedero', 5, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 104, 'Yogur', 1.80, 25, 'Perecedero', 3, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 105, 'Arroz', 2.30, 60, 'NoPerecedero', NULL, 3 FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 106, 'Pasta', 1.50, 45, 'NoPerecedero', NULL, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 107, 'Plátanos', 1.90, 35, 'Perecedero', 4, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 108, 'Queso', 3.75, 20, 'Perecedero', 7, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 109, 'Aceite', 4.50, 30, 'NoPerecedero', NULL, NULL FROM dual WHERE @productos_count = 0
UNION ALL
SELECT 110, 'Detergente', 5.20, 15, 'NoPerecedero', NULL, 4 FROM dual WHERE @productos_count = 0;

-- Mostrar información sobre los datos insertados
SELECT 'Empleados' AS tabla, COUNT(*) AS registros FROM empleados
UNION ALL
SELECT 'Ofertas' AS tabla, COUNT(*) AS registros FROM ofertas
UNION ALL
SELECT 'Productos' AS tabla, COUNT(*) AS registros FROM productos
UNION ALL
SELECT 'Pedidos' AS tabla, COUNT(*) AS registros FROM pedidos
UNION ALL
SELECT 'Detalle de Pedidos' AS tabla, COUNT(*) AS registros FROM detalle_pedido;
