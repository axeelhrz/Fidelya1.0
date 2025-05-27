package tienda;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Scanner;
import java.util.List;
import java.util.Scanner;

import tienda.empleados.Empleado;
import tienda.empleados.EmpleadoManager;
import tienda.pedidos.PedidoManager;
import tienda.productos.Oferta;
import tienda.productos.Oferta2x1;
import tienda.productos.Oferta3x2;
import tienda.productos.OfertaPorcentaje;
import tienda.empleados.AutenticacionException;
import tienda.empleados.Empleado;
import tienda.empleados.EmpleadoDAO;
import tienda.pedidos.Pedido;
import tienda.pedidos.PedidoDAO;
import tienda.pedidos.PedidoManager;
import tienda.productos.Producto;
import tienda.productos.ProductoNoPerecedero;
import tienda.productos.ProductoPerecedero;
import tienda.utils.Clonador;
import tienda.productos.ProductoDAO;
import tienda.utils.Constantes;
import tienda.utils.Validador;
import tienda.utils.DatabaseException;
import tienda.utils.Validador;

/**
 * Clase principal que contiene el punto de entrada de la aplicación.
 * Versión adaptada para usar base de datos MySQL.
 */
public class Main {
    private static final int MAX_EMPLEADOS = 20;
    private static final int MAX_PRODUCTOS = 50;
    private static final int MAX_OFERTAS = 10;

    private static EmpleadoManager empleadoManager;
    private static Producto[] productos;
    private static int numProductos;
    private static Oferta[] ofertas;
    private static int numOfertas;
    private static EmpleadoDAO empleadoDAO;
    private static ProductoDAO productoDAO;
    private static PedidoDAO pedidoDAO;
    private static Empleado empleadoActual;
    private static List<Producto> productos;
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Inicializar gestores y arrays
        empleadoManager = new EmpleadoManager(MAX_EMPLEADOS);
        productos = new Producto[MAX_PRODUCTOS];
        numProductos = 0;
        ofertas = new Oferta[MAX_OFERTAS];
        numOfertas = 0;

        // Cargar datos desde archivos
        try {
            cargarDatos();
        } catch (IOException e) {
            System.out.println("Error al cargar los datos: " + e.getMessage());
            return;
        }

