import emailjs from '@emailjs/browser';

// Inicializar EmailJS con tu clave pública
// Debes reemplazar 'YOUR_PUBLIC_KEY' con tu clave real de EmailJS
export const initEmailJS = () => {
  emailjs.init('wp08DHZOgU6CgICb1');
};

// Función para enviar el formulario de contacto
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  department: string;
}) => {
  try {
    const response = await emailjs.send(
      'service_r7dep5v', // Reemplazar con tu Service ID de EmailJS
      'template_ex9knaa', // Reemplazar con tu Template ID para contacto
      {
        from_name: formData.name,
        reply_to: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
        department: formData.department,
        to_email: 'assuriva@gmail.com',
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar el formulario de contacto:', error);
    return { success: false, error };
  }
};

// Función para enviar la solicitud de reunión
export const sendMeetingRequest = async (meetingData: {
  name: string;
  email: string;
  phone: string;
  topic: string;
  meetingType: string;
  dateTime: string;
}) => {
  try {
    const response = await emailjs.send(
      'service_r7dep5v', // Reemplazar con tu Service ID de EmailJS
      'template_mgmgrng', // Reemplazar con tu Template ID para reuniones
      {
        from_name: meetingData.name,
        reply_to: meetingData.email,
        phone: meetingData.phone,
        topic: meetingData.topic,
        meeting_type: meetingData.meetingType,
        date_time: meetingData.dateTime,
        to_email: 'assuriva@gmail.com',
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar la solicitud de reunión:', error);
    return { success: false, error };
  }
};

// Función para enviar notificación de chat sin respuesta
export const sendChatNotification = async (chatData: {
  sessionId: string;
  userMessage: string;
  userEmail?: string;
}) => {
  try {
    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Reemplazar con tu Service ID de EmailJS
      'YOUR_CHAT_NOTIFICATION_TEMPLATE_ID', // Reemplazar con tu Template ID para notificaciones de chat
      {
        session_id: chatData.sessionId,
        user_message: chatData.userMessage,
        user_email: chatData.userEmail || 'No proporcionado',
        to_email: 'assuriva@gmail.com',
      }
    );
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar notificación de chat:', error);
    return { success: false, error };
  }
};