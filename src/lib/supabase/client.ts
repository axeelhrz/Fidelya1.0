import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = "https://fosonxhmojlmiizdcgoh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvc29ueGhtb2psbWlpemRjZ29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NDQ2MDIsImV4cCI6MjA2MzAyMDYwMn0.3QYLE0O1UkIpklfoEjlxPmuHxXo-7KLE4WUSLWaLaUo"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
