package tienda.productos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import tienda.utils.DatabaseConnection;
import tienda.utils.DatabaseException;

/**
 * Data Access Object para la entidad Producto.
 * Gestiona todas las operaciones de base de datos relacionadas con productos.
 */
public class ProductoDAO {
    
    /**
     * Obtiene todos los productos de la base de datos
     * @return Lista de productos
     * @throws DatabaseException Si hay un error de base de datos
     */
    public List<Producto> obtenerTodos() throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Producto> productos = new ArrayList<>();
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT p.*, o.tipo as tipo_oferta, o.porcentaje_descuento, o.max_unidades " +
                         "FROM productos p " +
                         "LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta";
            stmt = conn.prepareStatement(sql);
            
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                productos.add(crearProductoDesdeResultSet(rs));
            }
            
            return productos;
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al obtener productos", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Actualiza un producto en la base de datos
     * @param producto Producto a actualizar
     * @throws DatabaseException Si hay un error de base de datos
     * @throws ProductoException Si el nombre o código ya existe
     */
    public void actualizarProducto(Producto producto) throws DatabaseException, ProductoException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            // Verificar si el nombre ya existe en otro producto
            String sqlVerificarNombre = "SELECT COUNT(*) FROM productos WHERE nombre = ? AND id_producto != ?";
            stmt = conn.prepareStatement(sqlVerificarNombre);
            stmt.setString(1, producto.getNombre());
            stmt.setInt(2, producto.getCodigo());
            rs = stmt.executeQuery();
            
            if (rs.next() && rs.getInt(1) > 0) {
                throw new ProductoException(444, "Error. El nombre del producto ya existe");
            }
            
            // Cerrar recursos
            rs.close();
            stmt.close();
            
            // Actualizar el producto
            String sql;
            if (producto instanceof ProductoPerecedero) {
                sql = "UPDATE productos SET nombre = ?, precio = ?, unidades = ?, dias_para_caducar = ? " +
                      "WHERE id_producto = ?";
            stmt = conn.prepareStatement(sql);
                stmt.setString(1, producto.getNombre());
                stmt.setDouble(2, producto.getPrecio());
                stmt.setInt(3, producto.getStock());
                stmt.setInt(4, ((ProductoPerecedero) producto).getDiasParaCaducar());
                stmt.setInt(5, producto.getCodigo());
        } else {
                sql = "UPDATE productos SET nombre = ?, precio = ?, unidades = ? " +
                      "WHERE id_producto = ?";
                stmt = conn.prepareStatement(sql);
                stmt.setString(1, producto.getNombre());
                stmt.setDouble(2, producto.getPrecio());
                stmt.setInt(3, producto.getStock());
                stmt.setInt(4, producto.getCodigo());
            }
            
            stmt.executeUpdate();
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al actualizar producto", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Busca un producto por su ID
     * @param id ID del producto
     * @return Producto encontrado o null si no existe
     * @throws DatabaseException Si hay un error de base de datos
     */
    public Producto buscarPorId(int id) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT p.*, o.tipo as tipo_oferta, o.porcentaje_descuento, o.max_unidades " +
                         "FROM productos p " +
                         "LEFT JOIN ofertas o ON p.id_oferta = o.id_oferta " +
                         "WHERE p.id_producto = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return crearProductoDesdeResultSet(rs);
            } else {
                return null;
            }
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al buscar producto", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Verifica si un código de producto ya existe
     * @param codigo Código a verificar
     * @return true si el código ya existe, false en caso contrario
     * @throws DatabaseException Si hay un error de base de datos
     */
    public boolean existeCodigo(int codigo) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT COUNT(*) FROM productos WHERE id_producto = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, codigo);
            
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
            
            return false;
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al verificar código de producto", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Verifica si un nombre de producto ya existe
     * @param nombre Nombre a verificar
     * @return true si el nombre ya existe, false en caso contrario
     * @throws DatabaseException Si hay un error de base de datos
     */
    public boolean existeNombre(String nombre) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT COUNT(*) FROM productos WHERE nombre = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, nombre);
            
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
            
            return false;
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al verificar nombre de producto", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Actualiza el stock de un producto
     * @param idProducto ID del producto
     * @param nuevoStock Nuevo valor de stock
     * @throws DatabaseException Si hay un error de base de datos
     */
    public void actualizarStock(int idProducto, int nuevoStock) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "UPDATE productos SET unidades = ? WHERE id_producto = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, nuevoStock);
            stmt.setInt(2, idProducto);
            
            stmt.executeUpdate();
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al actualizar stock", e);
        } finally {
            DatabaseConnection.close(conn, stmt, null);
        }
    }
    
    /**
     * Crea un objeto Producto a partir de un ResultSet
     * @param rs ResultSet con los datos del producto
     * @return Objeto Producto creado
     * @throws SQLException Si hay un error al acceder a los datos
     */
    private Producto crearProductoDesdeResultSet(ResultSet rs) throws SQLException {
        int codigo = rs.getInt("id_producto");
        String nombre = rs.getString("nombre");
        double precio = rs.getDouble("precio");
        int stock = rs.getInt("unidades");
        String tipo = rs.getString("tipo");
        
        if (tipo.equals("Perecedero")) {
            int diasParaCaducar = rs.getInt("dias_para_caducar");
            return new ProductoPerecedero(codigo, nombre, precio, stock, diasParaCaducar);
        } else {
            // Producto no perecedero, verificar si tiene oferta
            Integer idOferta = rs.getObject("id_oferta") != null ? rs.getInt("id_oferta") : null;
            Oferta oferta = null;
            
            if (idOferta != null) {
                String tipoOferta = rs.getString("tipo_oferta");
                
                if (tipoOferta.equals("2x1")) {
                    oferta = new Oferta2x1(idOferta);
                } else if (tipoOferta.equals("3x2")) {
                    oferta = new Oferta3x2(idOferta);
                } else if (tipoOferta.equals("porcentaje")) {
                    double porcentaje = rs.getDouble("porcentaje_descuento");
                    int maxUnidades = rs.getInt("max_unidades");
                    oferta = new OfertaPorcentaje(idOferta, porcentaje, maxUnidades);
                }
            }
            
            return new ProductoNoPerecedero(codigo, nombre, precio, stock, oferta);
        }
    }
}