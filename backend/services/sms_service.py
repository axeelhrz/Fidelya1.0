import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class SMSService:
    """Servicio para envío de SMS usando Twilio"""
    
    def __init__(self):
        self.account_sid = os.environ.get('TWILIO_ACCOUNT_SID', '')
        self.auth_token = os.environ.get('TWILIO_AUTH_TOKEN', '')
        self.from_number = os.environ.get('TWILIO_PHONE_NUMBER', '')
        self.enabled = bool(self.account_sid and self.auth_token and self.from_number)
        
        if self.enabled:
            try:
                from twilio.rest import Client
                self.client = Client(self.account_sid, self.auth_token)
            except ImportError:
                logger.warning("Twilio no está instalado. Instalar con: pip install twilio")
                self.enabled = False
        else:
            logger.warning("Configuración de Twilio incompleta")
    
    def enviar_alerta_stock(self, telefono, productos_count):
        """Enviar alerta de stock bajo por SMS"""
        try:
            mensaje = f"🍎 Frutería Nina: {productos_count} producto(s) con stock bajo requieren reposición urgente. Revisar sistema."
            return self._enviar_sms(telefono, mensaje)
        except Exception as e:
            logger.error(f"Error enviando alerta de stock por SMS: {e}")
            return False
    
    def enviar_recordatorio_pago(self, telefono, proveedor, monto):
        """Enviar recordatorio de pago por SMS"""
        try:
            mensaje = f"💰 Frutería Nina: Recordatorio pago pendiente a {proveedor} por ${monto:.2f}. Favor gestionar."
            return self._enviar_sms(telefono, mensaje)
        except Exception as e:
            logger.error(f"Error enviando recordatorio de pago por SMS: {e}")
            return False
    
    def enviar_recordatorio_cobro(self, telefono, cliente, monto):
        """Enviar recordatorio de cobro por SMS"""
        try:
            mensaje = f"🧾 Estimado {cliente}, tiene un saldo pendiente de ${monto:.2f} en Frutería Nina. Gracias por su atención."
            return self._enviar_sms(telefono, mensaje)
        except Exception as e:
            logger.error(f"Error enviando recordatorio de cobro por SMS: {e}")
            return False
    
    def _enviar_sms(self, telefono, mensaje):
        """Método privado para enviar SMS"""
        try:
            if not self.enabled:
                logger.info(f"SMS simulado a {telefono}: {mensaje}")
                return True
            
            # Formatear número de teléfono
            if not telefono.startswith('+'):
                telefono = f"+598{telefono}"  # Código de Uruguay
            
            message = self.client.messages.create(
                body=mensaje,
                from_=self.from_number,
                to=telefono
            )
            
            logger.info(f"SMS enviado exitosamente a {telefono}: {message.sid}")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando SMS a {telefono}: {e}")
            return False