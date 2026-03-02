import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.error('[Supabase] ERROR: SUPABASE_URL is not defined!');
}
if (!supabaseKey) {
  console.error('[Supabase] ERROR: SUPABASE_SERVICE_KEY is not defined!');
}

// Only create client if credentials are provided
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

// Helper functions for user management
export async function createUserProfile(data: {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  referral_code?: string;
  referred_by?: string | null;
  avatar_url?: string;
}) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  const { error } = await supabase
    .from('profiles')
    .insert([{
      id: data.id,
      email: data.email,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      username: data.username || data.email.split('@')[0],
      referral_code: data.referral_code,
      referred_by: data.referred_by || null,
      avatar_url: data.avatar_url || null,
      role: 'user',
      subscription_tier: 'free',
      subscription_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]);

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return data;
}
