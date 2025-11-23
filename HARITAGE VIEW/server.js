// server.js - Example server implementation for collecting user data
// This is a basic example using Node.js and Express

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// Simple in-memory storage (use a database in production)
let userData = [];

// Endpoint to collect user data
app.post('/api/collect-user-data', async (req, res) => {
    try {
        const { name, email, phone, timestamp = new Date().toISOString(), source = 'download' } = req.body;
        
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Create user data object
        const userEntry = {
            id: Date.now().toString(), // In production, use a proper UUID
            name,
            email,
            phone: phone || null,
            timestamp,
            source
        };

        // Store in memory (in production, save to database)
        userData.push(userEntry);

        // Also save to a file for persistence (in production, use a proper database)
        await saveToFile(userEntry);

        console.log('User data collected:', userEntry);

        // Respond with success
        res.json({ 
            success: true, 
            message: 'User data collected successfully',
            downloadUrl: '/downloads/chittorgarh-guide.pdf' // Direct URL to the PDF
        });
    } catch (error) {
        console.error('Error collecting user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to save user data to a file
async function saveToFile(data) {
    try {
        const logEntry = `${new Date().toISOString()} - ${data.name} (${data.email}) - ${data.phone || 'N/A'}\n`;
        await fs.appendFile('user_data.log', logEntry);
    } catch (error) {
        console.error('Error saving to file:', error);
    }
}

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Heritage View website is ready!');
});

module.exports = app;