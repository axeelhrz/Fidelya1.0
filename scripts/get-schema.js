const fetch = require('node-fetch');

const supabaseUrl = 'https://koesipeybsasrknvgntg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkzODYzMSwiZXhwIjoyMDU4NTE0NjMxfQ.yH6Jj0nvLU4R6zP2yawDq7XCgo1rI-MU6pdDY16E7U4';

async function getSchema() {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

getSchema();
