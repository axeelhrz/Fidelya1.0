package tienda.pedidos;

import tienda.empleados.Empleado;
import tienda.productos.Producto;
import java.util.Scanner;
import tienda.utils.Validador;

/**
 * Clase para gestionar la creación y manipulación de pedidos.
 */
public class PedidoManager {
    private static final int MAX_DETALLES_PEDIDO = 10;
    
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

        Pedido pedido = new Pedido(empleado, MAX_DETALLES_PEDIDO);
        boolean seguirAgregando = true;
        
        System.out.println("\n=== CREAR NUEVO PEDIDO ===");
        
        while (seguirAgregando && pedido.getNumDetalles() < MAX_DETALLES_PEDIDO) {
            // Mostrar productos disponibles
            System.out.println("\nProductos disponibles:");
            for (int i = 0; i < numProductos; i++) {
                System.out.println((i + 1) + ". " + productos[i].toString());
            }
            
            // Seleccionar producto
            int indiceProducto = Validador.solicitarEntero(scanner, 
                                "Seleccione un producto (0 para finalizar)", 
                                0, numProductos) - 1;
            
            if (indiceProducto == -1) {
                // Usuario eligió finalizar
                break;
            }
            
            Producto productoSeleccionado = productos[indiceProducto];
            
            // Solicitar cantidad
            int cantidad = Validador.solicitarEntero(scanner, 
                          "Introduzca la cantidad (máximo " + productoSeleccionado.getStock() + ")", 
                          1, productoSeleccionado.getStock());
            
            // Crear detalle y añadir al pedido
            DetallePedido detalle = new DetallePedido(productoSeleccionado, cantidad);
            pedido.agregarDetalle(detalle);
            
            // Reducir stock
            productoSeleccionado.reducirStock(cantidad);
            
            // Preguntar si desea seguir añadiendo productos
            if (pedido.getNumDetalles() < MAX_DETALLES_PEDIDO) {
                seguirAgregando = Validador.confirmar(scanner, "¿Desea añadir más productos?");
            } else {
                System.out.println("Ha alcanzado el máximo de productos por pedido.");
            }
        }
        
        // Verificar si el pedido tiene al menos un detalle
        if (pedido.getNumDetalles() == 0) {
            System.out.println("Pedido cancelado: no se seleccionaron productos.");
            return null;
        }
        
        // Mostrar factura
        System.out.println("\n" + pedido.generarFactura());
        
        return pedido;
    }
}