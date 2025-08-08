'use client';

import { WhatsAppTester } from '@/components/notifications/WhatsAppTester';
import { EmailTester } from '@/components/notifications/EmailTester';

export default function TestNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 Centro de Pruebas - Fidelya
          </h1>
          <p className="text-gray-600">
            Prueba el envío de notificaciones por WhatsApp y Email
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <WhatsAppTester />
          <EmailTester />
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📋 Guía de Configuración Completa
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                📱 Configuración WhatsApp (Twilio)
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✅</span>
                  <span>Credenciales configuradas en .env.local</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✅</span>
                  <span>API Route funcionando</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✅</span>
                  <span>Branding personalizado aplicado</span>
                </div>
                <div className="mt-3 p-2 bg-yellow-50 rounded">
                  <p className="text-xs text-yellow-700">
                    <strong>Para usar:</strong> Envía "join orange-tiger" al +1 415 523 8886
                  </p>
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                📧 Configuración Email (EmailJS)
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">⚠️</span>
                  <span>Requiere configuración de EmailJS</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">⚠️</span>
                  <span>Actualizar variables en .env.local</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">✅</span>
                  <span>Template HTML profesional listo</span>
                </div>
                <div className="mt-3 p-2 bg-blue-50 rounded">
                  <p className="text-xs text-blue-700">
                    <strong>Pasos:</strong> Crear cuenta EmailJS → Configurar Gmail → Copiar credenciales
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-800 mb-2">🔧 Variables de Entorno Requeridas:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <p className="text-green-600 font-semibold">WhatsApp (Configurado ✅)</p>
                <p>TWILIO_ACCOUNT_SID</p>
                <p>TWILIO_AUTH_TOKEN</p>
                <p>TWILIO_WHATSAPP_FROM</p>
              </div>
              <div>
                <p className="text-yellow-600 font-semibold">Email (Pendiente ⚠️)</p>
                <p>NEXT_PUBLIC_EMAILJS_SERVICE_ID</p>
                <p>NEXT_PUBLIC_EMAILJS_TEMPLATE_ID</p>
                <p>NEXT_PUBLIC_EMAILJS_PUBLIC_KEY</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">💰 Costos y Límites:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <p><strong>WhatsApp (Twilio):</strong></p>
                <p>• Sandbox: Gratis para testing</p>
                <p>• Mensajes: ~$0.005 USD c/u</p>
                <p>• Crédito inicial: $15 USD</p>
              </div>
              <div>
                <p><strong>Email (EmailJS):</strong></p>
                <p>• Plan gratuito: 200 emails/mes</p>
                <p>• Sin límite de destinatarios</p>
                <p>• Templates ilimitados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}