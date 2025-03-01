
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqzzkycxafylvjghppst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxenpreWN4YWZ5bHZqZ2hwcHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE1MDMwMTMsImV4cCI6MjAyNzA3OTAxM30.u3UGdXCBKCEXmxhzQ0_kZrq8Hj4J3tqG0D2pHCkkI74';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
