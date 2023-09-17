import { createClient } from '@supabase/supabase-js'

let API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2cnlkeWpueXpkcmdvbGp0c25jIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ5MDc4ODUsImV4cCI6MjAxMDQ4Mzg4NX0.pOZ2t6PTaojeeRz_FHFKNPdIYPj_0qx8abjYp0VFlaQ'
export const supabase = createClient("https://fvrydyjnyzdrgoljtsnc.supabase.co", API_KEY);
