import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 API: Iniciando upload de imagen...');
    
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file) {
      console.error('❌ API: No se proporcionó archivo');
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }
    
    if (!path) {
      console.error('❌ API: No se proporcionó ruta de destino');
      return NextResponse.json(
        { error: 'No se proporcionó ruta de destino' },
        { status: 400 }
      );
    }
    
    console.log('📤 API: Archivo recibido:', {
      name: file.name,
      size: file.size,
      type: file.type,
      path: path
    });
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ API: Tipo de archivo no permitido:', file.type);
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      console.error('❌ API: Archivo demasiado grande:', file.size);
      return NextResponse.json(
        { error: `Archivo demasiado grande. Tamaño máximo: ${maxSizeMB}MB` },
        { status: 400 }
      );
    }
    
    // Check if Firebase Storage is available
    if (!storage) {
      console.error('❌ API: Firebase Storage no está disponible');
      return NextResponse.json(
        { error: 'Servicio de almacenamiento no disponible' },
        { status: 503 }
      );
    }
    
    // Convert file to buffer
    console.log('📤 API: Convirtiendo archivo a buffer...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('📤 API: Buffer creado exitosamente, tamaño:', buffer.length);
    
    // Create storage reference
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const finalPath = `${path}_${timestamp}_${randomId}.${extension}`;
    
    console.log('📤 API: Creando referencia de storage:', finalPath);
    const storageRef = ref(storage, finalPath);
    
    // Upload to Firebase Storage (server-side, no CORS issues)
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        method: 'server-side-api',
        size: file.size.toString(),
        uploadedFrom: 'api-route'
      }
    };
    
    console.log('📤 API: Iniciando upload a Firebase Storage...');
    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    console.log('✅ API: Upload a Firebase Storage completado');
    
    // Get download URL
    console.log('📤 API: Obteniendo URL de descarga...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ API: URL de descarga obtenida:', downloadURL);
    
    const response = {
      success: true,
      url: downloadURL,
      path: finalPath,
      metadata: {
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    };
    
    console.log('✅ API: Upload completado exitosamente');
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('❌ API: Error en upload:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('❌ API: Error message:', error.message);
      console.error('❌ API: Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    // Check for specific Firebase errors
    let statusCode = 500;
    let userMessage = 'Error interno del servidor al subir imagen';
    
    if (errorMessage.includes('Firebase')) {
      userMessage = 'Error de configuración de Firebase';
      statusCode = 503;
    } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      userMessage = 'Error de permisos de Firebase';
      statusCode = 403;
    } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      userMessage = 'Límite de almacenamiento alcanzado';
      statusCode = 429;
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}