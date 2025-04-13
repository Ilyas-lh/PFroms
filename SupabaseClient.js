// supabaseClient.js
// Initialize the Supabase client

// Replace with your Supabase URL and anon key (from Project Settings > API)
const supabaseUrl = 'https://wccszfsbabbyrzltbavd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3N6ZnNiYWJieXJ6bHRiYXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzI5MzAsImV4cCI6MjA2MDA0ODkzMH0.WZximkNPAOOw2MUZYlIebCed7w0sAkamO6ceVSQ9Iz8';

// Initialize Supabase client with error handling
let supabase;

try {
    // Make sure the Supabase JS library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase JS library not loaded! Make sure the CDN script is included correctly.');
        // Create a dummy client for testing
        window.supabase = {
            createClient: function() {
                return {
                    from: () => ({
                        select: () => Promise.resolve({ data: null, error: { message: 'Supabase not available' } }),
                        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not available' } })
                    }),
                    storage: {
                        from: () => ({
                            upload: () => Promise.resolve({ data: null, error: { message: 'Supabase not available' } }),
                            getPublicUrl: () => ({ data: { publicUrl: '' } })
                        })
                    }
                };
            }
        };
    }
    
    // Create the client
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    console.log('Supabase client initialized successfully');
    
    // Quick test to verify connection
    supabase.from('quality_reports').select('count').limit(1)
        .then(({ data, error }) => {
            if (error) {
                console.error('Supabase connection test failed:', error);
            } else {
                console.log('Supabase connection verified successfully');
            }
        })
        .catch(err => {
            console.error('Supabase connection test exception:', err);
        });
    
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    
    // Create a dummy client so the app doesn't crash
    supabase = {
        from: () => ({
            select: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } }),
            insert: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } })
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: { message: 'Supabase initialization failed' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
    };
}

// Make Supabase available globally
window.supabase = supabase;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = supabase;
}