package tienda;

import java.util.Scanner;
import java.util.List;
import tienda.empleados.AutenticacionException;
import tienda.empleados.Empleado;
import tienda.empleados.EmpleadoDAO;
import tienda.pedidos.Pedido;
import tienda.pedidos.PedidoDAO;
import tienda.pedidos.PedidoManager;
import tienda.productos.Producto;
import tienda.productos.ProductoDAO;
import tienda.utils.Constantes;
import tienda.utils.DatabaseException;
import tienda.utils.Validador;

/**
 * Clase principal del sistema de gestión de tienda.
 * Implementa la interfaz de consola y coordina las operaciones
 * utilizando los DAOs para la persistencia en base de datos MySQL.
 */
public class Main {
    // DAOs para acceso a datos
    private static EmpleadoDAO empleadoDAO;
    private static ProductoDAO productoDAO;
    private static PedidoDAO pedidoDAO;

    // Estado de la aplicación
    private static Empleado empleadoActual;
    private static List<Producto> productos;
    // Removed unused field: private static Oferta[] ofertas;
    // private static final int MAX_OFERTAS = 20;

    
    /**
     * Punto de entrada principal de la aplicación
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        try {
            // Inicializar DAOs
            empleadoDAO = new EmpleadoDAO();
            productoDAO = new ProductoDAO();
            pedidoDAO = new PedidoDAO();

            // Removed initialization of unused ofertas array
            // ofertas = new Oferta[MAX_OFERTAS];

            System.out.println("Iniciando sistema de gestión de tienda...");

            boolean salir = false;
            while (!salir) {
                if (empleadoActual == null) {
                    boolean loginExitoso = login(scanner);
                    if (!loginExitoso && !Validador.confirmar(scanner, "¿Desea intentar de nuevo?")) {
                        salir = true;
                        continue;
                    }
                }

                mostrarMenu();
                int opcion = Validador.solicitarEntero(scanner, "Seleccione una opción", 1, 4);

                switch (opcion) {
                    case Constantes.OPCION_HACER_PEDIDO:
                        hacerPedido(scanner);
                        break;
                    case Constantes.OPCION_MODIFICAR_PRODUCTOS:
                        modificarProductos(scanner);
                        break;
                    case Constantes.OPCION_CAMBIAR_PASSWORD:
                        cambiarPassword(scanner);
                        break;
                    case Constantes.OPCION_CERRAR_SESION:
                        cerrarSesion();
                        break;
                }
            }
        } catch (Exception e) {
            System.out.println("Error crítico: " + e.getMessage());
            e.printStackTrace();
        } finally {
            System.out.println("¡Gracias por utilizar el sistema de gestión de tienda!");
            scanner.close();
        }
    }

    // Main loop functionality has been moved to the main method

    // This method has been removed as it's a duplicate of the one defined later in the file

    // First implementation of hacerPedido is removed to fix the duplicate method error

    // This is the first implementation of modificarProductos which we'll remove
    // as it has errors and the second implementation at the end of the file is more complete
    /**
     * Actualiza la lista de productos desde la base de datos
     */
    private static void actualizarListaProductos() throws DatabaseException {
        productos = productoDAO.obtenerTodos();
        System.out.println("Se han cargado " + productos.size() + " productos.");
    }
    
    /**
     * Muestra el menú principal de la aplicación
     */
    private static void mostrarMenu() {
        System.out.println("\n=================================================");
        System.out.println("      SISTEMA DE GESTIÓN DE TIENDA - MENÚ        ");
        System.out.println("=================================================");
        System.out.println("Empleado: " + empleadoActual.getNombre() + " (Nivel: " + empleadoActual.getNivel() + ")");
        System.out.println("Productividad actual: " + String.format("%.2f", empleadoActual.getProductividad()) + "€");
        System.out.println("-------------------------------------------------");
        System.out.println("1. Hacer pedido");
        System.out.println("2. Modificar productos");
        System.out.println("3. Cambiar contraseña");
        System.out.println("4. Cerrar sesión");
        System.out.println("=================================================");
    }
    
