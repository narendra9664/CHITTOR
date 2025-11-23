# 🚀 DEPLOYMENT GUIDE - Chittorgarh Vlog

## 📦 **What We're Deploying**
- **Frontend**: React + Vite → Netlify (free subdomain)
- **Backend**: Django + PostgreSQL → Railway (free tier)
- **Storage**: Cloudflare R2 (100% free for 10GB)
- **Email**: Gmail SMTP (real emails)

---

## 🎯 **PRE-DEPLOYMENT CHECKLIST**

### ✅ **Legal Pages (Required by Razorpay)**
- [x] Terms & Conditions → `/terms`
- [x] Privacy Policy → `/privacy`
- [x] Refund Policy (with 5-7 day timeline) → `/refund-policy`
- [x] Contact Us → `/contact`

**Action Required**: Once deployed, submit these URLs to Razorpay to activate your live keys.

---

## 📚 **STEP-BY-STEP DEPLOYMENT**

### **PHASE 1: Cloudflare R2 Setup (Video Storage)**

#### 1.1 Create Cloudflare Account
1. Go to https://dash.cloudflare.com/sign-up
2. Verify your email
3. Navigate to **R2 Object Storage**

#### 1.2 Create R2 Bucket
```bash
Bucket Name: chittorgarh-vlog-videos
Location: Automatic (closest to India)
```

#### 1.3 Get API Credentials
1. Go to **R2 → Manage R2 API Tokens**
2. Click **Create API Token**
3. Permissions: **Object Read & Write**
4. Copy these values:
   - Access Key ID
   - Secret Access Key
   - Bucket Endpoint URL

#### 1.4 Enable Public Access (for video playback)
1. Go to your bucket settings
2. Navigate to **Settings → Public Access**
3. Enable **Allow Public Access**
4. Copy the **Public Bucket URL**

#### 1.5 Upload PDFs (CRITICAL STEP)
You must upload your PDF files to the R2 bucket in this exact structure:
1. Create folder `pdfs`
2. Inside `pdfs`, create folder `paid` and `free`
3. Upload `chittorgarh-guide.pdf` to `pdfs/paid/`
4. Upload `media-kit-presentation.pdf` to `pdfs/free/`
5. Upload `media-kit-brochure.pdf` to `pdfs/free/`

**Structure:**
```
Bucket Root
└── pdfs/
    ├── paid/
    │   └── chittorgarh-guide.pdf
    └── free/
        ├── media-kit-presentation.pdf
        └── media-kit-brochure.pdf
```

---

### **PHASE 2: Railway Deployment (Backend + Database)**

#### 2.1 Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project

#### 2.2 Deploy PostgreSQL
1. Click **+ New** → **Database** → **PostgreSQL**
2. Wait for provisioning
3. Copy the `DATABASE_URL` (automatically generated)

#### 2.3 Deploy Django Backend
1. Click **+ New** → **GitHub Repo**
2. Connect your repository
3. Select **backend** folder as root

#### 2.4 Add Environment Variables
Go to **Variables** tab and add:

```env
# Django Core
DEBUG=False
DJANGO_SECRET_KEY=<generate-new-one-using-command-below>
ALLOWED_HOSTS=*.up.railway.app,*.netlify.app
CORS_ALLOW_ALL_ORIGINS=False

# Database (auto-filled by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Razorpay (use TEST keys until legal pages are approved)
RAZORPAY_KEY_ID=rzp_test_Rg4YanWeF28b9d
RAZORPAY_KEY_SECRET=WMwD3i6gjJJp0nWiuyVcFjUp

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=wiardbi09@gmail.com
EMAIL_HOST_PASSWORD=<your-app-password>

# Cloudflare R2
AWS_ACCESS_KEY_ID=<from-step-1.3>
AWS_SECRET_ACCESS_KEY=<from-step-1.3>
AWS_STORAGE_BUCKET_NAME=chittorgarh-vlog-videos
AWS_S3_ENDPOINT_URL=<from-step-1.3>
AWS_S3_REGION_NAME=auto
AWS_S3_CUSTOM_DOMAIN=<public-url-from-step-1.4>
```

**Generate Django Secret Key:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

#### 2.5 Configure Build
In Railway settings:
```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: gunicorn chittorgarh_vlog.wsgi:application --bind 0.0.0.0:$PORT
```

#### 2.6 Run Migrations
In Railway **Shell**:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

---

### **PHASE 3: Netlify Deployment (Frontend)**

#### 3.1 Create Netlify Account
1. Go to https://app.netlify.com/signup
2. Sign up with GitHub

#### 3.2 Deploy Frontend
1. Click **Add new site** → **Import from Git**
2. Select your repository
3. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

#### 3.3 Add Environment Variables
Go to **Site settings → Environment variables**:
```env
VITE_API_URL=https://your-railway-backend-url.railway.app
VITE_RAZORPAY_KEY=rzp_test_Rg4YanWeF28b9d
```

#### 3.4 Custom Domain (Optional)
- Default: `random-name-12345.netlify.app`
- Custom: **Site settings → Domain management → Add custom domain**

#### 3.5 Configure Redirects
Create `frontend/public/_redirects`:
```
/* /index.html 200
```

This enables client-side routing for React Router.

---

### **PHASE 4: Gmail App Password Setup**

#### 4.1 Enable 2-Factor Authentication
1. Go to Google Account → Security
2. Enable **2-Step Verification**

