// import { createClient } from '@supabase/supabase-js'
// import { Database } from './database.types'

// const supabaseUrl = 'https://pykjixfuargqkjkgxsyc.supabase.co'
// const supabaseAnonKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg'

// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database.types' // Adjusted path

// Ensure you have these in your .env file
const supabaseUrl = 'https://pykjixfuargqkjkgxsyc.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5a2ppeGZ1YXJncWtqa2d4c3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDczMDEyMjIsImV4cCI6MjAyMjg3NzIyMn0.t2ayCugyEAii4KHDG0rWRZcvQcILYtF_-UApm0XGlKg'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key are required. Check your .env file.',
  )
}

// Create and export the Supabase client
// The generic 'Database' type is used from your database.types.ts
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
