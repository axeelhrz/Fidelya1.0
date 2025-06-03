import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sistema de Pedidos del Casino Escolar
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestiona los pedidos de almuerzo y colaciones de manera fácil y eficiente
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Bienvenido</CardTitle>
              <CardDescription>
                Seleccione una opción para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                asChild
                className="w-full text-base py-6"
                size="lg"
              >
                <Link href="/auth/registro">
                  Crear Cuenta
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-base py-6"
                size="lg"
              >
                <Link href="/auth/login">
                  Iniciar Sesión
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              2025 Casino Escolar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
