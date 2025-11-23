# Heritage View Website - User Information Collection

This website allows users to download a PDF guide after providing their information. The site collects user information (name, email, phone) before proceeding with the payment process and again after payment success before PDF download.

## Implementation Details

### Frontend Changes
1. The main page (index.html) now includes a form to collect user information before payment
2. The success page (success.html) has been redesigned to collect user information before PDF download
3. All forms are validated before submission

### Data Flow
1. User visits the website and fills in their information (name, email, phone) on the main page
2. User proceeds to payment using PayU gateway
3. After successful payment, user is redirected to success.html
4. On success.html, user provides information again (as a backup collection method)
5. User can then download the PDF guide

### Files Included
- `index.html` - Main page with user information form and payment integration
- `success.html` - Success page with download form after payment
- `failure.html` - Payment failure page
- `downloads/chittorgarh-guide.pdf` - The guide PDF
- `downloads/chittorgarh.jpg.jpg` - Guide image
- `server.js` - Node.js server implementation (file logging)
- `app.py` - Python Flask server implementation (file logging)
- `supabaseServer.js` - Node.js server implementation with Supabase
- `supabase_app.py` - Python Flask server implementation with Supabase
- `supabaseClient.js` - Supabase client configuration
- `package.json` - Node.js dependencies
- `requirements.txt` - Python dependencies
- `README.md` - This file
- `SETUP.md` - Basic setup guide
- `SUPABASE_SETUP.md` - Supabase setup guide

### Server Implementation

We provide four server implementations:
1. **Node.js/Express** (file logging): Located in `server.js`
2. **Python/Flask** (file logging): Located in `app.py`
3. **Node.js/Express** (Supabase): Located in `supabaseServer.js`
4. **Python/Flask** (Supabase): Located in `supabase_app.py`

All implementations include:
- Static file serving for the website
- API endpoint `/api/collect-user-data` to collect user information

### To Run the Server

#### For Node.js (file logging):
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Visit: `http://localhost:3000`

#### For Node.js (with Supabase):
1. Install dependencies: `npm install`
2. Set up Supabase environment variables (see SUPABASE_SETUP.md)
3. Start the server: `npm run start:supabase`
4. Visit: `http://localhost:3000`

#### For Python (file logging):
1. Install dependencies: `pip install -r requirements.txt`
2. Start the server: `python app.py`
3. Visit: `http://localhost:5000`

#### For Python (with Supabase):
1. Install dependencies: `pip install -r requirements.txt`
2. Set up Supabase environment variables (see SUPABASE_SETUP.md)
3. Start the server: `python supabase_app.py`
4. Visit: `http://localhost:5000`

### API Endpoint
- `POST /api/collect-user-data`
- Expected payload: `{name: string, email: string, phone: string, timestamp: string, source: string}`
- Returns: `{success: boolean, message: string, downloadUrl: string}`

### Supabase Integration

The Supabase implementations store user data in a PostgreSQL database hosted by Supabase. For setup instructions, see `SUPABASE_SETUP.md`.

### Security Considerations
1. Implement CSRF protection in production
2. Validate all input on the server-side
3. Sanitize user inputs
4. Encrypt sensitive data in storage
5. Use HTTPS for all connections
6. Implement rate limiting
7. Ensure compliance with data protection regulations (GDPR, etc.)

### Production Deployment
For production use, consider:
1. Using the Supabase implementations for proper database storage
2. Using environment variables for configuration
3. Implementing proper error logging
4. Setting up monitoring and alerts
5. Regular security audits