#### 4.2 Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other (Custom name)**
3. Name it: `chittorgarh_vlog`
4. Copy the 16-character password
5. Add it to Railway env vars as `EMAIL_HOST_PASSWORD`

---

### **PHASE 5: Update Backend for R2**

#### 5.1 Install Dependencies
Add to `backend/requirements.txt`:
```
boto3==1.34.21
django-storages==1.14.2
```

#### 5.2 Update Django Settings
Add to `backend/chittorgarh_vlog/chittorgarh_vlog/settings.py`:

```python
# At the top
import os

# After MEDIA_ROOT
if os.environ.get('AWS_ACCESS_KEY_ID'):
    # Use Cloudflare R2 for production
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    
    AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL')
    AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'auto')
    AWS_S3_CUSTOM_DOMAIN = os.environ.get('AWS_S3_CUSTOM_DOMAIN')
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',
    }
    AWS_DEFAULT_ACL = 'public-read'
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False
else:
    # Use local storage for development
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

### **PHASE 6: Final Configuration**

#### 6.1 Update CORS in Backend
In `settings.py`, replace:
```python
CORS_ALLOW_ALL_ORIGINS = os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'True') == 'True'
```

With:
```python
CORS_ALLOWED_ORIGINS = [
    os.environ.get('FRONTEND_URL', 'http://localhost:3000'),
]
```

Add to Railway env: `FRONTEND_URL=https://your-app.netlify.app`

#### 6.2 Test Payment Flow
1. Go to your Netlify URL
2. Create a test booking
3. Use Netbanking payment
4. Verify in Railway logs that email was sent
5. Check admin panel for booking record

---

## 🎯 **RAZORPAY ACTIVATION**

### Submit to Razorpay for Live Keys:
1. Login to Razorpay Dashboard
2. Go to **Settings → Account & Settings → Website Details**
3. Add these URLs:
   - Website: `https://your-app.netlify.app`
   - Terms & Conditions: `https://your-app.netlify.app/terms`
   - Privacy Policy: `https://your-app.netlify.app/privacy`
   - Refund Policy: `https://your-app.netlify.app/refund-policy`
   - Contact Us: `https://your-app.netlify.app/contact`

4. Once approved, you'll receive:
   - `rzp_live_XXXXXXXXXXXXXX` (Live Key ID)
   - Live Key Secret

5. Update Railway env vars:
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=<your-live-secret>
   ```

6. Update Netlify env var:
   ```env
   VITE_RAZORPAY_KEY=rzp_live_XXXXXXXXXXXXXX
   ```

---

## 🔒 **SECURITY CHECKLIST**

- [ ] `DEBUG=False` in production
- [ ] Generated new `DJANGO_SECRET_KEY`
- [ ] HTTPS enabled (automatic on Netlify/Railway)
- [ ] CORS restricted to your domain only
- [ ] Database password is strong (Railway auto-generates)
- [ ] R2 bucket has public read, but not public write
- [ ] Gmail uses App Password, not regular password
- [ ] `.env` files are in `.gitignore`

---

## 📊 **MONITORING**

### Railway Logs:
```bash
# View live logs
railway logs

# Check if emails are being sent
railway logs | grep "Email"
```

### Netlify Deploy Logs:
Go to **Deploys** tab to see build status

### Database Backups:
Railway automatically backs up PostgreSQL daily

---

## 💰 **COST BREAKDOWN**

| Service | Plan | Cost |
|---------|------|------|
| Netlify (Frontend) | Free | $0/month |
| Railway (Backend) | Free (500 hrs/month) | $0/month |
| PostgreSQL (Railway) | Free (100MB) | $0/month |
| Cloudflare R2 | Free (10GB) | $0/month |
| Gmail SMTP | Free | $0/month |
| **TOTAL** | | **$0/month** |

**Note**: Railway free tier resets monthly. Paid tier is $5/month if you exceed limits.

---

## 🆘 **TROUBLESHOOTING**

### Problem: "Cannot connect to database"
**Solution**: Check `DATABASE_URL` in Railway env vars

### Problem: "CORS error in browser"
**Solution**: Add Netlify URL to `CORS_ALLOWED_ORIGINS` in settings.py

### Problem: "Video upload fails"
**Solution**: Check R2 credentials and bucket name in env vars

### Problem: "Emails not sending"
**Solution**: Verify Gmail App Password and ensure 2FA is enabled

### Problem: "Razorpay payment fails"
**Solution**: Ensure you're using test keys until live keys are activated

---

## 🎉 **POST-DEPLOYMENT**

1. **Test everything**:
   - Sign up flow
   - Payment with Netbanking
   - Video upload
   - Email confirmation
   - Admin panel access

2. **Monitor for 48 hours**:
   - Check Railway logs for errors
   - Verify videos are uploading to R2
   - Confirm emails are being sent

3. **Submit to Razorpay**:
   - Add all legal page URLs
   - Wait for approval (usually 2-3 days)
   - Switch to live keys

4. **Share with users**:
   - Post on Instagram
   - Share the Netlify URL
   - Start promoting!

---

## 📞 **NEED HELP?**

If you encounter any issues:
1. Check Railway/Netlify logs first
2. Verify all environment variables
3. Test locally with `docker-compose` to isolate issues
4. Contact Railway/Netlify/Cloudflare support

**Good luck with your deployment! 🚀**
