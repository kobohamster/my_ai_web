import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cxprxxyteipdgsbywhls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cHJ4eHl0ZWlwZGdzYnl3aGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MDQ1NDQsImV4cCI6MjA5NzA4MDU0NH0.JYyTfD03lJ9QkfL8vFXyuMOtr5z5XFjnllzGu-Kn_bo'

export const supabase = createClient(supabaseUrl, supabaseKey)
