package tienda.pedidos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import tienda.empleados.Empleado;
import tienda.productos.Producto;
import tienda.utils.DatabaseConnection;
import tienda.utils.DatabaseException;

/**
 * Data Access Object para la entidad Pedido.
 * Gestiona todas las operaciones de base de datos relacionadas con pedidos.
 */
public class PedidoDAO {
    
    /**
     * Guarda un pedido en la base de datos, incluyendo sus detalles
     * @param pedido Pedido a guardar
     * @throws DatabaseException Si hay un error de base de datos
     */
    public void guardarPedido(Pedido pedido) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmtPedido = null;
        PreparedStatement stmtDetalle = null;
        PreparedStatement stmtStock = null;
        ResultSet generatedKeys = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            // Iniciar transacción
            conn.setAutoCommit(false);
            
            // 1. Insertar el pedido
            String sqlPedido = "INSERT INTO pedidos (id_empleado) VALUES (?)";
            stmtPedido = conn.prepareStatement(sqlPedido, Statement.RETURN_GENERATED_KEYS);
            stmtPedido.setInt(1, pedido.getEmpleado().getCodigo());
            
            stmtPedido.executeUpdate();
            
            // Obtener el ID generado para el pedido
            generatedKeys = stmtPedido.getGeneratedKeys();
            if (!generatedKeys.next()) {
                throw new DatabaseException("No se pudo obtener el ID del pedido creado.");
            }
            
            int idPedido = generatedKeys.getInt(1);
            
            // 2. Insertar los detalles del pedido
            String sqlDetalle = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad) VALUES (?, ?, ?)";
            stmtDetalle = conn.prepareStatement(sqlDetalle);
            
            // 3. Preparar la actualización de stock
            String sqlStock = "UPDATE productos SET unidades = unidades - ? WHERE id_producto = ?";
            stmtStock = conn.prepareStatement(sqlStock);
            
            // Procesar cada detalle del pedido
            DetallePedido[] detalles = pedido.getDetalles();
            for (int i = 0; i < pedido.getNumDetalles(); i++) {
                DetallePedido detalle = detalles[i];
                Producto producto = detalle.getProducto();
                int cantidad = detalle.getCantidad();
                
                // Insertar detalle
                stmtDetalle.setInt(1, idPedido);
                stmtDetalle.setInt(2, producto.getCodigo());
                stmtDetalle.setInt(3, cantidad);
                stmtDetalle.executeUpdate();
                
                // Actualizar stock
                stmtStock.setInt(1, cantidad);
                stmtStock.setInt(2, producto.getCodigo());
                stmtStock.executeUpdate();
            }
            
            // Confirmar transacción
            conn.commit();
            
        } catch (SQLException e) {
            // Rollback en caso de error
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    throw new DatabaseException("Error al hacer rollback de la transacción", ex);
                }
            }
            throw new DatabaseException("Error al guardar pedido", e);
        } finally {
            // Restaurar autocommit
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                } catch (SQLException ignored) {
                    // Ignoramos la excepción
                }
            }
            
            DatabaseConnection.close(generatedKeys);
            DatabaseConnection.close(stmtStock);
            DatabaseConnection.close(stmtDetalle);
            DatabaseConnection.close(stmtPedido);
            DatabaseConnection.close(conn);
        }
    }
    
    /**
     * Actualiza la productividad del empleado después de un pedido
     * @param empleado Empleado a actualizar
     * @param montoPedido Monto del pedido realizado
     * @throws DatabaseException Si hay un error de base de datos
     */
    public void actualizarProductividadEmpleado(Empleado empleado, double montoPedido) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        
        try {
            // Calcular la gratificación
            double gratificacion = empleado.calcularGratificacion(montoPedido);
            
            conn = DatabaseConnection.getConnection();
            
            String sql = "UPDATE empleados SET productividad = productividad + ? WHERE id_empleado = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setDouble(1, gratificacion);
            stmt.setInt(2, empleado.getCodigo());
            
            int filasAfectadas = stmt.executeUpdate();
            if (filasAfectadas == 0) {
                throw new DatabaseException("No se pudo actualizar la productividad. Empleado no encontrado.");
            }
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al actualizar productividad del empleado", e);
        } finally {
            DatabaseConnection.close(conn, stmt, null);
        }
    }
}