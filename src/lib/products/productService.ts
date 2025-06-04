import { supabase } from '@/lib/supabase/client'
import { createSupabaseServiceClient } from '@/lib/supabase/client'
import { Product, ProductType, ProductFilters } from '@/types'
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'

export class ProductService {
  private static serviceClient = createSupabaseServiceClient()

  // Get products for a specific date
  static async getProductsByDate(date: string, type?: ProductType) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('available_date', date)
      .eq('is_active', true)
      .order('type')
      .order('name')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Error fetching products: ${error.message}`)
    }

    return data || []
  }

  // Get products for current week
  static async getWeeklyProducts(startDate?: Date) {
    const start = startDate ? startOfWeek(startDate, { weekStartsOn: 1 }) : startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(start, { weekStartsOn: 1 })

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('available_date', format(start, 'yyyy-MM-dd'))
      .lte('available_date', format(end, 'yyyy-MM-dd'))
      .eq('is_active', true)
      .order('available_date')
      .order('type')
      .order('name')

    if (error) {
      throw new Error(`Error fetching weekly products: ${error.message}`)
    }

    // Group by date
    const groupedProducts = (data || []).reduce((acc, product) => {
      const date = product.available_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(product)
      return acc
    }, {} as Record<string, Product[]>)

    return groupedProducts
  }

  // Check if orders can be placed for a date
  static async canPlaceOrder(date: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('can_place_order', { target_date: date })

    if (error) {
      console.error('Error checking order availability:', error)
      return false
    }

    return data || false
  }

  // Get products with order availability
  static async getProductsWithAvailability(date: string, type?: ProductType) {
    const [products, canOrder] = await Promise.all([
      this.getProductsByDate(date, type),
      this.canPlaceOrder(date),
    ])

    return products.map(product => ({
      ...product,
      can_order: canOrder,
      is_available_today: product.available_date === format(new Date(), 'yyyy-MM-dd'),
    }))
  }

  // Admin functions
  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.serviceClient
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      throw new Error(`Error creating product: ${error.message}`)
    }

    return data
  }

  static async updateProduct(id: string, productData: Partial<Product>) {
    const { data, error } = await this.serviceClient
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating product: ${error.message}`)
    }

    return data
  }

  static async deleteProduct(id: string) {
    const { error } = await this.serviceClient
      .from('products')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw new Error(`Error deleting product: ${error.message}`)
    }

    return true
  }

  // Bulk operations for menu management
  static async createWeeklyMenu(startDate: Date, menuData: {
    [key: string]: Omit<Product, 'id' | 'available_date' | 'day_of_week' | 'created_at' | 'updated_at'>[]
  }) {
    const products = []

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const dayOfWeek = format(currentDate, 'EEEE', { locale: es })
      
      const dayProducts = menuData[dateStr] || []
      
      for (const productData of dayProducts) {
        products.push({
          ...productData,
          available_date: dateStr,
          day_of_week: dayOfWeek,
        })
      }
    }

    const { data, error } = await this.serviceClient
      .from('products')
      .insert(products)
      .select()

    if (error) {
      throw new Error(`Error creating weekly menu: ${error.message}`)
    }

    return data
  }

  static async getProductFiltered(filters: ProductFilters) {
    let query = this.serviceClient
      .from('products')
      .select('*')

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.date) {
      query = query.eq('available_date', filters.date)
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    query = query.order('available_date', { ascending: false })
      .order('type')
      .order('name')

    const { data, error } = await query

    if (error) {
      throw new Error(`Error fetching filtered products: ${error.message}`)
    }

    return data || []
  }

  // Utility functions
  static formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(priceInCents / 100)
  }

  static getDayOfWeekInSpanish(date: Date): string {
    return format(date, 'EEEE', { locale: es })
  }

  static getProductTypeLabel(type: ProductType): string {
    const labels = {
      almuerzo: 'Almuerzo',
      colacion: 'Colación',
    }
    return labels[type] || type
  }
}