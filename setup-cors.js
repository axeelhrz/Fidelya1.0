const { Storage } = require('@google-cloud/storage');

async function setCorsConfiguration() {
  try {
    // Initialize the storage client
    const storage = new Storage({
      projectId: 'fidelita-16082',
    });

    const bucketName = 'fidelita-16082.firebasestorage.app';
    const bucket = storage.bucket(bucketName);

    // CORS configuration
    const corsConfiguration = [
      {
        origin: ['http://localhost:3000', 'https://localhost:3000', 'http://127.0.0.1:3000'],
        method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'X-Requested-With', 'X-Firebase-Storage-Version']
      }
    ];

    // Set CORS configuration
    await bucket.setCorsConfiguration(corsConfiguration);
    console.log('✅ CORS configuration set successfully for bucket:', bucketName);
    
    // Verify CORS configuration
    const [metadata] = await bucket.getMetadata();
    console.log('📋 Current CORS configuration:', JSON.stringify(metadata.cors, null, 2));
    
  } catch (error) {
    console.error('❌ Error setting CORS configuration:', error.message);
    console.log('\n💡 Alternative solution: Use Firebase Console to set CORS rules');
    console.log('   1. Go to Firebase Console > Storage');
    console.log('   2. Click on "Rules" tab');
    console.log('   3. Update storage rules to allow your domain');
  }
}

setCorsConfiguration();
