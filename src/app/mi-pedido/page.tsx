"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/app/lib/firebase'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { OrderHeader } from '@/components/mi-pedido/OrderHeader'
import { DaySelector } from '@/components/mi-pedido/DaySelector'
import { OrderSummary } from '@/components/mi-pedido/OrderSummary'
import { PaymentButton } from '@/components/mi-pedido/PaymentButton'
import { useWeeklyMenuData } from '@/hooks/useWeeklyMenuData'
import { useOrderManagement } from '@/hooks/useOrderManagement'
import { User } from '@/types/panel'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function MiPedidoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    weekInfo,
    menuData,
    weekDays,
    weekDisplayText,
    isLoading: isMenuLoading,
    error: menuError
  } = useWeeklyMenuData()

  const {
    isLoading: isOrderLoading,
    isSaving,
    validation,
    isReadOnly,
    saveOrder,
    orderSummary
  } = useOrderManagement({
    user,
    weekStart: weekInfo?.weekStart || '',
    weekDays,
    isOrderingAllowed: weekInfo?.isOrderingAllowed || false
  })

  // Autenticación y carga de usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              userType: userData.userType || 'estudiante',
              children: userData.children || []
            })
          } else {
            setAuthError('No se encontraron datos del usuario')
          }
        } catch (error) {
          console.error('Error loading user data:', error)
          setAuthError('Error al cargar los datos del usuario')
        }
      } else {
        router.push('/auth/login?redirect=/mi-pedido')
      }
      setIsAuthLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  // Estados de carga
  const isLoading = isAuthLoading || isMenuLoading || isOrderLoading
  const hasError = authError || menuError

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {authError || menuError}
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="w-full">
            <Link href="/panel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al panel
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!weekInfo || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/panel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al panel
            </Link>
          </Button>
        </div>

        {/* Encabezado */}
        <OrderHeader 
          weekInfo={weekInfo} 
          weekDisplayText={weekDisplayText} 
        />

        {/* Contenido principal */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Selección de menús por día */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Selecciona tu menú por día
            </h2>
            
            {menuData.length === 0 ? (
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No hay menús disponibles para esta semana.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6">
                {menuData.map((dayMenu) => (
                  <DaySelector
                    key={dayMenu.date}
                    dayMenu={dayMenu}
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Resumen y pago */}
          <div className="lg:col-span-1 space-y-6">
            <OrderSummary
              orderSummary={orderSummary}
              validation={validation}
              userType={user.userType}
              isReadOnly={isReadOnly}
            />

            <PaymentButton
              validation={validation}
              isReadOnly={isReadOnly}
              isSaving={isSaving}
              total={orderSummary.total}
              userEmail={user.email}
              onSaveOrder={saveOrder}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            ¿Necesitas ayuda? Contacta al administrador del casino escolar.
          </p>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
