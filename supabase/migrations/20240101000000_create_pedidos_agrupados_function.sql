-- Crear función para obtener pedidos agrupados
CREATE OR REPLACE FUNCTION get_pedidos_agrupados(fechas_param date[], nivel_param text)
RETURNS TABLE(
  dia text,
  fecha text,
  nivel text,
  opcion text,
  cantidad bigint
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.dia,
    p.fecha::text,
    p.nivel,
    p.opcion,
    COUNT(*)::bigint as cantidad
  FROM 
    pedidos p
  WHERE 
    p.fecha = ANY(fechas_param)
    AND p.estado = 'PAGADO'
    AND (nivel_param IS NULL OR p.nivel = nivel_param)
  GROUP BY 
    p.dia, p.fecha, p.nivel, p.opcion
  ORDER BY 
    p.fecha, p.nivel, p.opcion;
END;
$$;
