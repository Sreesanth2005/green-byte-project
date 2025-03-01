
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqzzkycxafylvjghppst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxenpreWN4YWZ5bHZqZ2hwcHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzExODQsImV4cCI6MjA1NjMwNzE4NH0.4SyCIDGl57xtW418fTXvipgq2UrOL6WgC5vGUX1hASs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema and table creation function
export const initializeDatabase = async () => {
  // Create profiles table if it doesn't exist
  const { error: profilesError } = await supabase.rpc('create_profiles_table_if_not_exists');
  
  // Create schedule_pickups table if it doesn't exist
  const { error: pickupsError } = await supabase.rpc('create_schedule_pickups_table_if_not_exists');
  
  // Create marketplace_items table if it doesn't exist
  const { error: marketplaceError } = await supabase.rpc('create_marketplace_items_table_if_not_exists');
  
  if (profilesError || pickupsError || marketplaceError) {
    console.error("Database initialization error:", { profilesError, pickupsError, marketplaceError });
  } else {
    console.log("Database tables initialized successfully");
  }
};
