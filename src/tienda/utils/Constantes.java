package tienda.utils;

/**
 * Clase que contiene constantes utilizadas en toda la aplicación.
 * Versión adaptada para incluir constantes de base de datos.
 */
public class Constantes {
    // Opciones del menú principal
    public static final int OPCION_HACER_PEDIDO = 1;
    public static final int OPCION_MODIFICAR_PRODUCTOS = 2;
    public static final int OPCION_CAMBIAR_PASSWORD = 3;
    public static final int OPCION_CERRAR_SESION = 4;
    
    // Límites para cálculos de gratificación
    public static final double LIMITE_PEDIDO_NOCTURNO = 200.0;
    public static final double LIMITE_PEDIDO_DIURNO = 300.0;
    
    // Códigos para tipos de productos
    public static final String TIPO_PERECEDERO = "Perecedero";
    public static final String TIPO_NO_PERECEDERO = "NoPerecedero";
    
    // Códigos para tipos de ofertas
    public static final String OFERTA_2X1 = "2x1";
    public static final String OFERTA_3X2 = "3x2";
    public static final String OFERTA_PORCENTAJE = "porcentaje";
    
    // Códigos para turnos de empleados
    public static final String TURNO_DIURNO = "Diurno";
    public static final String TURNO_NOCTURNO = "Nocturno";
    
    // Constantes de base de datos
    public static final String DB_URL = "jdbc:mysql://localhost:3306/tienda";
    public static final String DB_USER = "root";
    public static final String DB_PASSWORD = "admin";
    
    // Tamaños máximos
    public static final int MAX_DETALLES_PEDIDO = 10;
}
