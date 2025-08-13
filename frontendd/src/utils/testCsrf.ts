import api from '@/lib/axios';

export const testCsrfConnection = async () => {
  try {
    console.log('Testing CSRF token endpoint...');
    
    // Test CSRF cookie endpoint
    const csrfResponse = await api.get('/sanctum/csrf-cookie');
    console.log('✅ CSRF cookie response:', csrfResponse.status);
    
    // Test a simple API endpoint (should work without auth)
    try {
      const testResponse = await api.get('/api/leagues');
      console.log('✅ API test response:', testResponse.status);
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('⚠️ API requires authentication (expected)');
      } else {
        console.error('❌ API test failed:', error.response?.status, error.response?.data);
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ CSRF test failed:', error.response?.status, error.response?.data);
    return false;
  }
};

export const testRegistration = async () => {
  try {
    console.log('Testing user registration...');
    
    const userData = {
      name: 'Test User Frontend',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      password_confirmation: 'password123'
    };
    
    const response = await api.post('/api/auth/register', userData);
    console.log('✅ Registration successful:', response.status);
    console.log('User data:', response.data.data.user);
    
    return response.data.data.user;
  } catch (error: any) {
    console.error('❌ Registration failed:', error.response?.status, error.response?.data);
    return null;
  }
};

export const testLogin = async () => {
  try {
    console.log('Testing user login...');
    
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await api.post('/api/auth/login', credentials);
    console.log('✅ Login successful:', response.status);
    console.log('User data:', response.data.data.user);
    
    return response.data.data.user;
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.status, error.response?.data);
    return null;
  }
};

export const testLeagueCreation = async () => {
  try {
    console.log('Testing league creation...');
    
    const leagueData = {
      name: `Test League ${Date.now()}`,
      region: 'Test Region',
      status: 'active'
    };
    
    const response = await api.post('/api/leagues', leagueData);
    console.log('✅ League creation successful:', response.status);
    console.log('League data:', response.data.data);
    
    return response.data.data;
  } catch (error: any) {
    console.error('❌ League creation failed:', error.response?.status, error.response?.data);
    return null;
  }
};

export const runFullTest = async () => {
  console.log('🚀 Starting full API test suite...');
  
  // Test CSRF
  await testCsrfConnection();
  
  // Test registration
  const newUser = await testRegistration();
  
  if (newUser) {
    // Test league creation (should work since user is now authenticated)
    await testLeagueCreation();
  } else {
    // Try login with existing user
    const existingUser = await testLogin();
    if (existingUser) {
      await testLeagueCreation();
    }
  }
  
  console.log('🏁 Test suite completed!');
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).testCsrf = testCsrfConnection;
  (window as any).testRegistration = testRegistration;
  (window as any).testLogin = testLogin;
  (window as any).testLeagueCreation = testLeagueCreation;
  (window as any).runFullTest = runFullTest;
}