import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Inicialización segura para la fase de compilación
// Solo se creará el cliente real en tiempo de ejecución, no durante la construcción
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Función para obtener el cliente de Supabase (inicialización diferida)
function getSupabaseClient() {
  // Si ya tenemos una instancia, la devolvemos
  if (supabaseInstance) return supabaseInstance;
  
  // Solo inicializamos en runtime, no en build time
  if (typeof window === 'undefined') { // Estamos en el servidor
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // IMPORTANTE: Debug de la clave de servicio (solo sus primeros caracteres por seguridad)
    console.log('VERIFICACIÓN DE CLAVES SUPABASE:', {
      url: supabaseUrl ? 'configurada' : 'NO CONFIGURADA',
      serviceKey: supabaseServiceKey ? `configurada (primeros caracteres: ${supabaseServiceKey.substring(0, 3)}...)` : 'NO CONFIGURADA'
    });
    
    // En tiempo de ejecución, estas variables deberían estar configuradas
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('CRÍTICO: Variables de entorno de Supabase no están configuradas correctamente');
      console.error('ASEGÚRATE de que SUPABASE_SERVICE_ROLE_KEY está definida en el entorno');
      // Durante la fase de build, creamos un cliente con valores vacíos que no será usado realmente
      return createClient('https://placeholder-during-build.supabase.co', 'placeholder-key-during-build');
    }
    
    // Crear la instancia real con las credenciales usando SUPABASE_SERVICE_ROLE_KEY
    console.log('Creando cliente Supabase con clave de servicio (rol de servicio)');
    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
    return supabaseInstance;
  }
  
  // Proporcionar un cliente temporal durante la compilación
  return createClient('https://placeholder-during-build.supabase.co', 'placeholder-key-during-build');
}

export async function POST(req: NextRequest) {
  console.log('=== NOTIFICACIÓN DE GETNET RECIBIDA ===');
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    // Capturar el cuerpo completo para depuración
    const bodyText = await req.text()
    console.log('===== INICIO CUERPO NOTIFICACIÓN =====');
    console.log(bodyText);
    console.log('===== FIN CUERPO NOTIFICACIÓN =====');
    
    // Intentar parsear como JSON
    let data
    try {
      data = JSON.parse(bodyText)
    } catch (e) {
      console.error('Error al parsear notificación JSON:', e)
      return NextResponse.json({ error: 'JSON inválido' }, { status: 200 }) // Siempre 200 para que no reintente
    }
    
    const { requestId, status, reference, date } = data
    
    console.log('Datos de notificación procesados:', { requestId, status, reference, date })
    
    // Validar que los campos necesarios estén presentes
    if (!requestId || !status || !reference) {
      console.error('Datos de notificación incompletos:', data)
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 200 })
    }
    
    // (Opcional) validar firma:
    // const sig = req.headers.get('x-getnet-signature')
    // const expected = crypto.createHash('sha1')
    //   .update(requestId + status.status + date + process.env.GETNET_SECRET)
    //   .digest('hex')
    // if (sig !== expected) return NextResponse.json({ error: 'Firma inválida' }, { status: 200 })

    // Verificar el estado del pago
    // Determinar el estado del pago basado en la respuesta de GetNet
    let estadoPago = 'pendiente';
    
    if (status) {
      if (status.status === 'APPROVED') {
        estadoPago = 'pagado';
        console.log('Pago APROBADO para transacción:', reference);
      } else if (status.status === 'REJECTED') {
        estadoPago = 'rechazado';
        console.log('Pago RECHAZADO para transacción:', reference);
      } else if (status.status === 'PENDING') {
        estadoPago = 'pendiente';
        console.log('Pago PENDIENTE para transacción:', reference);
      } else {
        estadoPago = 'error';
        console.log('Estado de pago DESCONOCIDO:', status.status);
      }
    } else {
      console.log(`Pago NO APROBADO para transacción ${reference}, estado:`, status);
    }

    try {
      // CRÍTICO: La 'reference' enviada por GetNet es NUESTRO transaction_id interno
      // que enviamos originalmente en el campo payment.reference
      console.log('IMPORTANTE: Procesando notificación de GetNet - la reference es nuestro transaction_id:', reference);
      console.log('Estado de pago asignado por GetNet:', estadoPago);
      
      // ENFOQUE RECOMENDADO: Los pedidos ya están creados con estado "pendiente"
      // Ahora solo debemos ACTUALIZAR su estado según la respuesta de GetNet
      
      // Buscar en la tabla principal de pedidos por nuestro transaction_id (que es el valor de reference)
      const { data: existingOrders, error: existingError } = await getSupabaseClient()
        .from('pedidos')
        .select('id, estado_pago')
        .eq('transaction_id', reference);
      
      if (existingError) {
        console.error('Error consultando pedidos existentes:', existingError);
        return NextResponse.json({ error: 'Error consultando base de datos' }, { status: 200 });
      }

      // Si encontramos pedidos existentes, actualizamos su estado
      if (existingOrders && existingOrders.length > 0) {
        console.log(`${existingOrders.length} pedidos encontrados con el transaction_id ${reference}, actualizando estado de "pendiente" a "${estadoPago}"`);
        
        // Actualizar estado de pedidos existentes (solo el campo estado_pago)
        const { data: updatedOrders, error: updateError } = await getSupabaseClient()
          .from('pedidos')
          .update({ estado_pago: estadoPago })
          .eq('transaction_id', reference)
          .select();
          
        if (updateError) {
          console.error('Error actualizando estado de pedidos:', updateError);
          return NextResponse.json({ error: 'Error actualizando pedidos' }, { status: 200 });
        } else {
          console.log(`${updatedOrders?.length || 0} pedidos actualizados de "pendiente" a "${estadoPago}"`);
          return NextResponse.json({ 
            success: true, 
            message: `Pedidos actualizados a estado ${estadoPago}`,
            count: updatedOrders?.length || 0
          }, { status: 200 });
        }
      } else {
        // ANOMALÍA: No encontramos pedidos con ese transaction_id
        console.warn(`ALERTA: No se encontraron pedidos con el transaction_id ${reference}`);
        console.warn('Esto puede indicar un problema en el flujo de creación de pedidos');
        console.warn('Asegúrate de que los pedidos se insertan correctamente con estado "pendiente" antes del pago');
        
        // Reportar el problema pero responder con éxito para evitar reintentos
        return NextResponse.json({ 
          warning: true, 
          message: `No se encontraron pedidos con transaction_id ${reference}` 
        }, { status: 200 });
      }
    } catch (processingError) {
      console.error('Error procesando la notificación de pago:', processingError);
    }
    // Siempre devolver 200 para que GetNet no reintente
    return NextResponse.json({ success: true, reference }, { status: 200 })
  } catch (e) {
    console.error("Error en webhook de GetNet:", e)
    // Registrar detalles para depuración
    try {
      const headers = Object.fromEntries(req.headers.entries())
      console.error("Headers de la solicitud:", headers)
    } catch (headerError) {
      console.error("Error al obtener headers:", headerError)
    }
    
    // Siempre devolver 200 para que GetNet no reintente
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 200 })
  }
}
