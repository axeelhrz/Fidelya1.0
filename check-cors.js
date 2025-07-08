const https = require('https');
const http = require('http');

function checkCORS() {
  console.log('🔍 Verificando configuración CORS de Firebase Storage...\n');
  
  const options = {
    hostname: 'firebasestorage.googleapis.com',
    port: 443,
    path: '/v0/b/fidelita-16082.firebasestorage.app/o',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization'
    }
  };

  const req = https.request(options, (res) => {
    console.log('📊 Respuesta del servidor:');
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers CORS:`);
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers',
      'access-control-max-age'
    ];
    
    corsHeaders.forEach(header => {
      const value = res.headers[header];
      if (value) {
        console.log(`   ${header}: ${value}`);
      }
    });
    
    if (res.statusCode === 200 && res.headers['access-control-allow-origin']) {
      console.log('\n✅ CORS configurado correctamente');
    } else {
      console.log('\n❌ CORS no configurado o bloqueado');
      console.log('\n💡 Soluciones recomendadas:');
      console.log('   1. Configurar CORS en Firebase Console');
      console.log('   2. Verificar reglas de Storage');
      console.log('   3. Usar proxy en desarrollo');
    }
  });

  req.on('error', (error) => {
    console.error('❌ Error verificando CORS:', error.message);
  });

  req.end();
}

checkCORS();
