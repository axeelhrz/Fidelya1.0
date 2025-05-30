const fs = require('fs');
const path = require('path');

console.log('🔥 Configuración de Firebase para MenuQR Bar');
console.log('===============================================\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copiar .env.example a .env.local
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Archivo .env.local creado desde .env.example');
  } else {
    // Crear .env.local básico
    const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Firebase Emulator (for development)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false

# Admin Panel Password (change this!)
ADMIN_PASSWORD=admin123
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env.local creado');
  }
} else {
  console.log('ℹ️  El archivo .env.local ya existe');
}

console.log('\n📋 Pasos para configurar Firebase:');
console.log('1. Ve a https://console.firebase.google.com/');
console.log('2. Crea un nuevo proyecto o selecciona uno existente');
console.log('3. Habilita Firestore Database');
console.log('4. Ve a Configuración del proyecto > General');
console.log('5. En "Tus aplicaciones", agrega una aplicación web');
console.log('6. Copia las credenciales al archivo .env.local');
console.log('\n🔧 Reglas de Firestore recomendadas:');
console.log('rules_version = \'2\';');
console.log('service cloud.firestore {');
console.log('  match /databases/{database}/documents {');
console.log('    match /{document=**} {');
console.log('      allow read: if true;');
console.log('      allow write: if request.auth != null;');
console.log('    }');
console.log('  }');
console.log('}');
console.log('\n🚀 Una vez configurado, ejecuta: npm run dev');