    /**
     * Realiza el proceso de login
     * @param scanner Scanner para leer entrada del usuario
     * @return true si el login fue exitoso, false en caso contrario
     */
    private static boolean login(Scanner scanner) {
        System.out.println("\n=== LOGIN DE EMPLEADO ===");
        
        try {
            // Solicitar código de empleado
            int codigo = Validador.solicitarEntero(scanner, "Introduzca su código de empleado", 1, 9999);
            
            // Solicitar contraseña
            String password = Validador.solicitarCadena(scanner, "Introduzca su contraseña");
            
            // Autenticar empleado usando DAO
            empleadoActual = empleadoDAO.autenticar(codigo, password);
            
            System.out.println("Bienvenido/a, " + empleadoActual.getNombre() + "!");
            return true;
        } catch (AutenticacionException e) {
            System.out.println("Error " + e.getCodigo() + ": " + e.getMessage());
            return false;
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Cierra la sesión del empleado actual
     */
    private static void cerrarSesion() {
        if (empleadoActual != null) {
            System.out.println("Sesión cerrada para " + empleadoActual.getNombre() + ".");
            empleadoActual = null;
}
    }

    /**
     * Cambia la contraseña del empleado actual
     * @param scanner Scanner para leer entrada del usuario
     * @return true si el cambio fue exitoso, false en caso contrario
     */
    private static boolean cambiarPassword(Scanner scanner) {
        if (empleadoActual == null) {
            System.out.println("No hay ningún empleado con sesión iniciada.");
            return false;
        }
        
        System.out.println("\n=== CAMBIAR CONTRASEÑA ===");
        
        try {
            // Solicitar contraseña actual
            String passwordActual = Validador.solicitarCadena(scanner, "Introduzca su contraseña actual");
            
            // Verificar contraseña actual
            if (!empleadoActual.getPassword().equals(passwordActual)) {
                System.out.println("Error: La contraseña actual no es correcta.");
                return false;
            }
            
            // Solicitar nueva contraseña
            String nuevaPassword = Validador.solicitarCadena(scanner, "Introduzca la nueva contraseña");
            
            // Confirmar nueva contraseña
            String confirmacion = Validador.solicitarCadena(scanner, "Confirme la nueva contraseña");
            
            if (!nuevaPassword.equals(confirmacion)) {
                System.out.println("Error: Las contraseñas no coinciden.");
                return false;
            }
            
            // Cambiar contraseña en la base de datos usando DAO
            empleadoDAO.actualizarPassword(empleadoActual.getCodigo(), nuevaPassword);
            
            // Actualizar el objeto empleado actual
            empleadoActual = empleadoDAO.buscarPorCodigo(empleadoActual.getCodigo());
            
            System.out.println("Contraseña cambiada con éxito.");
            return true;
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Proceso para hacer un pedido
     * @param scanner Scanner para leer entrada del usuario
     */
    private static void hacerPedido(Scanner scanner) {
        try {
            // Recargar productos para tener el stock actualizado
            actualizarListaProductos();
            
            if (productos.isEmpty()) {
                System.out.println("No hay productos disponibles para hacer un pedido.");
                return;
            }
            
            // Convertir la lista de productos a un array para compatibilidad con PedidoManager
            Producto[] productosArray = productos.toArray(new Producto[0]);
            
            // Crear pedido usando PedidoManager
            Pedido pedido = PedidoManager.crearPedido(scanner, empleadoActual, 
                                                     productosArray, 
                                                     productosArray.length);
            
            if (pedido != null && pedido.getNumDetalles() > 0) {
                // Confirmar pedido
                if (Validador.confirmar(scanner, "¿Confirmar pedido?")) {
                    // Guardar pedido en la base de datos usando DAO
                    pedidoDAO.guardarPedido(pedido);
                    
                    // Actualizar productividad del empleado
                    pedidoDAO.actualizarProductividadEmpleado(empleadoActual, pedido.calcularTotal());
                    
                    // Actualizar el empleado actual con la nueva productividad
                    empleadoActual = empleadoDAO.buscarPorCodigo(empleadoActual.getCodigo());
                    
                    System.out.println("Pedido confirmado y registrado en el sistema.");
                } else {
                    System.out.println("Pedido cancelado.");
                }
            }
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
    
    /**
     * Proceso para modificar productos
     * @param scanner Scanner para leer entrada del usuario
     */
    private static void modificarProductos(Scanner scanner) {
        System.out.println("\n=== MODIFICAR PRODUCTOS ===");
        
        try {
            // Recargar productos para tener datos actualizados
            actualizarListaProductos();
            
            if (productos.isEmpty()) {
                System.out.println("No hay productos disponibles para modificar.");
                return;
            }
            
            // Mostrar productos disponibles
            System.out.println("\nProductos disponibles:");
            for (int i = 0; i < productos.size(); i++) {
                System.out.println((i + 1) + ". " + productos.get(i).toString());
            }
            
            // Seleccionar producto
            int indiceProducto = Validador.solicitarEntero(scanner, 
                                "Seleccione un producto a modificar (0 para cancelar)", 
                                0, productos.size()) - 1;
            
            if (indiceProducto == -1) {
                System.out.println("Operación cancelada.");
                return;
            }
            
            Producto producto = productos.get(indiceProducto);
            
            // Mostrar menú de modificación
            System.out.println("\nModificando: " + producto.toString());
            System.out.println("1. Modificar nombre");
            System.out.println("2. Modificar precio");
            System.out.println("3. Modificar stock");
            
            int opcion = Validador.solicitarEntero(scanner, "Seleccione qué desea modificar", 1, 3);
            
            switch (opcion) {
                case 1:
                    String nuevoNombre = Validador.solicitarCadena(scanner, "Introduzca el nuevo nombre");
                    producto.setNombre(nuevoNombre);
                    break;
                case 2:
                    double nuevoPrecio = Validador.solicitarDouble(scanner, "Introduzca el nuevo precio");
                    producto.setPrecio(nuevoPrecio);
                    break;
                case 3:
                    int nuevoStock = Validador.solicitarEntero(scanner, "Introduzca el nuevo stock", 0, 1000);
                    producto.setStock(nuevoStock);
                    break;
            }
            
            // Actualizar producto en la base de datos usando DAO
            productoDAO.actualizarProducto(producto);
            
            System.out.println("Producto actualizado: " + producto.toString());
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
}