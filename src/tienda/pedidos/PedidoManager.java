package tienda.pedidos;

import tienda.empleados.Empleado;
import tienda.productos.Producto;
import tienda.productos.ProductoException;
import tienda.utils.Clonador;
import tienda.utils.Constantes;
import tienda.utils.Validador;

import java.util.Scanner;

/**
 * Clase para gestionar la creación y manipulación de pedidos.
 */
public class PedidoManager {
    
    /**
     * Crea un nuevo pedido interactivamente
     * @param scanner Scanner para leer entrada del usuario
     * @param empleado Empleado que realiza el pedido
     * @param productos Array de productos disponibles
     * @param numProductos Número de productos en el array
     * @return Pedido creado o null si se canceló
     */
    public static Pedido crearPedido(Scanner scanner, Empleado empleado, 
                                    Producto[] productos, int numProductos) {
        if (numProductos == 0) {
            System.out.println("No hay productos disponibles para hacer un pedido.");
            return null;
}

        System.out.println("\n=== CREAR NUEVO PEDIDO ===");
        
        // Solicitar número de tipos de productos
        int numTiposProductos = Validador.solicitarEntero(scanner, 
                               "Introduzca el número de tipos de productos a comprar", 
                               1, numProductos);
        Pedido pedido = new Pedido(empleado, Constantes.MAX_DETALLES_PEDIDO);
        boolean pedidoTerminado = false;
        
        while (!pedidoTerminado) {
            // Mostrar menú de opciones
            System.out.println("\n=== MENÚ DE PEDIDO ===");
            System.out.println("1.1. Añadir un tipo de producto");
            System.out.println("1.2. Visualizar precio total");
            System.out.println("1.3. Imprimir factura");
            System.out.println("1.4. Terminar pedido");
            
            // Solicitar opción
            double opcion = Validador.solicitarDouble(scanner, "Seleccione una opción");
            
            if (opcion == 1.1) {
                // Verificar si ya se añadieron todos los tipos de productos
                if (pedido.getNumDetalles() >= numTiposProductos) {
                    System.out.println("Error: Ya ha añadido todos los tipos de productos indicados.");
                    continue;
            }
            
                // Mostrar productos disponibles
                System.out.println("\nProductos disponibles:");
                for (int i = 0; i < numProductos; i++) {
                    System.out.println((i + 1) + ". " + productos[i].toString());
                }
                
            // Seleccionar producto
                int indiceProducto = Validador.solicitarEntero(scanner, 
                                    "Seleccione un producto (0 para cancelar)", 
                                0, numProductos) - 1;
            
            if (indiceProducto == -1) {
                    continue; // Volver al menú
            }
            
            Producto productoSeleccionado = productos[indiceProducto];
            
                // Verificar si el producto ya ha sido añadido
                if (productoYaAnadido(pedido, productoSeleccionado)) {
                    System.out.println("Error: Este producto ya ha sido añadido al pedido.");
                    continue;
                }
                
                try {
            // Solicitar cantidad
                    int cantidad = Validador.solicitarEntero(scanner, 
                                  "Introduzca la cantidad (máximo " + productoSeleccionado.getStock() + ")", 
                                  1, Integer.MAX_VALUE);
                    
                    // Verificar stock
                    if (cantidad > productoSeleccionado.getStock()) {
                        throw ProductoException.stockInsuficiente();
                    }
            
                    // Clonar el producto para el pedido
                    Producto productoClonado = Clonador.clonarProducto(productoSeleccionado);
                    
                    // Establecer el stock del clon a la cantidad solicitada
                    productoClonado.setStock(cantidad);
                    
            // Crear detalle y añadir al pedido
                    DetallePedido detalle = new DetallePedido(productoClonado, cantidad);
            pedido.agregarDetalle(detalle);
            
                    System.out.println("Producto añadido al pedido.");
                    
                } catch (ProductoException e) {
                    System.out.println("Error " + e.getCodigo() + ": " + e.getMessage());
                }
                
            } else if (opcion == 1.2) {
                // Visualizar precio total
        if (pedido.getNumDetalles() == 0) {
                    System.out.println("El pedido está vacío.");
                } else {
                    System.out.println("Precio total del pedido: " + 
                                      String.format("%.2f", pedido.calcularTotal()) + "€");
        }
        
            } else if (opcion == 1.3) {
                // Imprimir factura
                if (pedido.getNumDetalles() == 0) {
                    System.out.println("El pedido está vacío, no se puede generar factura.");
                } else {
        System.out.println("\n" + pedido.generarFactura());
    }
                
            } else if (opcion == 1.4) {
                // Terminar pedido
                pedidoTerminado = true;
            } else {
                System.out.println("Opción no válida.");
}
        }
        
        // Verificar si el pedido tiene al menos un detalle
        if (pedido.getNumDetalles() == 0) {
            System.out.println("Pedido cancelado: no se seleccionaron productos.");
            return null;
        }
        
        return pedido;
    }
    
    /**
     * Verifica si un producto ya ha sido añadido al pedido
     * @param pedido Pedido a verificar
     * @param producto Producto a buscar
     * @return true si el producto ya está en el pedido, false en caso contrario
     */
    private static boolean productoYaAnadido(Pedido pedido, Producto producto) {
        DetallePedido[] detalles = pedido.getDetalles();
        for (int i = 0; i < pedido.getNumDetalles(); i++) {
            if (detalles[i].getProducto().getCodigo() == producto.getCodigo()) {
                return true;
            }
        }
        return false;
    }
}