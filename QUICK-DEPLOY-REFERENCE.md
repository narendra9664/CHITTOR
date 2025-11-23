# ⚡ QUICK DEPLOYMENT REFERENCE

## 🎯 **5-MINUTE OVERVIEW**

### **What You Have**
- ✅ React frontend with GSAP animations
- ✅ Django backend with Razorpay integration
- ✅ 4 legal pages for Razorpay activation
- ✅ Cloudflare R2 storage ready
- ✅ Email confirmation system

### **Where It's Going**
| Component | Platform | Free Tier | URL Pattern |
|-----------|----------|-----------|-------------|
| Frontend | Netlify | Yes (100GB bandwidth) | `app-name.netlify.app` |
| Backend | Railway | Yes (500 hrs/month) | `app-name.up.railway.app` |
| Database | Railway PostgreSQL | Yes (100MB) | Auto-connected |
| Storage | Cloudflare R2 | Yes (10GB) | `pub-xxxxx.r2.dev` |

---

## 📝 **CREDENTIALS YOU NEED**

### 1. Gmail App Password
```
Where: https://myaccount.google.com/apppasswords
Format: xxxx xxxx xxxx xxxx (16 chars)
Use in: Railway environment variables
```

### 2. Cloudflare R2 Credentials
```
Access Key ID: __________________
Secret Access Key: __________________
Endpoint URL: https://xxxxx.r2.cloudflarestorage.com
Public URL: https://pub-xxxxx.r2.dev/bucket-name
```

### 3. Django Secret Key
```bash
# Generate with:
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 4. Razorpay Keys
```
Test Mode (now):
  Key ID: rzp_test_Rg4YanWeF28b9d
  Secret: WMwD3i6gjJJp0nWiuyVcFjUp

Live Mode (after approval):
  Key ID: rzp_live_XXXXXXXXXXXXXX
  Secret: [get from Razorpay after approval]
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Cloudflare R2** (10 min)
```
1. Sign up → R2 → Create bucket
2. Name: chittorgarh-vlog-videos
3. Settings → Public Access → Enable
4. Manage R2 API Tokens → Create token
5. Save all credentials
```

### **Step 2: Railway Backend** (15 min)
```
1. New Project → PostgreSQL database
2. New Service → GitHub repo → /backend
3. Add environment variables (see below)
4. Deploy
5. Run in shell:
   python manage.py migrate
   python manage.py createsuperuser
```

**Railway Environment Variables:**
```env
DEBUG=False
DJANGO_SECRET_KEY=[from step above]
ALLOWED_HOSTS=*.up.railway.app,*.netlify.app
DATABASE_URL=${{Postgres.DATABASE_URL}}

RAZORPAY_KEY_ID=rzp_test_Rg4YanWeF28b9d
RAZORPAY_KEY_SECRET=WMwD3i6gjJJp0nWiuyVcFjUp

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=wiardbi09@gmail.com
EMAIL_HOST_PASSWORD=[Gmail App Password]

AWS_ACCESS_KEY_ID=[from Cloudflare]
AWS_SECRET_ACCESS_KEY=[from Cloudflare]
AWS_STORAGE_BUCKET_NAME=chittorgarh-vlog-videos
AWS_S3_ENDPOINT_URL=[from Cloudflare]
AWS_S3_CUSTOM_DOMAIN=[from Cloudflare]
AWS_S3_REGION_NAME=auto

FRONTEND_URL=https://[your-app].netlify.app
CORS_ALLOW_ALL_ORIGINS=False
```

### **Step 3: Netlify Frontend** (10 min)
```
1. New site → Import from Git
2. Base directory: frontend
3. Build command: npm run build
4. Publish directory: dist
5. Add environment variables (see below)
6. Deploy
```

**Netlify Environment Variables:**
```env
VITE_API_URL=https://[your-backend].up.railway.app
VITE_RAZORPAY_KEY=rzp_test_Rg4YanWeF28b9d
```

### **Step4: Test**
```
1. Visit https://[your-app].netlify.app
2. Create test booking
3. Upload video
4. Pay with Netbanking
5. Check email (spam folder)
6. Verify in admin: https://[backend].up.railway.app/admin
```

### **Step 5: Submit to Razorpay**
```
Legal Pages URLs:
├─ Terms: https://[your-app].netlify.app/terms
├─ Privacy: https://[your-app].netlify.app/privacy
├─ Refund: https://[your-app].netlify.app/refund-policy
└─ Contact: https://[your-app].netlify.app/contact

Wait 2-3 days → Get live keys → Update env vars
```

---

## 🔧 **COMMON FIXES**

| Problem | Solution |
|---------|----------|
| CORS error | Add Netlify URL to `FRONTEND_URL` in Railway |
| Video upload fails | Check R2 credentials in Railway |
| Email not sending | Verify Gmail App Password (no spaces) |
| Payment fails | Keep test keys until Razorpay approves |
| 404 on routes | Check `_redirects` file exists in `/public` |

---

## 📊 **TESTING CHECKLIST**

- [ ] Homepage loads
- [ ] Legal pages work (/terms, /privacy, /refund-policy, /contact)
- [ ] Booking form validates
- [ ] Video upload shows checkmark
- [ ] Payment gateway opens
- [ ] Payment succeeds (test netbanking)
- [ ] Email received
- [ ] Booking in admin panel
- [ ] Video in R2 bucket

---

## 📞 **QUICK LINKS**

- **Deployment Guide**: `DEPLOYMENT.md`
- **Full Checklist**: `PRE-DEPLOYMENT-CHECKLIST.md`
- **Project Summary**: `PROJECT-READY-SUMMARY.md`
- **Railway Dashboard**: https://railway.app/dashboard
- **Netlify Dashboard**: https://app.netlify.com/
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Razorpay Dashboard**: https://dashboard.razorpay.com/

---

## 🎯 **SUCCESS = ALL GREEN**

✅ Frontend: https://________.netlify.app  
✅ Backend: https://________.up.railway.app  
✅ Admin: https://________.up.railway.app/admin  
✅ Legal Pages: All 4 accessible  
✅ Payment: Test mode working  
✅ Storage: Videos in R2  
✅ Email: Confirmations sending  

---

**Print this page and keep it handy during deployment! 📄**
