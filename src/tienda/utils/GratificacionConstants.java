package tienda.utils;

/**
 * Interfaz que define las constantes relacionadas con gratificaciones y límites de pedidos.
 * Estas constantes pueden ser modificadas fácilmente según la situación financiera de la empresa.
 */
public interface GratificacionConstants {
    // Gratificaciones por nivel
    double GRATIFICACION_NIVEL_1 = 1.0;
    double GRATIFICACION_NIVEL_2 = 2.0;
    double GRATIFICACION_NIVEL_3 = 3.0;
    
    // Límites para cálculos especiales
    double LIMITE_PEDIDO_NOCTURNO = 200.0;
    double LIMITE_PEDIDO_DIURNO = 300.0;
}