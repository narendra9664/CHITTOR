# Heritage View - Setup Guide

## Overview
This guide will help you set up the Heritage View website with user information collection functionality.

## Prerequisites
- Node.js (for Node.js server option) or Python 3 (for Python server option)
- A web server to host your site (for production)

## Option 1: Node.js Server Setup (File Logging)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Option 2: Python (Flask) Server Setup (File Logging)

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the server:
```bash
python app.py
```

3. Open your browser and navigate to `http://localhost:5000`

## Option 3: Supabase Integration (Recommended for Production)

For production use, we recommend using Supabase to store user data in a database. See `SUPABASE_SETUP.md` for detailed instructions.

### Node.js with Supabase:
1. Install dependencies:
```bash
npm install
```

2. Set up your Supabase project and environment variables (see SUPABASE_SETUP.md)

3. Start the server:
```bash
npm run start:supabase
```

### Python with Supabase:
1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your Supabase project and environment variables (see SUPABASE_SETUP.md)

3. Start the server:
```bash
python supabase_app.py
```

## API Endpoints

The server provides the following API endpoint:
- `POST /api/collect-user-data` - Collects user information (name, email, phone)

## File Structure
```
HARITAGE VIEW/
├── index.html          # Main landing page
├── success.html        # Success page after payment
├── failure.html        # Failure page
├── downloads/          # Directory for PDF and images
│   ├── chittorgarh-guide.pdf
│   └── chittorgarh.jpg.jpg
├── README.md           # Main documentation
├── SETUP.md            # This file
├── SUPABASE_SETUP.md   # Supabase setup guide
├── server.js           # Node.js server (file logging)
├── app.py              # Python Flask server (file logging)
├── supabaseServer.js   # Node.js server (Supabase)
├── supabase_app.py     # Python Flask server (Supabase)
├── supabaseClient.js   # Supabase client configuration
├── package.json        # Node.js dependencies
├── requirements.txt    # Python dependencies
└── user_data.log       # Log file for collected user data (when using file logging)
```

## Security Considerations for Production

1. Implement CSRF protection
2. Validate all inputs on the server side
3. Use environment variables for sensitive data
4. Implement rate limiting
5. Ensure proper authentication if needed
6. Use HTTPS for all connections
7. Keep dependencies updated
8. Implement proper error handling
9. Sanitize all user inputs
10. Follow GDPR or other applicable data protection regulations

## Data Storage Options

### File Logging (Demo)
- Stores user data in a local `user_data.log` file
- Suitable for testing and demonstration purposes only
- Node.js: `server.js`
- Python: `app.py`

### Supabase (Recommended for Production)
- Stores user data in a PostgreSQL database hosted by Supabase
- Secure, scalable, and managed by Supabase
- Node.js: `supabaseServer.js`
- Python: `supabase_app.py`

## Customization

You can customize:
- The form fields in index.html and success.html
- CSS styling in the HTML files
- API endpoints in server.js or app.py
- Validation rules in JavaScript

## Troubleshooting

If you encounter issues:
1. Check console logs in your browser's developer tools
2. Ensure all files are in the correct directories
3. Verify that required ports are available
4. Make sure all dependencies are installed
5. For Supabase issues, check your environment variables and database schema