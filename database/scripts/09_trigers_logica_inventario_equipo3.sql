
-- Equipo 3 - Inventario (Triggers)
-- Sistema de Restaurante - Proyecto Final
-- En éste script se detallan las funciones y triggers encargados de automatizar la lógica de negocio del inventario



-- TRIGGER 1: ACTUALIZAR INVENTARIO AL RECIBIR MERCANCÍA
-- Se encarga de sumar automáticamente la cantidad de insumos comprados al stock actual cuando una orden de compra pasa al estado 'Recibido'.

CREATE OR REPLACE FUNCTION actualizar_stock_al_recibir()
RETURNS TRIGGER AS $$
BEGIN

    -- Verificamos si el estado de la orden cambió a 'Recibido'
    IF NEW.estado_envio = 'Recibido' AND OLD.estado_envio IS DISTINCT FROM 'Recibido' THEN
        
        -- Sumamos la cantidad del pedido al stock del insumo correspondiente
        UPDATE insumos
        SET stock_actual = stock_actual + NEW.cantidad_pedido
        WHERE id_insumos = NEW.fk_id_insumos;
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
AFTER UPDATE ON proveedores_insumo
FOR EACH ROW
EXECUTE FUNCTION actualizar_stock_al_recibir();



-- TRIGGER 2: ALERTA DE STOCK MÍNIMO
-- Monitorea el stock actual de la tabla insumos y emite un mensaje de advertencia (Warning) en la consola en caso de que las existencias caigan a niveles críticos.

CREATE OR REPLACE FUNCTION alerta_stock_minimo()
RETURNS TRIGGER AS $$
BEGIN

    -- Se dispara únicamente cuando el stock cruza el límite inferior establecido
    IF NEW.stock_actual <= NEW.stock_minimo AND OLD.stock_actual > OLD.stock_minimo THEN
        
        RAISE WARNING '¡ALERTA DE CRÍTICA! El insumo "%" ha alcanzado su nivel de stock mínimo permitido (%).', 
                        NEW.nombre_insumo, NEW.stock_minimo;
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_alerta_stock_minimo
AFTER UPDATE OF stock_actual ON insumos
FOR EACH ROW
EXECUTE FUNCTION alerta_stock_minimo();



-- TRIGGER 3: PUNTO DE REORDEN AUTOMÁTICO
-- Detecta cuando un insumo llega a su punto de reorden. Busca de forma inteligente al último proveedor registrado en el historial para ese insumo y genera una nueva orden de compra en estado 'En Proceso'.

CREATE OR REPLACE FUNCTION generar_reorden_automatica()
RETURNS TRIGGER AS $$
DECLARE

    v_id_proveedor BIGINT;
    v_costo_ultimo NUMERIC(12,4);
    v_cantidad_reorden NUMERIC(12,4);
	
BEGIN

    -- Se dispara en el momento justo en que las existencias tocan o bajan del punto de reorden
    IF NEW.stock_actual <= NEW.punto_reorden AND OLD.stock_actual > OLD.punto_reorden THEN
        
        -- Buscamos al proveedor más reciente y el costo unitario pactado anteriormente
        SELECT fk_id_proveedor, costo_unitario 
        INTO v_id_proveedor, v_costo_ultimo
        FROM proveedores_insumo
        WHERE fk_id_insumos = NEW.id_insumos
        ORDER BY fecha_emision DESC, id_orden_compra DESC
        LIMIT 1;

        -- Si existe un historial de compras para este insumo, procedemos con el reabastecimiento
        IF FOUND THEN
            -- Calculamos la cantidad de reorden (duplicamos el punto de reorden como estándar)
            v_cantidad_reorden := NEW.punto_reorden * 2; 

            INSERT INTO proveedores_insumo (
                fecha_emision, fk_id_proveedor, fk_id_insumos, 
                costo_unitario, cantidad_pedido, tiempo_entrega_dias, 
                estado_envio, observaciones
            ) VALUES (
                CURRENT_DATE, v_id_proveedor, NEW.id_insumos, 
                v_costo_ultimo, v_cantidad_reorden, 3, 
                'En Proceso', 'REORDEN AUTOMÁTICA: Activada por el sistema al alcanzar el punto de reorden.'
            );
            
            RAISE NOTICE 'SISTEMA: Se ha generado una sugerencia de orden de compra automática para el insumo: %', NEW.nombre_insumo;
        END IF;
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_punto_reorden_automatico
AFTER UPDATE OF stock_actual ON insumos
FOR EACH ROW
EXECUTE FUNCTION generar_reorden_automatica();



-- TRIGGER 4: CONTROL DE SEGURIDAD (PREVENIR STOCK NEGATIVO)
-- Actúa como una regla estricta de validación. Cancela inmediatamente cualquier operación de actualización o resta que pretenda dejar el stock en valores negativos.

CREATE OR REPLACE FUNCTION prevenir_stock_negativo()
RETURNS TRIGGER AS $$
BEGIN
    -- Validamos antes de confirmar la actualización de los datos
    IF NEW.stock_actual < 0 THEN
        
        RAISE EXCEPTION 'TRANSACCIÓN CANCELADA: Operación física imposible. No hay suficientes existencias de "%". Stock solicitado: % %.', 
                        NEW.nombre_insumo, NEW.stock_actual, NEW.unidad_medida;
        
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevenir_stock_negativo
BEFORE UPDATE OF stock_actual ON insumos
FOR EACH ROW
EXECUTE FUNCTION prevenir_stock_negativo();


-- TRIGGER 5: DESCUENTO DEL STOCK POR RECETAS
-- Se encarga de descontar el stock de uno o mas insumos dependiendo de la receta que tengo un pedido
-- Verificar el nombre exacto de la tabla y columna 'fk_id_pedido' perteneciente a equipo1.detalle_orden
-- Verificar el nombre de la columna de estado de equipo1.ordenes
CREATE OR REPLACE FUNCTION inventario.descontar_stock_por_receta()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que la orden haya cambiado a un estado de preparación o despacho
    IF (NEW.Estatus_Orden IN ('Preparando', 'Entregado') AND OLD.Estatus_Orden NOT IN ('Preparando', 'Entregado')) THEN
        
        -- Actualizar el stock_actual restando (cantidad_requerida_receta * cantidad_platos_pedidos)
        UPDATE inventario.insumos i
        SET stock_actual = i.stock_actual - (r.cantidad_requerida * d.cantidad)
        FROM inventario.recetas r
        JOIN equipo1.detalle_orden d ON d.fk_id_producto = r.fk_id_producto
        WHERE d.fk_id_pedido = NEW.id_pedido
          AND i.id_insumos = r.fk_id_insumos;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_descontar_stock ON equipo1.ordenes;

CREATE TRIGGER trg_descontar_stock
AFTER UPDATE OF Estatus_Orden ON equipo1.ordenes
FOR EACH ROW
EXECUTE FUNCTION inventario.descontar_stock_por_receta();