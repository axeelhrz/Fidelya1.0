'use client'

import { useState, useEffect } from 'react'
import { Product, ProductType, ProductWithAvailability } from '@/types'
import { ProductService } from '@/lib/products/productService'
import { toast } from 'sonner'

export function useProducts(date?: string, type?: ProductType) {
  const [products, setProducts] = useState<ProductWithAvailability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!date) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await ProductService.getProductsWithAvailability(date, type)
        setProducts(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading products'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [date, type])

  const refreshProducts = async () => {
    if (!date) return
    
    try {
      setIsLoading(true)
      const data = await ProductService.getProductsWithAvailability(date, type)
      setProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing products'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    products,
    isLoading,
    error,
    refreshProducts,
  }
}

export function useWeeklyProducts(startDate?: Date) {
  const [weeklyProducts, setWeeklyProducts] = useState<Record<string, Product[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeeklyProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await ProductService.getWeeklyProducts(startDate)
        setWeeklyProducts(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading weekly products'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklyProducts()
  }, [startDate])

  const refreshWeeklyProducts = async () => {
    try {
      setIsLoading(true)
      const data = await ProductService.getWeeklyProducts(startDate)
      setWeeklyProducts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refreshing weekly products'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    weeklyProducts,
    isLoading,
    error,
    refreshWeeklyProducts,
  }
}