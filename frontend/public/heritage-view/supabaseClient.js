// supabaseClient.js - Supabase client configuration
// This file contains the client configuration for connecting to your Supabase project

// Import the Supabase client library
// You'll need to install this dependency: npm install @supabase/supabase-js

// In a browser environment, you can include this script directly
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase configuration - you'll need to replace these with your actual project values
const SUPABASE_URL = 'https://XXXXX.supabase.co'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with your Supabase anon key

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;