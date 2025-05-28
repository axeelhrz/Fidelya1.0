package tienda;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import tienda.empleados.AutenticacionException;
import tienda.empleados.Empleado;
import tienda.empleados.EmpleadoDAO;
import tienda.pedidos.Pedido;
import tienda.pedidos.PedidoDAO;
import tienda.pedidos.PedidoManager;
import tienda.productos.Producto;
import tienda.productos.ProductoPerecedero;
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
    
    /**
     * Punto de entrada principal de la aplicación
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Iniciando sistema de gestión de tienda...");
        
        try {
            // Inicializar DAOs
            empleadoDAO = new EmpleadoDAO();
            productoDAO = new ProductoDAO();
            pedidoDAO = new PedidoDAO();
            
            // Inicializar lista de productos
            productos = new ArrayList<>();
            
            // Cargar productos iniciales
            actualizarListaProductos();
            
            // Bucle principal de la aplicación
            ejecutarBuclePrincipal(scanner);
            
        } catch (DatabaseException e) {
            System.out.println("Error crítico de base de datos: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
        } finally {
            System.out.println("¡Gracias por utilizar el sistema de gestión de tienda!");
            scanner.close();
        }
    }
    
    /**
     * Actualiza la lista de productos desde la base de datos
     */
    private static void actualizarListaProductos() throws DatabaseException {
        productos = productoDAO.obtenerTodos();
        System.out.println("Se han cargado " + productos.size() + " productos.");
    }
    
    /**
     * Ejecuta el bucle principal de la aplicación
     */
    private static void ejecutarBuclePrincipal(Scanner scanner) throws DatabaseException {
        boolean salir = false;
        
        while (!salir) {
            // Si no hay empleado con sesión, solicitar login
            if (empleadoActual == null) {
                boolean loginExitoso = login(scanner);
                if (!loginExitoso) {
                    // Preguntar si desea intentar de nuevo o salir
                    if (!Validador.confirmar(scanner, "¿Desea intentar de nuevo?")) {
                        salir = true;
                    }
                    continue;
                }
            }
            
            try {
                // Mostrar menú principal y procesar opción
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
            } catch (NullPointerException e) {
                System.out.println("Error: Se ha perdido la sesión del empleado. Por favor, inicie sesión de nuevo.");
                empleadoActual = null;
            } catch (Exception e) {
                System.out.println("Error inesperado: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Muestra el menú principal de la aplicación
     */
    private static void mostrarMenu() {
        if (empleadoActual == null) {
            throw new NullPointerException("No hay empleado con sesión iniciada");
        }
        
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
            
            // Autenticar empleado
            empleadoActual = empleadoDAO.autenticar(codigo, password);
            
            if (empleadoActual != null) {
                System.out.println("Bienvenido/a, " + empleadoActual.getNombre() + "!");
                return true;
            } else {
                System.out.println("Error: No se pudo autenticar al empleado.");
                return false;
            }
            
        } catch (AutenticacionException e) {
            System.out.println("Error " + e.getCodigo() + ": " + e.getMessage());
            return false;
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
            if (e.getCause() != null) {
                System.out.println("Causa: " + e.getCause().getMessage());
            }
            return false;
        } catch (Exception e) {
            System.out.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
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
            
            // Cambiar contraseña en la base de datos
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
                    // Guardar pedido en la base de datos
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
            System.out.println("1. Modificar código");
            System.out.println("2. Modificar nombre");
            System.out.println("3. Modificar precio");
            System.out.println("4. Modificar stock");
            
            // Agregar opción específica para productos perecederos
            if (producto instanceof ProductoPerecedero) {
                System.out.println("5. Modificar días para caducar");
            }
            
            int maxOpcion = (producto instanceof ProductoPerecedero) ? 5 : 4;
            int opcion = Validador.solicitarEntero(scanner, "Seleccione qué desea modificar", 1, maxOpcion);
            
            switch (opcion) {
                case 1:
                    modificarCodigoProducto(scanner, producto);
                    break;
                case 2:
                    String nuevoNombre = Validador.solicitarCadena(scanner, "Introduzca el nuevo nombre");
                    producto.setNombre(nuevoNombre);
                    productoDAO.actualizarProducto(producto);
                    System.out.println("Nombre modificado con éxito.");
                    break;
                case 3:
                    double nuevoPrecio = Validador.solicitarDouble(scanner, "Introduzca el nuevo precio");
                    producto.setPrecio(nuevoPrecio);
                    productoDAO.actualizarProducto(producto);
                    System.out.println("Precio modificado con éxito.");
                    break;
                case 4:
                    int nuevoStock = Validador.solicitarEntero(scanner, "Introduzca el nuevo stock", 0, 1000);
                    producto.setStock(nuevoStock);
                    productoDAO.actualizarProducto(producto);
                    System.out.println("Stock modificado con éxito.");
                    break;
                case 5:
                    if (producto instanceof ProductoPerecedero) {
                        ProductoPerecedero perecedero = (ProductoPerecedero) producto;
                        int nuevosDias = Validador.solicitarEntero(scanner, "Introduzca los nuevos días para caducar", 1, 365);
                        perecedero.setDiasParaCaducar(nuevosDias);
                        productoDAO.actualizarProducto(perecedero);
                        System.out.println("Días para caducar modificados con éxito.");
                    }
                    break;
            }
            
            // Recargar la lista de productos para mostrar los cambios
            actualizarListaProductos();
            
            // Buscar el producto actualizado en la nueva lista
            Producto productoActualizado = null;
            for (Producto p : productos) {
                if (p.getCodigo() == producto.getCodigo()) {
                    productoActualizado = p;
                    break;
                }
            }
            
            if (productoActualizado != null) {
                System.out.println("Producto actualizado: " + productoActualizado.toString());
            }
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
    
    /**
     * Modifica el código de un producto
     * @param scanner Scanner para leer entrada del usuario
     * @param producto Producto cuyo código se va a modificar
     */
    private static void modificarCodigoProducto(Scanner scanner, Producto producto) {
        try {
            System.out.println("Código actual: " + producto.getCodigo());
            
            int nuevoCodigo = Validador.solicitarEntero(scanner, 
                             "Introduzca el nuevo código (debe ser único)", 
                             1, 999999);
            
            // Verificar que el nuevo código no existe
            if (productoDAO.existeCodigo(nuevoCodigo)) {
                System.out.println("Error: El código " + nuevoCodigo + " ya existe. Elija un código diferente.");
                return;
            }
            
            // Confirmar el cambio
            if (Validador.confirmar(scanner, 
                "¿Está seguro de cambiar el código de " + producto.getCodigo() + " a " + nuevoCodigo + "?")) {
                
                int codigoAntiguo = producto.getCodigo();
                
                // Actualizar el código en la base de datos
                productoDAO.actualizarCodigoProducto(codigoAntiguo, nuevoCodigo);
                
                // Actualizar el código en el objeto
                producto.setCodigo(nuevoCodigo);
                
                System.out.println("Código modificado con éxito de " + codigoAntiguo + " a " + nuevoCodigo + ".");
            } else {
                System.out.println("Cambio de código cancelado.");
            }
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
}