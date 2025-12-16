// supabaseServer.js - Node.js server with Supabase integration

require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// Supabase configuration - you'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://XXXXX.supabase.co'; // Replace with your Supabase project URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key-here'; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Endpoint to collect user data
app.post('/api/collect-user-data', async (req, res) => {
    try {
        const { name, email, phone } = req.body;  // Remove timestamp and source since your schema doesn't have them
        
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Insert user data into Supabase table
        // Using the 'users' table with columns: id (auto), name, email, contect_no, created_at (timestamp)
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    contect_no: phone || null
                }
            ]);

        if (error) {
            console.error('Error inserting to Supabase:', error);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        console.log('User data saved to Supabase:', { name, email, phone });

        // Respond with success
        res.json({ 
            success: true, 
            message: 'User data collected successfully',
            downloadUrl: '/downloads/chittorgarh-guide.pdf'
        });
    } catch (error) {
        console.error('Error collecting user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get user data (optional, for admin purposes)
app.get('/api/user-data', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching from Supabase:', error);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Heritage View website with Supabase integration is ready!');
    console.log('\nTo use this with your Supabase project:');
    console.log('1. Create a Supabase account at https://supabase.com');
    console.log('2. Create a new project');
    console.log('3. Create a table called "users" with these columns:');
    console.log('   - id (auto-incrementing integer or UUID)');
    console.log('   - name (text)');
    console.log('   - email (text)');
    console.log('   - contect_no (text, optional)');
    console.log('   - created_at (timestamp)');
    console.log('4. Set your SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
    console.log('5. Run: npm install @supabase/supabase-js');
});

module.exports = app;