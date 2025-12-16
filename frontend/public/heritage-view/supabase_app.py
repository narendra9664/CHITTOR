# supabase_app.py - Python Flask server with Supabase integration

from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
import os
import json
from dotenv import load_dotenv

# Note: You'll need to install the Supabase Python client
# pip install supabase python-dotenv

load_dotenv()  # Load environment variables from .env file

from supabase import create_client, Client

app = Flask(__name__)

# Initialize Supabase client
# You'll need to set these environment variables or replace the values
url: str = os.environ.get("SUPABASE_URL", "https://XXXXX.supabase.co")  # Replace with your Supabase project URL
key: str = os.environ.get("SUPABASE_ANON_KEY", "your-anon-key-here")    # Replace with your Supabase anon key
supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    # Serve all static files (HTML, CSS, JS, images, etc.)
    if '.' in filename:
        directory = os.path.dirname(filename)
        if directory:
            return send_from_directory(directory or '.', os.path.basename(filename))
        else:
            return send_from_directory('.', filename)
    else:
        # If no extension, serve as HTML
        return send_from_directory('.', f'{filename}.html')

@app.route('/downloads/<path:filename>')
def serve_downloads(filename):
    return send_from_directory('downloads', filename)

@app.route('/api/collect-user-data', methods=['POST'])
def collect_user_data():
    try:
        data = request.get_json()
        
        # Extract required fields
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone', '')  # Remove timestamp and source since your schema doesn't have them
        
        # Validate required fields
        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400
        
        # Insert user data into Supabase table
        user_entry = {
            'name': name,
            'email': email,
            'contect_no': phone
        }
        
        # Insert into Supabase
        response = supabase.table('users').insert(user_entry).execute()
        
        if response:
            print(f"User data saved to Supabase: {user_entry}")
            
            # Return success response with download URL
            return jsonify({
                'success': True,
                'message': 'User data collected successfully',
                'downloadUrl': '/downloads/chittorgarh-guide.pdf'
            })
        else:
            print("Error saving to Supabase")
            return jsonify({'error': 'Database error occurred'}), 500
    
    except Exception as e:
        print(f"Error collecting user data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/user-data', methods=['GET'])
def get_user_data():
    """Optional endpoint to retrieve user data (for admin purposes)"""
    try:
        response = supabase.table('users').select('*').order('created_at', desc=True).execute()
        
        if response:
            return jsonify(response.data)
        else:
            return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Error fetching user data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)