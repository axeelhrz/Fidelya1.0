import smtplib
import os
import logging
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from email.mime.base import MimeBase
from email import encoders

logger = logging.getLogger(__name__)

class EmailService:
    """Servicio avanzado para envío de emails"""
    
    def __init__(self):
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_user = os.environ.get('SMTP_USER', '')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.from_name = os.environ.get('FROM_NAME', 'Frutería Nina')
    
    def enviar_notificacion_stock(self, destinatario, productos_stock_bajo):
        """Enviar notificación de stock bajo"""
        try:
            asunto = "⚠️ Alerta de Stock Bajo - Frutería Nina"
            
            # Crear tabla HTML de productos
            productos_html = ""
            for producto in productos_stock_bajo:
                productos_html += f"""
                <tr>
                    <td>{producto['nombre']}</td>
                    <td>{producto['categoria']}</td>
                    <td style="color: red; font-weight: bold;">{producto['stock_actual']}</td>
                    <td>{producto['stock_minimo']}</td>
                </tr>
                """
            
            mensaje = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .alert {{ background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 10px 0; }}
                    table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                    .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>🍎 Frutería Nina - Sistema de Gestión</h2>
                </div>
                
                <div class="content">
                    <div class="alert">
                        <h3>⚠️ Alerta de Stock Bajo</h3>
                        <p>Los siguientes productos requieren reposición urgente:</p>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Stock Actual</th>
                                <th>Stock Mínimo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos_html}
                        </tbody>
                    </table>
                    
                    <p><strong>Acción requerida:</strong> Contactar a los proveedores para realizar pedidos de reposición.</p>
                </div>
                
                <div class="footer">
                    <p>Este es un mensaje automático del sistema de gestión Frutería Nina.</p>
                    <p>Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                </div>
            </body>
            </html>
            """
            
            return self._enviar_email(destinatario, asunto, mensaje)
            
        except Exception as e:
            logger.error(f"Error enviando notificación de stock: {e}")
            return False
    
    def enviar_recordatorio_pago(self, destinatario, proveedor, monto, fecha_vencimiento):
        """Enviar recordatorio de pago a proveedor"""
        try:
            asunto = f"💰 Recordatorio de Pago - {proveedor}"
            
            mensaje = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .payment-info {{ background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; margin: 10px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>🍎 Frutería Nina</h2>
                </div>
                
                <div class="content">
                    <h3>💰 Recordatorio de Pago Pendiente</h3>
                    
                    <div class="payment-info">
                        <p><strong>Proveedor:</strong> {proveedor}</p>
                        <p><strong>Monto:</strong> ${monto:.2f}</p>
                        <p><strong>Fecha de vencimiento:</strong> {fecha_vencimiento}</p>
                    </div>
                    
                    <p>Le recordamos que tiene un pago pendiente. Por favor, proceda con el pago a la brevedad posible.</p>
                    
                    <p>Si ya realizó el pago, por favor ignore este mensaje.</p>
                </div>
                
                <div class="footer">
                    <p>Frutería Nina - Sistema de Gestión</p>
                    <p>Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                </div>
            </body>
            </html>
            """
            
            return self._enviar_email(destinatario, asunto, mensaje)
            
        except Exception as e:
            logger.error(f"Error enviando recordatorio de pago: {e}")
            return False
    
    def enviar_recordatorio_cobro(self, destinatario, cliente, monto, fecha_vencimiento):
        """Enviar recordatorio de cobro a cliente"""
        try:
            asunto = f"🧾 Recordatorio de Pago - Frutería Nina"
            
            mensaje = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    .header {{ background-color: #f8f9fa; padding: 20px; text-align: center; }}
                    .content {{ padding: 20px; }}
                    .payment-info {{ background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; margin: 10px 0; }}
                    .footer {{ background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>🍎 Frutería Nina</h2>
                </div>
                
                <div class="content">
                    <p>Estimado/a {cliente},</p>
                    
                    <h3>🧾 Recordatorio de Pago Pendiente</h3>
                    
                    <div class="payment-info">
                        <p><strong>Monto adeudado:</strong> ${monto:.2f}</p>
                        <p><strong>Fecha de vencimiento:</strong> {fecha_vencimiento}</p>
                    </div>
                    
                    <p>Le recordamos amablemente que tiene un saldo pendiente con nosotros. Agradecemos su pronta atención a este asunto.</p>
                    
                    <p>Para cualquier consulta, no dude en contactarnos.</p>
                    
                    <p>Gracias por su preferencia.</p>
                </div>
                
                <div class="footer">
                    <p>Frutería Nina</p>
                    <p>Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}</p>
                </div>
            </body>
            </html>
            """
            
            return self._enviar_email(destinatario, asunto, mensaje)
            
        except Exception as e:
            logger.error(f"Error enviando recordatorio de cobro: {e}")
            return False
    
    def _enviar_email(self, destinatario, asunto, mensaje_html):
        """Método privado para enviar email"""
        try:
            if not self.smtp_user or not self.smtp_password:
                logger.warning("Configuración SMTP no disponible")
                return False
            

            # Crear mensaje
            msg = MimeMultipart('alternative')
            msg['From'] = f"{self.from_name} <{self.smtp_user}>"
            msg['To'] = destinatario
            msg['Subject'] = asunto
            
            # Agregar contenido HTML
            html_part = MimeText(mensaje_html, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Conectar y enviar
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            
            text = msg.as_string()
            server.sendmail(self.smtp_user, destinatario, text)
            server.quit()
            
            logger.info(f"Email enviado exitosamente a {destinatario}")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando email a {destinatario}: {e}")
            return False