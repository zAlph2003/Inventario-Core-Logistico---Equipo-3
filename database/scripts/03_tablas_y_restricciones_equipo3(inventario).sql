
-- Equipo 3 - Core Logístico (Inventario)
-- Sistema de Restaurante - Proyecto Final



-- Inicializamos el esquema de inventario
DROP SCHEMA IF EXISTS inventario;
CREATE SCHEMA IF NOT EXISTS inventario;


-- Ahora se crea la tabla "categoria"
-- Se encarga de clasificar los productos o ingredientes disponibles en el inventario.
-- Llave primaria de la tabla "id_categoria", acepta un entero grande autoincremental
-- Atributo "nombre_categoria" donde se debe indicar el nombre de la clasificación con una longitud máxima de 100 caracteres no nulos, debe ser única

CREATE TABLE categoria(
	id_categoria BIGSERIAL PRIMARY KEY, 
	nombre_categoria VARCHAR(100) NOT NULL UNIQUE
);


-- Se crea la tabla "insumos"
-- Se encarga de mantener el registro detallado de la mercancía, incluyendo el stock actual, mínimo y los puntos de reorden.
-- Llave primaria "id_insumos" de la tabla, acepta un entero grande autoincremental
-- Atributo "nombre_insumo" que acepta una cadena variable de longitud máxima de 100 caracteres no nulos, debe ser única
-- Atributo "unidad_medida" que acepta una cadena variable de longitud máxima de 20 caracteres no nulos (ejm: kg, litros, unidades)
-- Atributo "stock_actual" que acepta un decimal de 12 dígitos con 4 decimales no nulo, por defecto tendrá el valor de 0
-- Atributo "stock_minimo" que acepta un decimal de 12 dígitos con 4 decimales no nulo, por defecto tendrá el valor de 0
-- Atributo "punto_reorden" que acepta un decimal de 12 dígitos con 4 decimales no nulo, indica el límite donde se debe volver a comprar
-- Atributo "fk_id_categoria" que acepta enteros grandes, permite nulos
-- El atributo "fk_id_categoria" es marcado como llave foránea, haciendo referencia a la columna "id_categoria" de la tabla "categoria"

CREATE TABLE insumos(
	id_insumos BIGSERIAL PRIMARY KEY, 
	nombre_insumo VARCHAR(100) NOT NULL UNIQUE, 
	unidad_medida VARCHAR(20) NOT NULL, 
	stock_actual NUMERIC(12,4) NOT NULL DEFAULT 0,
	stock_minimo NUMERIC(12,4) NOT NULL DEFAULT 0, 
	punto_reorden NUMERIC(12,4) NOT NULL, 
	fk_id_categoria BIGINT, 
	CONSTRAINT fk_id_categoria_fkey FOREIGN KEY (fk_id_categoria) REFERENCES categoria (id_categoria)
);


-- Se crea la tabla "proveedores"
-- Se encarga de mantener registro de las empresas que surten los insumos y sus datos de contacto directo.
-- Llave primaria "id_proveedor" de la tabla, acepta un entero grande autoincremental
-- Atributo "nombre_empresa" donde se debe indicar el nombre del proveedor con una longitud máxima de 150 caracteres no nulos
-- Atributo "identificacion_rif" donde se coloca el documento de identidad fiscal, máximo 30 caracteres no nulos, debe ser única
-- Atributo "ciudad" para indicar la ubicación del proveedor, máximo 100 caracteres no nulos
-- Atributo "telefono_empresa" donde se debe colocar el número de contacto del proveedor, máximo 30 caracteres no nulos
-- Atributo "email_empresa" para el contacto digital de la empresa, máximo 100 caracteres no nulos, debe ser único
-- Atributo "direccion" para detallar la dirección física exacta de la empresa, máximo 255 caracteres no nulos
-- Atributo "nombre_encargado" donde se indica la persona responsable o contacto directo, cadena variable no nula

CREATE TABLE proveedores (
	id_proveedor BIGSERIAL PRIMARY KEY,
	nombre_empresa VARCHAR(150) NOT NULL,
	identificacion_rif VARCHAR(30) NOT NULL UNIQUE, 
	ciudad VARCHAR(100) NOT NULL,
	telefono_empresa VARCHAR(30) NOT NULL,
	email_empresa VARCHAR(100) NOT NULL UNIQUE,
	direccion VARCHAR(255) NOT NULL,
	nombre_encargado VARCHAR NOT NULL
);


-- Se crea la tabla "proveedores_insumo"
-- Se encarga de gestionar el registro histórico de las órdenes de compra, controlando tiempos, costos y estado del envío.
-- Llave primaria "id_orden_compra" de la tabla, acepta un entero grande autoincremental
-- Atributo "fecha_emision" que acepta una fecha, por defecto, tendrá la fecha actual del sistema
-- Atributo "fk_id_proveedor" que acepta enteros grandes no nulos
-- Atributo "fk_id_insumos" que acepta enteros grandes no nulos
-- Atributo "costo_unitario" que acepta un decimal de 12 dígitos con 4 decimales no nulo
-- Atributo "cantidad_pedido" que acepta un decimal de 12 dígitos con 4 decimales no nulo
-- Atributo "tiempo_entrega_dias" que acepta enteros no nulos, indica cuántos días tarda el pedido en llegar
-- Atributo "encargado_despacho" que acepta una cadena variable de longitud máxima de 100, permite nulos
-- Atributo "telefono_encargado_despacho" que acepta una cadena variable de longitud máxima de 30, permite nulos
-- Atributo "estado_envio" que acepta cadena variable máximo 20 caracteres, por defecto tendrá el valor 'En Proceso', validado para aceptar solo ('En Proceso','En camino','Recibido')
-- Atributo "observaciones" que acepta texto largo para notas adicionales del pedido, permite nulos
-- El atributo "fk_id_proveedor" es marcado como llave foránea, haciendo referencia a la columna "id_proveedor" de la tabla "proveedores"
-- El atributo "fk_id_insumos" es marcado como llave foránea, haciendo referencia a la columna "id_insumos" de la tabla "insumos"

CREATE TABLE proveedores_insumo(
	id_orden_compra BIGSERIAL PRIMARY KEY, 
	fecha_emision DATE DEFAULT CURRENT_DATE,
	fk_id_proveedor BIGINT NOT NULL,
	fk_id_insumos BIGINT NOT NULL,
	costo_unitario NUMERIC(12,4) NOT NULL, 
	cantidad_pedido NUMERIC(12,4) NOT NULL,
	tiempo_entrega_dias INTEGER NOT NULL,
	encargado_despacho VARCHAR(100),
	telefono_encargado_despacho VARCHAR(30),
	estado_envio VARCHAR(20) DEFAULT 'En Proceso' CHECK(estado_envio IN ('En Proceso','En camino','Recibido')), 
	observaciones TEXT, 
	CONSTRAINT fk_proveedor_fkey FOREIGN KEY (fk_id_proveedor) REFERENCES proveedores (id_proveedor),
	CONSTRAINT fk_insumo_fkey FOREIGN KEY (fk_id_insumos) REFERENCES insumos (id_insumos)
);

