import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://koesipeybsasrknvgntg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjkzODYzMSwiZXhwIjoyMDU4NTE0NjMxfQ.yH6Jj0nvLU4R6zP2yawDq7XCgo1rI-MU6pdDY16E7U4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getSchema() {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('*')
      .eq('table_schema', 'public')
      .order('table_name')
    
    if (error) throw error
    
    // Organizar por tablas
    const tables = {}
    data.forEach(column => {
      if (!tables[column.table_name]) {
        tables[column.table_name] = []
      }
      tables[column.table_name].push({
        column_name: column.column_name,
        data_type: column.data_type,
        is_nullable: column.is_nullable,
        column_default: column.column_default
      })
    })
    
    console.log(JSON.stringify(tables, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

getSchema()
