# 🐍 PythonAnywhere Migration Guide - Chittorgarh Vlog

This guide provides step-by-step instructions to move your Django backend to **PythonAnywhere** (100% Free / No Card).

## 1. Create Account
1. Go to [pythonanywhere.com](https://www.pythonanywhere.com/pricing/) and select the **Free "Beginner" plan**.
2. **Username**: Note that your website will be `yourusername.pythonanywhere.com`.

## 2. Setup MySQL (Database)
PythonAnywhere free tier supports MySQL instead of PostgreSQL.
1. Go to the **Databases** tab.
2. Under **MySQL**, create a password for your root user.
3. Create a new database named `chittorgarh_vlog_db` (it will actually be named `yourusername$chittorgarh_vlog_db`).

## 3. Upload Code
1. Go to the **Files** tab.
2. Upload your `backend` folder or use the **Consoles** tab to clone from GitHub:
   ```bash
   git clone https://github.com/your-repo-url.git
   ```

## 4. Setup Virtual Environment
In the PythonAnywhere console:
1. Navigate to your project folder:
   ```bash
   cd ~/your-repo-name/backend
   ```
2. Create a virtual environment (using the Python version you selected):
   ```bash
   mkvirtualenv --python=/usr/bin/python3.11 venv
   pip install -r requirements.txt
   ```

## 5. Web App Configuration
1. Go to the **Web** tab.
2. Click **Add a new web app**.
3. Select **Manual Configuration** (IMPORTANT: do not select "Django" as it creates a dummy project).
4. Select your Python version (e.g., **Python 3.11**).
5. **Virtualenv section**: Enter the path `/home/yourusername/.virtualenvs/venv`.
6. **Code section**:
   - Source code: `/home/yourusername/your-repo-name/backend/chittorgarh_vlog`
   - Working directory: `/home/yourusername/your-repo-name/backend/chittorgarh_vlog`
7. **WSGI Configuration File**: Click the link to edit. Replace the entire content with:
```python
import os
import sys

path = '/home/yourusername/your-repo-name/backend/chittorgarh_vlog'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'chittorgarh_vlog.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## 6. Update Environment Variables
In the **Web** tab, you can use a plugin or create a `.env` file in your code folder.
Make sure to add:
- `DEBUG=False`
- `DJANGO_SECRET_KEY=your_secret`
- `DB_NAME=yourusername$chittorgarh_vlog_db`
- `DB_USER=yourusername`
- `DB_PASSWORD=your_mysql_password`
- `DB_HOST=yourusername.mysql.pythonanywhere-services.com`

---
**Need Help?** Ask me to explain any step!
