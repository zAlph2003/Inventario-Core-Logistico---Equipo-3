-- 1. Llenamos las Categorías del Inventario

INSERT INTO categoria (nombre_categoria) VALUES
('Carnes y Aves'),
('Frutas y Verduras'),
('Lácteos y Quesos'),
('Bebidas y Licores'),
('Salsas y Condimentos');



-- 2. Llenamos los Proveedores (Con datos y RIFs ficticios pero realistas)

INSERT INTO proveedores (nombre_empresa, identificacion_rif, ciudad, telefono_empresa, email_empresa, direccion, nombre_encargado) VALUES

('Frigorífico El Toro C.A.', 'J-40123456-7', 'Barcelona', '0414-1234567', 'ventas@eltoro.com', 'Zona Industrial Los Montones, Galpón 4', 'Carlos Mendoza'),

('Distribuidora Los Llanos', 'J-30987654-2', 'Lechería', '0412-9876543', 'contacto@losllanos.com', 'Av. Intercomunal, Sector Las Garzas', 'Maria Gonzalez'),

('Hortalizas de Oriente', 'J-29555666-8', 'Puerto La Cruz', '0416-5554433', 'pedidos@hortalizasoriente.com', 'Mercado Municipal, Pasillo 3, Local 12', 'Jose Perez');


-- 3. Llenamos los Insumos (Asignándoles las categorías creadas arriba)
-- Nota: fk_id_categoria corresponde a: 1(Carnes), 2(Frutas), 3(Lácteos), 4(Bebidas), 5(Salsas)

INSERT INTO insumos (nombre_insumo, unidad_medida, stock_actual, stock_minimo, punto_reorden, fk_id_categoria) VALUES
('Carne de Res (Solomo)', 'Kg', 45.5000, 15.0000, 20.0000, 1),
('Pechuga de Pollo', 'Kg', 30.0000, 10.0000, 15.0000, 1),
('Tomate Margarita', 'Kg', 12.0000, 5.0000, 10.0000, 2),
('Queso Mozzarella', 'Kg', 8.5000, 5.0000, 10.0000, 3),
('Refresco Cola 2L', 'Unidades', 60.0000, 24.0000, 36.0000, 4),
('Salsa de Tomate Ketchup', 'Litros', 15.0000, 5.0000, 8.0000, 5);


-- 4. Llenamos las Órdenes de Compra (Proveedores_Insumo)
-- Relacionamos a los proveedores con los insumos y probamos los estados:  En camino y En Proceso (No usar el recibido porque no se va a actualizar automaticamente, el trigger de actualizar stock solo se activa con update y no con insert to)

INSERT INTO proveedores_insumo (fecha_emision, fk_id_proveedor, fk_id_insumos, costo_unitario, cantidad_pedido, tiempo_entrega_dias, encargado_despacho, telefono_encargado_despacho, estado_envio, observaciones) VALUES

('2026-07-01', 1, 1, 6.5000, 20.0000, 2, 'Luis Rojas', '0424-1112233', 'En proceso', 'Entrega completa. La carne llegó en excelente estado.'),

('2026-07-08', 3, 3, 1.2000, 15.0000, 1, 'Ana Silva', '0414-3334455', 'En camino', 'Llamar al llegar al restaurante porque el timbre está dañado.'),

('2026-07-10', 2, 4, 4.8000, 10.0000, 3, 'Pedro Gomez', '0412-6667788', 'En Proceso', 'Pago pendiente contra entrega.');
