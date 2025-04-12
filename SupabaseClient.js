// supabaseClient.js
// Initialize the Supabase client

// Replace with your Supabase URL and anon key (from Project Settings > API)
const supabaseUrl = 'https://wccszfsbabbyrzltbavd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3N6ZnNiYWJieXJ6bHRiYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzI5MzAsImV4cCI6MjA2MDA0ODkzMH0.WZximkNPAOOw2MUZYlIebCed7w0sAkamO6ceVSQ9Iz8';

// Create a Supabase client instance
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// If using ES Modules
export default supabase;

// If using plain JavaScript
// window.supabase = supabase;