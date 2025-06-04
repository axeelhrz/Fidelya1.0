"use client"
import { useState, useEffect } from "react"
import { Mail, RefreshCw, CheckCircle } from "lucide-react"
import AuthLayout from "@/components/auth/AuthLayout"
import SubmitButton from "@/components/auth/SubmitButton"
import { useAuth } from "@/hooks/useAuth"
import { resendConfirmationEmail } from "@/lib/auth/authHelpers"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [lastSent, setLastSent] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(0)
  
  const { user, signOut } = useAuth()
  const { toast } = useToast()

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (!user?.email || countdown > 0) return

    setIsResending(true)
    
    try {
      const result = await resendConfirmationEmail(user.email)
      
      if (result.success) {
        setLastSent(new Date())
        setCountdown(60) // 60 segundos de espera
        toast({
          title: "Email reenviado",
          description: "Hemos enviado un nuevo email de verificación.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo reenviar el email. Intenta nuevamente.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive"
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <AuthLayout
      title="Verifica tu Email"
      subtitle="Revisa tu correo para activar tu cuenta"
      showIllustration={false}
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            ¡Ya casi terminamos! 🎉
          </h3>
          
          <div className="space-y-2">
            <p className="text-gray-700">
              Te hemos enviado un correo de verificación a:
            </p>
            <p className="font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {user?.email}
            </p>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            Haz clic en el enlace del correo para activar tu cuenta y comenzar a usar la plataforma.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900">
                ¿No encuentras el correo?
              </p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• Revisa tu carpeta de spam o correo no deseado</li>
                <li>• Verifica que el email sea correcto</li>
                <li>• El correo puede tardar unos minutos en llegar</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <SubmitButton
            onClick={handleResendEmail}
            disabled={countdown > 0 || isResending}
            loading={isResending}
            variant="outline"
          >
            {countdown > 0 ? (
              `Reenviar en ${countdown}s`
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reenviar correo de verificación
              </>
            )}
          </SubmitButton>

          {lastSent && (
            <p className="text-xs text-gray-500">
              Último envío: {lastSent.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="pt-4 border-t">
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ¿Quieres usar otro email? Cerrar sesión
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}