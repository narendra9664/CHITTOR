# app.py - Python Flask server for user data collection

from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime
import os
import json

app = Flask(__name__)

# Simple in-memory storage (use a database in production)
user_data = []

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
        phone = data.get('phone', '')
        
        # Validate required fields
        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400
        
        # Create user entry
        user_entry = {
            'id': str(len(user_data) + 1),
            'name': name,
            'email': email,
            'phone': phone,
            'timestamp': datetime.utcnow().isoformat(),
            'source': data.get('source', 'download')
        }
        
        # Store in memory (in production, save to database)
        user_data.append(user_entry)
        
        # Also save to a log file
        log_user_data(user_entry)
        
        print(f"User data collected: {user_entry}")
        
        # Return success response with download URL
        return jsonify({
            'success': True,
            'message': 'User data collected successfully',
            'downloadUrl': '/downloads/chittorgarh-guide.pdf'
        })
    
    except Exception as e:
        print(f"Error collecting user data: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def log_user_data(user_entry):
    """Log user data to a file for persistence"""
    try:
        with open('user_data.log', 'a', encoding='utf-8') as f:
            log_entry = f"{user_entry['timestamp']} - {user_entry['name']} ({user_entry['email']}) - {user_entry.get('phone', 'N/A')}\n"
            f.write(log_entry)
    except Exception as e:
        print(f"Error writing to log file: {e}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)