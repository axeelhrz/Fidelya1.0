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
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }
    
    if (!path) {
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
      return NextResponse.json(
        { error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        { error: `Archivo demasiado grande. Tamaño máximo: ${maxSizeMB}MB` },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('📤 API: Convirtiendo archivo a buffer completado');
    
    // Create storage reference
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const finalPath = `${path}_${timestamp}_${randomId}.${extension}`;
    
    const storageRef = ref(storage, finalPath);
    
    console.log('📤 API: Subiendo a Firebase Storage:', finalPath);
    
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
    
    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    console.log('📤 API: Upload a Firebase Storage completado');
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ API: Upload exitoso:', downloadURL);
    
    return NextResponse.json({
      success: true,
      url: downloadURL,
      path: finalPath,
      metadata: {
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ API: Error en upload:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al subir imagen',
        details: errorMessage
      },
      { status: 500 }
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