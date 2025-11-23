# 🚀 PRE-DEPLOYMENT CHECKLIST

## ✅ **COMPLETED ITEMS**

### Code & Features
- [x] All 4 legal pages created (Terms, Privacy, Refund, Contact)
- [x] React Router configured for page navigation
- [x] Footer links updated to point to legal pages
- [x] GSAP 3D animations added to hero section
- [x] Video upload with visual feedback
- [x] Razorpay payment integration working
- [x] Django admin panel configured
- [x] Email confirmation system ready
- [x] Cloudflare R2 storage integration added
- [x] CORS configuration for production
- [x] Environment variable support
- [x] Docker containerization working

### Security
- [x] Input validation on frontend and backend
- [x] XSS protection enabled
- [x] Rate limiting on API endpoints
- [x] File upload validation (type & size)
- [x] HTTPS ready (automatic on Netlify/Railway)
- [x] Environment variables for secrets
- [x] `.gitignore` includes sensitive files

---

## 📋 **ACTION ITEMS BEFORE DEPLOYMENT**

### 1. **Gmail App Password** (5 minutes)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Save the 16-character password (you'll need it for Railway)

### 2. **Cloudflare R2 Setup** (10 minutes)
- [ ] Create Cloudflare account
- [ ] Create R2 bucket named `chittorgarh-vlog-videos`
- [ ] Generate API token (Read & Write permissions)
- [ ] Enable public access on bucket
- [ ] Save these credentials:
  - Access Key ID: `________________`
  - Secret Access Key: `________________`
  - Bucket Endpoint: `________________`
  - Public URL: `________________`

### 3. **Railway Account** (5 minutes)
- [ ] Sign up at https://railway.app with GitHub
- [ ] Verify email
- [ ] Connect GitHub repository

### 4. **Netlify Account** (5 minutes)
- [ ] Sign up at https://netlify.com with GitHub
- [ ] Verify email
- [ ] Connect GitHub repository

### 5. **Generate Production Django Secret** (1 minute)
Run this command locally:
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```
Save the output: `________________`

### 6. **Commit All Changes** (2 minutes)
```bash
git add .
git commit -m "Production ready: Legal pages, R2 storage, deployment config"
git push origin main
```

---

## 🎯 **DEPLOYMENT SEQUENCE**

### Phase 1: Backend (Railway) - 15 minutes
1. [ ] Create PostgreSQL database in Railway
2. [ ] Deploy backend from GitHub
3. [ ] Add all environment variables (see DEPLOYMENT.md)
4. [ ] Run migrations in Railway shell
5. [ ] Create superuser
6. [ ] Test backend URL in browser

### Phase 2: Frontend (Netlify) - 10 minutes
1. [ ] Deploy frontend from GitHub
2. [ ] Add environment variables (API_URL, Razorpay key)
3. [ ] Test frontend URL in browser
4. [ ] Verify legal pages are accessible

### Phase 3: Integration Testing - 15 minutes
1. [ ] Test full booking flow
2. [ ] Verify video upload to R2
3. [ ] Check email confirmation
4. [ ] Test payment with Netbanking
5. [ ] Verify booking appears in admin panel

### Phase 4: Razorpay Activation - 2-3 days
1. [ ] Submit legal page URLs to Razorpay
2. [ ] Wait for approval
3. [ ] Receive live API keys
4. [ ] Update environment variables
5. [ ] Test live payment

---

## 🔍 **POST-DEPLOYMENT VERIFICATION**

### Functionality Tests
- [ ] Homepage loads without errors
- [ ] All legal pages accessible
- [ ] Plan selection works
- [ ] Booking form validation works
- [ ] Video upload shows green checkmark
- [ ] Payment gateway opens
- [ ] Payment confirmation works
- [ ] Email received (check spam folder)
- [ ] Booking visible in admin panel
- [ ] Video stored in R2 bucket

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] Mobile responsive design works
- [ ] GSAP animations are smooth
- [ ] No console errors in browser

### Security Tests
- [ ] HTTPS enabled (green lock icon)
- [ ] No secrets exposed in frontend code
- [ ] CORS properly configured
- [ ] File upload limits enforced
- [ ] Rate limiting active

---

## 📞 **SUPPORT CONTACTS**

### If You Get Stuck:
- **Railway Support**: https://railway.app/help
- **Netlify Support**: https://answers.netlify.com/
- **Cloudflare Support**: https://community.cloudflare.com/
- **Razorpay Support**: https://razorpay.com/support/

### Quick Fixes:
- **Backend not starting**: Check Railway logs for errors
- **Frontend not building**: Check Netlify deploy logs
- **CORS errors**: Verify FRONTEND_URL in Railway env vars
- **Emails not sending**: Check Gmail App Password
- **Videos not uploading**: Verify R2 credentials

---

## 🎉 **READY TO DEPLOY?**

Once all checkboxes above are completed:
1. Follow the steps in `DEPLOYMENT.md`
2. Keep this checklist handy
3. Deploy with confidence!

**Good luck! 🚀**
