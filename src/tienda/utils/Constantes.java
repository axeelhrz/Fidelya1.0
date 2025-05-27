package tienda.utils;

/**
 * Clase que contiene constantes utilizadas en toda la aplicación.
 */
public class Constantes {
    // Rutas de archivos
    public static final String RUTA_EMPLEADOS = "src/tienda/empleados.txt";
    public static final String RUTA_PRODUCTOS = "src/tienda/productos.txt";
    public static final String RUTA_OFERTAS = "src/tienda/ofertas.txt";
    
    // Límites para cálculos de gratificación
    public static final double LIMITE_PEDIDO_NOCTURNO = 200.0;
    public static final double LIMITE_PEDIDO_DIURNO = 300.0;
    
    // Separador para archivos CSV
    public static final String SEPARADOR = ";";
    
    // Códigos para tipos de productos
    public static final String TIPO_PERECEDERO = "P";
    public static final String TIPO_NO_PERECEDERO = "NP";
    
    // Códigos para tipos de ofertas
    public static final String OFERTA_2X1 = "2X1";
    public static final String OFERTA_3X2 = "3X2";
    public static final String OFERTA_PORCENTAJE = "POR";
    public static final String SIN_OFERTA = "000";
    
    // Códigos para turnos de empleados
    public static final String TURNO_DIURNO = "Diurno";
    public static final String TURNO_NOCTURNO = "Nocturno";
    
    // Opciones del menú principal
    public static final int OPCION_HACER_PEDIDO = 1;
    public static final int OPCION_MODIFICAR_PRODUCTOS = 2;
    public static final int OPCION_CAMBIAR_PASSWORD = 3;
    public static final int OPCION_CERRAR_SESION = 4;
}
