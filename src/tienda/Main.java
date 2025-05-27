package tienda;

import java.util.Scanner;
import java.util.List;
import tienda.empleados.AutenticacionException;
import tienda.empleados.Empleado;
import tienda.empleados.EmpleadoDAO;
import tienda.pedidos.Pedido;
import tienda.pedidos.PedidoDAO;
import tienda.pedidos.DetallePedido;
import tienda.productos.Producto;
import tienda.productos.ProductoDAO;
import tienda.utils.Validador;
import tienda.utils.DatabaseException;


class Main {
    private static Empleado empleadoActual;
    private static List<Producto> productos;
    private static Scanner scanner;
    private static EmpleadoDAO empleadoDAO;
    private static ProductoDAO productoDAO;
    private static PedidoDAO pedidoDAO;
    // Removed unused field: private static Oferta[] ofertas;
    // private static final int MAX_OFERTAS = 20;
    
    /**
     * Punto de entrada principal de la aplicación
     */
    public static void main(String[] args) {
        try {
            scanner = new Scanner(System.in);
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
                    case 1:
                        hacerPedido(scanner);
                        break;
                    case 2:
                        modificarProductos(scanner);
                        break;
                    case 3:
                        cambiarPassword(scanner);
                        break;
                    case 4:
                        cerrarSesion();
                        salir = true;
                        break;
                    default:
                        System.out.println("Opción no válida.");
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

    private static void cerrarSesion() {
        empleadoActual = null;
        System.out.println("Sesión cerrada correctamente.");
    }

    /**
     * Actualiza la lista de productos desde la base de datos
     */
    private static void actualizarListaProductos() throws DatabaseException {
        productos = productoDAO.obtenerTodos();
        System.out.println("Se han cargado " + productos.size() + " productos.");
    }

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
 * Realiza el login del empleado
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

    private static boolean cambiarPassword(Scanner scanner) {
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
    private static void hacerPedido(Scanner scanner) {
    /**
     * Hacer un pedido
     */
    private static void hacerPedido(Scanner scanner) {
        try {
            // Recargar productos para tener el stock actualizado
            actualizarListaProductos();

            if (productos.isEmpty()) {
                System.out.println("No hay productos disponibles para hacer un pedido.");
                return;
            }

            // Crear nuevo pedido
            Pedido pedido = new Pedido(empleadoActual);
            // Mostrar productos disponibles
            System.out.println("\n=== PRODUCTOS DISPONIBLES ===");
            for (int i = 0; i < productos.size(); i++) {
                System.out.println((i + 1) + ". " + productos.get(i).toString());
            }
            
            // Permitir agregar productos al pedido
            boolean agregarMas = true;
            while (agregarMas) {
                int indiceProducto = Validador.solicitarEntero(scanner, "Seleccione el número del producto", 1, productos.size());
                int cantidad = Validador.solicitarEntero(scanner, "Introduzca la cantidad", 1, Integer.MAX_VALUE);
                Producto producto = productos.get(indiceProducto - 1);
                DetallePedido detalle = new DetallePedido(producto, cantidad);
                pedido.agregarDetalle(detalle);
                
                agregarMas = Validador.confirmar(scanner, "¿Desea agregar otro producto?");
            }

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
            } else {
                System.out.println("No se pudo crear el pedido.");
            }
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }

    /**
     * Modificar productos del catálogo
     */
    private static void modificarProductos(Scanner scanner) {
        System.out.println("\n=== MODIFICAR PRODUCTOS ===");

        try {
            // Recargar productos para tener datos actualizados
            actualizarListaProductos();
            
            for (int i = 0; i < productos.size(); i++) {
                System.out.println((i + 1) + ". " + productos.get(i).toString());
            }
            
            // Seleccionar producto
            int indiceProducto = Validador.solicitarEntero(scanner, "Seleccione el número del producto a modificar", 1, productos.size());

            // Solicitar nuevo nombre
            String nuevoNombre = Validador.solicitarCadena(scanner, "Introduzca el nuevo nombre del producto");

            // Solicitar nuevo precio
            double nuevoPrecio = Validador.solicitarDouble(scanner, "Introduzca el nuevo precio del producto");

            // Obtener el producto actual y actualizar sus campos
            Producto productoActual = productos.get(indiceProducto - 1);
            productoActual.setNombre(nuevoNombre);
            productoActual.setPrecio(nuevoPrecio);
            
            // Actualizar producto en la base de datos usando DAO
            productoDAO.actualizarProducto(productoActual);
            // El producto ya está actualizado en la lista
            productos.set(indiceProducto - 1, productoActual);

            System.out.println("Producto modificado con éxito.");
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
}