        // Bucle principal
        boolean salir = false;
        while (!salir) {
            // Si no hay empleado con sesión, solicitar login
            if (empleadoManager.getEmpleadoActual() == null) {
                boolean loginExitoso = empleadoManager.login(scanner);
                if (!loginExitoso) {
                    // Preguntar si desea intentar de nuevo o salir
                    if (!Validador.confirmar(scanner, "¿Desea intentar de nuevo?")) {
                        salir = true;
                    }
                    continue;
                }
            }

            // Mostrar menú principal
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
                    empleadoManager.cambiarPassword(scanner);
                    break;
                case Constantes.OPCION_CERRAR_SESION:
                    empleadoManager.cerrarSesion();
                    break;
            }
        }

        System.out.println("¡Gracias por utilizar el sistema de gestión de tienda!");
        scanner.close();
    }

    /**
     * Muestra el menú principal de la aplicación
     */
    private static void mostrarMenu() {
        Empleado empleado = empleadoManager.getEmpleadoActual();
        System.out.println("\n=================================================");
        System.out.println("      SISTEMA DE GESTIÓN DE TIENDA - MENÚ        ");
        System.out.println("=================================================");
        System.out.println("Empleado: " + empleado.getNombre() + " (Nivel: " + empleado.getNivel() + ")");
        System.out.println("Productividad actual: " + String.format("%.2f", empleado.getProductividad()) + "€");
        System.out.println("-------------------------------------------------");
        System.out.println("1. Hacer pedido");
        System.out.println("2. Modificar productos");
        System.out.println("3. Cambiar contraseña");
        System.out.println("4. Cerrar sesión");
        System.out.println("=================================================");
    }

    /**
     * Carga los datos desde los archivos
     * @throws IOException Si hay error al leer los archivos
     */
    private static void cargarDatos() throws IOException {
        // Cargar ofertas
        cargarOfertas();

        // Inicializar DAOs
        empleadoDAO = new EmpleadoDAO();
        productoDAO = new ProductoDAO();
        pedidoDAO = new PedidoDAO();
        // Cargar productos
        cargarProductos();

        // Cargar empleados
        empleadoManager.cargarEmpleados(Constantes.RUTA_EMPLEADOS);
    }

    /**
     * Carga las ofertas desde el archivo
     * @throws IOException Si hay error al leer el archivo
     */
    private static void cargarOfertas() throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(Constantes.RUTA_OFERTAS))) {
            String linea;
            while ((linea = br.readLine()) != null && numOfertas < ofertas.length) {
                String[] datos = linea.split(Constantes.SEPARADOR);
                if (datos.length >= 2) {
                    int codigo = Integer.parseInt(datos[0]);
                    String tipo = datos[1];

                    Oferta oferta = null;
                    if (tipo.equals(Constantes.OFERTA_2X1)) {
                        oferta = new Oferta2x1(codigo);
                    } else if (tipo.equals(Constantes.OFERTA_3X2)) {
                        oferta = new Oferta3x2(codigo);
                    } else if (tipo.equals(Constantes.OFERTA_PORCENTAJE) && datos.length >= 4) {
                        double porcentaje = Double.parseDouble(datos[2]);
                        int maximoUnidades = Integer.parseInt(datos[3]);
                        oferta = new OfertaPorcentaje(codigo, porcentaje, maximoUnidades);
                    }

                    if (oferta != null) {
                        ofertas[numOfertas++] = oferta;
                    }
                }
            }
            System.out.println("Se han cargado " + numOfertas + " ofertas.");
        }
    }

    /**
     * Carga los productos desde el archivo
     * @throws IOException Si hay error al leer el archivo
     */
    private static void cargarProductos() throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(Constantes.RUTA_PRODUCTOS))) {
            String linea;
            while ((linea = br.readLine()) != null && numProductos < productos.length) {
                String[] datos = linea.split(Constantes.SEPARADOR);
                if (datos.length >= 5) {
                    int codigo = Integer.parseInt(datos[0]);
                    String nombre = datos[1];
                    double precio = Double.parseDouble(datos[2]);
                    int stock = Integer.parseInt(datos[3]);
                    String tipo = datos[4];

                    Producto producto = null;
                    if (tipo.equals(Constantes.TIPO_PERECEDERO) && datos.length >= 6) {
                        int diasParaCaducar = Integer.parseInt(datos[5]);
                        producto = new ProductoPerecedero(codigo, nombre, precio, stock, diasParaCaducar);
                    } else if (tipo.equals(Constantes.TIPO_NO_PERECEDERO) && datos.length >= 6) {
                        String codigoOferta = datos[5];
                        Oferta oferta = null;

                        if (!codigoOferta.equals(Constantes.SIN_OFERTA)) {
                            int codOferta = Integer.parseInt(codigoOferta);
                            oferta = buscarOfertaPorCodigo(codOferta);
                        }

                        producto = new ProductoNoPerecedero(codigo, nombre, precio, stock, oferta);
                    }

                    if (producto != null) {
                        productos[numProductos++] = producto;
                    }
                }
            }
            System.out.println("Se han cargado " + numProductos + " productos.");
        }
    }

    /**
     * Busca una oferta por su código
     * @param codigo Código de la oferta a buscar
     * @return Oferta encontrada o null si no existe
     */
    private static Oferta buscarOfertaPorCodigo(int codigo) {
        for (int i = 0; i < numOfertas; i++) {
            if (ofertas[i].getCodigo() == codigo) {
                return ofertas[i];
            }
        }
        return null;
    }

    /**
     * Proceso para hacer un pedido
     * @param scanner Scanner para leer entrada del usuario
     */
    private static void hacerPedido(Scanner scanner) {
        // Crear copias de los productos para no afectar al stock original hasta confirmar
        Producto[] productosCopia = new Producto[numProductos];
        for (int i = 0; i < numProductos; i++) {
            productosCopia[i] = Clonador.clonarProducto(productos[i]);
        }

        // Crear pedido
        PedidoManager.crearPedido(scanner, empleadoManager.getEmpleadoActual(), productosCopia, numProductos);

        // Confirmar cambios en el stock
        if (Validador.confirmar(scanner, "¿Confirmar pedido y actualizar stock?")) {
            // Actualizar stock en los productos originales
            for (int i = 0; i < numProductos; i++) {
                productos[i].setStock(productosCopia[i].getStock());
            }
            System.out.println("Pedido confirmado y stock actualizado.");
        } else {
            System.out.println("Pedido cancelado. No se ha modificado el stock.");
        }
    }

    /**
     * Proceso para modificar productos
     * @param scanner Scanner para leer entrada del usuario
     */
    private static void modificarProductos(Scanner scanner) {
        System.out.println("\n=== MODIFICAR PRODUCTOS ===");

        // Mostrar productos disponibles
        System.out.println("\nProductos disponibles:");
        for (int i = 0; i < numProductos; i++) {
            System.out.println((i + 1) + ". " + productos[i].toString());
        }

        // Seleccionar producto
        int indiceProducto = Validador.solicitarEntero(scanner,
                            "Seleccione un producto a modificar (0 para cancelar)",
                            0, numProductos) - 1;

        if (indiceProducto == -1) {
            System.out.println("Operación cancelada.");
        try {
            productos = productoDAO.obtenerTodos();
            System.out.println("Se han cargado " + productos.size() + " productos.");
        } catch (DatabaseException e) {
            System.out.println("Error al cargar productos: " + e.getMessage());
            e.printStackTrace();
            return;
        }
        
        Producto producto = productos[indiceProducto];

        // Mostrar menú de modificación
        System.out.println("\nModificando: " + producto.toString());
        System.out.println("1. Modificar nombre");
        System.out.println("2. Modificar precio");
        System.out.println("3. Modificar stock");

        int opcion = Validador.solicitarEntero(scanner, "Seleccione qué desea modificar", 1, 3);

        // Bucle principal
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
            
            // Mostrar menú principal
            mostrarMenu();
            int opcion = Validador.solicitarEntero(scanner, "Seleccione una opción", 1, 4);
        switch (opcion) {
            case 1:
                String nuevoNombre = Validador.solicitarCadena(scanner, "Introduzca el nuevo nombre");
                producto.setNombre(nuevoNombre);
                System.out.println("Nombre modificado con éxito.");
                case Constantes.OPCION_HACER_PEDIDO:
                    hacerPedido(scanner);
                break;
            case 2:
                double nuevoPrecio = Validador.solicitarDouble(scanner, "Introduzca el nuevo precio");
                producto.setPrecio(nuevoPrecio);
                System.out.println("Precio modificado con éxito.");
                case Constantes.OPCION_MODIFICAR_PRODUCTOS:
                    modificarProductos(scanner);
                break;
            case 3:
                int nuevoStock = Validador.solicitarEntero(scanner, "Introduzca el nuevo stock", 0, 1000);
                producto.setStock(nuevoStock);
                System.out.println("Stock modificado con éxito.");
                case Constantes.OPCION_CAMBIAR_PASSWORD:
                    cambiarPassword(scanner);
                break;
                case Constantes.OPCION_CERRAR_SESION:
                    cerrarSesion();
                    break;
        }

        System.out.println("Producto actualizado: " + producto.toString());
    }
        
        System.out.println("¡Gracias por utilizar el sistema de gestión de tienda!");
        scanner.close();
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
            
            // Autenticar empleado
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
            productos = productoDAO.obtenerTodos();
            
            if (productos.isEmpty()) {
                System.out.println("No hay productos disponibles para hacer un pedido.");
                return;
            }
            
            // Crear pedido
            Pedido pedido = PedidoManager.crearPedido(scanner, empleadoActual, 
                                                     productos.toArray(new Producto[0]), 
                                                     productos.size());
            
            if (pedido != null && pedido.getNumDetalles() > 0) {
                // Confirmar pedido
                if (Validador.confirmar(scanner, "¿Confirmar pedido?")) {
                    // Guardar pedido en la base de datos (incluye actualización de stock)
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
            productos = productoDAO.obtenerTodos();
            
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
            
            // Actualizar producto en la base de datos
            productoDAO.actualizarProducto(producto);
            
            System.out.println("Producto actualizado: " + producto.toString());
            
        } catch (DatabaseException e) {
            System.out.println("Error de base de datos: " + e.getMessage());
        }
    }
}