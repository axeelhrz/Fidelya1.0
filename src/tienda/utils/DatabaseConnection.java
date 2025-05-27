package tienda.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Clase utilitaria para gestionar la conexión a la base de datos.
 * Proporciona métodos estáticos para abrir y cerrar conexiones.
 */
public class DatabaseConnection {
    // Constantes de conexión
    private static final String URL = "jdbc:mysql://localhost:3306/tienda";
    private static final String USER = "root";
    private static final String PASSWORD = "admin";
    
    /**
     * Obtiene una conexión a la base de datos
     * @return Conexión a la base de datos
     * @throws SQLException Si hay un error al conectar
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
    
    /**
     * Cierra una conexión a la base de datos
     * @param conn Conexión a cerrar
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ignored) {
                // Ignoramos la excepción al cerrar
            }
        }
    }
    
    /**
     * Cierra un PreparedStatement
     * @param stmt PreparedStatement a cerrar
     */
    public static void close(PreparedStatement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException ignored) {
                // Ignoramos la excepción al cerrar
            }
        }
    }
    
    /**
     * Cierra un ResultSet
     * @param rs ResultSet a cerrar
     */
    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException ignored) {
                // Ignoramos la excepción al cerrar
            }
        }
    }
    
    /**
     * Cierra todos los recursos de base de datos
     * @param conn Conexión a cerrar
     * @param stmt PreparedStatement a cerrar
     * @param rs ResultSet a cerrar
     */
    public static void close(Connection conn, PreparedStatement stmt, ResultSet rs) {
        close(rs);
        close(stmt);
        close(conn);
    }
}