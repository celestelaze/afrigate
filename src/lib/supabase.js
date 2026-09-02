import { createClient } from '@supabase/supabase-js'

// Public credentials — the anon key is safe to expose (it's rate-limited by RLS)
const SUPABASE_URL = 'https://ufxcuiiuirqzfqspylql.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeGN1aWl1aXJxemZxc3B5bHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjI1NTYsImV4cCI6MjA5NDc5ODU1Nn0.kAqfKhqqyuHWidcmrGzGXo8PICQ1evJYjUwZ4Ea1Aek'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
