        success: true,
        user: data.user,
        guardian
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: 'Error interno del servidor' }
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: 'Error cerrando sesión' }
    }
  }

  /**
   * Recuperar contraseña
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error en reset password:', error)
      return { success: false, error: 'Error enviando email de recuperación' }
    }
  }

  /**
   * Actualizar contraseña
   */
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error actualizando contraseña:', error)
      return { success: false, error: 'Error actualizando contraseña' }
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(): Promise<{ user: User | null; guardian: Guardian | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { user: null, guardian: null }
      }

      const { data: guardian } = await supabase
        .from('guardians')
        .select('*')
        .eq('user_id', user.id)
        .single()

      return { user, guardian }
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error)
      return { user: null, guardian: null }
    }
  }

  /**
   * Verificar si el usuario es staff
   */
  static async isStaff(userId: string): Promise<boolean> {
    try {
      const { data: guardian } = await supabase
        .from('guardians')
        .select('is_staff')
        .eq('user_id', userId)
        .single()

      return guardian?.is_staff || false
    } catch (error) {
      console.error('Error verificando staff:', error)
      return false
    }
  }
}