package tienda.empleados;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import tienda.utils.DatabaseConnection;
import tienda.utils.DatabaseException;

/**
 * Data Access Object para la entidad Empleado.
 * Gestiona todas las operaciones de base de datos relacionadas con empleados.
 */
public class EmpleadoDAO {
    
    /**
     * Autentica a un empleado verificando su código y contraseña
     * @param codigo Código del empleado
     * @param password Contraseña del empleado
     * @return Empleado autenticado
     * @throws AutenticacionException Si el código o la contraseña son incorrectos
     * @throws DatabaseException Si hay un error de base de datos
     */
    public Empleado autenticar(int codigo, String password) throws AutenticacionException, DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            System.out.println("Intentando conectar a la base de datos...");
            conn = DatabaseConnection.getConnection();
            System.out.println("Conexión establecida.");
            
            // Consulta para buscar el empleado por código
            String sql = "SELECT * FROM empleados WHERE id_empleado = ?";
            System.out.println("Ejecutando consulta: " + sql + " con código: " + codigo);
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, codigo);
            
            rs = stmt.executeQuery();
            System.out.println("Consulta ejecutada.");
            
            // Si no existe el empleado, lanzar excepción
            if (!rs.next()) {
                System.out.println("No se encontró ningún empleado con el código: " + codigo);
                throw AutenticacionException.loginIncorrecto();
            }
            
            System.out.println("Empleado encontrado. Verificando contraseña...");
            // Verificar la contraseña
            String passwordAlmacenada = rs.getString("password");
            if (!passwordAlmacenada.equals(password)) {
                System.out.println("Contraseña incorrecta.");
                throw AutenticacionException.passwordIncorrecto();
            }
            
            System.out.println("Contraseña correcta. Creando objeto Empleado...");
            // Crear y devolver el empleado autenticado
            return crearEmpleadoDesdeResultSet(rs);
        } catch (SQLException e) {
            System.out.println("Error SQL: " + e.getMessage());
            e.printStackTrace();
            throw new DatabaseException("Error al autenticar empleado: " + e.getMessage(), e);
        } finally {
        try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
        } catch (SQLException e) {
                System.out.println("Error al cerrar recursos: " + e.getMessage());
        }
    }
    }
    
    /**
     * Actualiza la contraseña de un empleado
     * @param codigo Código del empleado
     * @param nuevaPassword Nueva contraseña
     * @throws DatabaseException Si hay un error de base de datos
     */
    public void actualizarPassword(int codigo, String nuevaPassword) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "UPDATE empleados SET password = ? WHERE id_empleado = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, nuevaPassword);
            stmt.setInt(2, codigo);
            
            int filasAfectadas = stmt.executeUpdate();
            if (filasAfectadas == 0) {
                throw new DatabaseException("No se pudo actualizar la contraseña. Empleado no encontrado.");
            }
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al actualizar contraseña", e);
        } finally {
            DatabaseConnection.close(conn, stmt, null);
        }
    }
    
    /**
     * Actualiza la productividad de un empleado
     * @param codigo Código del empleado
     * @param nuevaProductividad Nuevo valor de productividad
     * @throws DatabaseException Si hay un error de base de datos
     */
    public void actualizarProductividad(int codigo, double nuevaProductividad) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "UPDATE empleados SET productividad = ? WHERE id_empleado = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setDouble(1, nuevaProductividad);
            stmt.setInt(2, codigo);
            
            int filasAfectadas = stmt.executeUpdate();
            if (filasAfectadas == 0) {
                throw new DatabaseException("No se pudo actualizar la productividad. Empleado no encontrado.");
            }
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al actualizar productividad", e);
        } finally {
            DatabaseConnection.close(conn, stmt, null);
        }
    }
    
    /**
     * Obtiene todos los empleados de la base de datos
     * @return Lista de empleados
     * @throws DatabaseException Si hay un error de base de datos
     */
    public List<Empleado> obtenerTodos() throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        List<Empleado> empleados = new ArrayList<>();
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT * FROM empleados";
            stmt = conn.prepareStatement(sql);
            
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                empleados.add(crearEmpleadoDesdeResultSet(rs));
            }
            
            return empleados;
            
        } catch (SQLException e) {
            throw new DatabaseException("Error al obtener empleados", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
        }
    }
    
    /**
     * Busca un empleado por su código
     * @param codigo Código del empleado
     * @return Empleado encontrado o null si no existe
     * @throws DatabaseException Si hay un error de base de datos
     */
    public Empleado buscarPorCodigo(int codigo) throws DatabaseException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            
            String sql = "SELECT * FROM empleados WHERE id_empleado = ?";
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, codigo);
            
            rs = stmt.executeQuery();
            
            if (rs.next()) {
                return crearEmpleadoDesdeResultSet(rs);
        } else {
                return null;
        }
        
        } catch (SQLException e) {
            throw new DatabaseException("Error al buscar empleado", e);
        } finally {
            DatabaseConnection.close(conn, stmt, rs);
    }
}
    
    /**
     * Crea un objeto Empleado a partir de un ResultSet
     * @param rs ResultSet con los datos del empleado
     * @return Objeto Empleado creado
     * @throws SQLException Si hay un error al acceder a los datos
     */
    private Empleado crearEmpleadoDesdeResultSet(ResultSet rs) throws SQLException {
        try {
            int codigo = rs.getInt("id_empleado");
            String nombre = rs.getString("nombre");
            String password = rs.getString("password");
            int nivel = rs.getInt("nivel");
            String turno = rs.getString("turno");
            double productividad = rs.getDouble("productividad");
            
            Empleado empleado;
            
            if (turno.equals("Nocturno")) {
                double plusNocturnidad = rs.getDouble("plus_nocturnidad");
                empleado = new EmpleadoNocturno(codigo, nombre, password, nivel, plusNocturnidad);
            } else {
                double retencion = rs.getDouble("retencion");
                empleado = new EmpleadoDiurno(codigo, nombre, password, nivel, retencion);
            }
            
            empleado.setProductividad(productividad);
            return empleado;
        } catch (SQLException e) {
            System.out.println("Error al crear empleado desde ResultSet: " + e.getMessage());
            throw e;
        }
    }
}