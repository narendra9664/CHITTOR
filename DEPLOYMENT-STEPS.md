# 🚀 DEPLOYMENT GUIDE - Quick Update

## Date: December 1, 2025

Follow these steps to deploy your updates to production:

---

## 📦 **Step 1: Commit Changes to Git**

Open your terminal/PowerShell in the project directory and run:

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Update contact number, add Heritage View page, and implement info gathering modals

- Updated phone number from +91 6377 595 978 to +91 7733 072 738 across all pages
- Fixed Contact navigation to redirect to /contact page instead of scrolling
- Created standalone Heritage View landing page at /heritage-view
- Added info gathering modals for all PDF downloads
- Updated navigation from Downloads to Heritage View"

# Push to GitHub
git push origin main
```

---

## 🌐 **Step 2: Automatic Deployments**

Once you push to GitHub, your deployments will automatically trigger:

### **Netlify (Frontend)**
- ⏱️ Build time: ~2-3 minutes
- 🔗 URL: Your Netlify app URL (e.g., `chittorgarh-vlog.netlify.app`)
- ✅ Auto-deploys on push to `main` branch

**What to check:**
1. Visit your Netlify dashboard
2. Watch the build progress
3. Check build logs for any errors
4. Once deployed, test the new features

### **Railway (Backend)**
- ⏱️ Build time: ~3-5 minutes
- 🔗 URL: Your Railway backend URL
- ✅ Auto-deploys on push to `main` branch

**What to check:**
1. Visit your Railway dashboard
2. Watch the deployment progress
3. Check deployment logs
4. Verify backend is running

---

## ✅ **Step 3: Post-Deployment Testing**

### **Test 1: Phone Number Updates**
Visit these pages and verify the new number appears:
- [ ] Homepage footer: `https://your-app.netlify.app/`
- [ ] Contact page: `https://your-app.netlify.app/contact`
- [ ] Terms & Conditions: `https://your-app.netlify.app/terms`
- [ ] Privacy Policy: `https://your-app.netlify.app/privacy`
- [ ] Refund Policy: `https://your-app.netlify.app/refund-policy`

**Expected:** All should show **+91 7733 072 738**

---

### **Test 2: Contact Navigation**
1. [ ] Go to homepage
2. [ ] Click "Contact" in navigation (desktop)
3. [ ] Should navigate to `/contact` page (not scroll)
4. [ ] Test on mobile menu too

**Expected:** Redirects to Contact Us page with form

---

### **Test 3: Heritage View Page**
1. [ ] Go to homepage
2. [ ] Click "Heritage View" in navigation
3. [ ] Should see beautiful landing page
4. [ ] Verify Chittorgarh Fort image loads
5. [ ] Scroll through features section
6. [ ] Click "Download Guide" button
7. [ ] Modal should appear
8. [ ] Fill form: First Name, Last Name, Email, Phone
9. [ ] Click "Download Now"
10. [ ] PDF download should start

**Expected:** Smooth experience with working download

---

### **Test 4: Free PDF Downloads (if Downloads page is accessible)**
1. [ ] Navigate to `/downloads` directly
2. [ ] Click "Free Download" on Media Kit
3. [ ] Modal should appear
4. [ ] Fill form with user details
5. [ ] Submit and verify download starts

**Expected:** Modal collects info before download

---

## 🔧 **Troubleshooting**

### **If Netlify Build Fails:**
1. Check Netlify build logs
2. Common issues:
   - Missing dependencies (run `npm install` locally)
   - Build errors (check console for errors)
   - Environment variables missing

**Fix:**
```bash
cd frontend
npm install
npm run build
```
If local build works, push again.

---

### **If Railway Deployment Fails:**
1. Check Railway deployment logs
2. Common issues:
   - Database migration errors
   - Missing environment variables
   - Python dependency issues

**Fix:**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
```
If local works, redeploy on Railway.

---

### **If Images Don't Load on Heritage View:**
The Heritage View page references:
- `/HARITAGE VIEW/downloads/chittorgarh.jpg.jpg`

**Verify:**
1. This file exists in your public folder
2. Path is correct in Netlify deployment
3. File is committed to Git

**Fix if needed:**
Move the image to `frontend/public/` and update the path in `HeritageView.jsx`:
```jsx
// Change from:
src="/HARITAGE VIEW/downloads/chittorgarh.jpg.jpg"

// To:
src="/chittorgarh.jpg"
```

---

## 📊 **Deployment Checklist**

Before marking as complete, verify:

- [ ] Git changes committed
- [ ] Pushed to GitHub successfully
- [ ] Netlify build completed (green checkmark)
- [ ] Railway deployment completed (green checkmark)
- [ ] Phone number updated on all pages
- [ ] Contact navigation works correctly
- [ ] Heritage View page loads and looks good
- [ ] Download modals work on Heritage View
- [ ] Free download modals work (if applicable)
- [ ] All images load correctly
- [ ] Mobile responsive design works
- [ ] No console errors in browser
- [ ] Backend API responding correctly

---

## 🎯 **Expected Results**

After successful deployment:

✅ **Phone Number:** +91 7733 072 738 everywhere  
✅ **Contact Button:** Navigates to `/contact` page  
✅ **Heritage View:** Beautiful standalone page at `/heritage-view`  
✅ **Download Modals:** Collect user info before downloads  
✅ **Navigation:** "Heritage View" instead of "Downloads"  

---

## 📝 **Files Changed Summary**

**Frontend Changes:**
- `src/main.jsx` - Added Heritage View route
- `src/app.jsx` - Updated navigation & footer
- `src/pages/HeritageView.jsx` - NEW FILE
- `src/pages/ContactUs.jsx` - Phone number
- `src/pages/Downloads.jsx` - Added modal
- `src/pages/TermsAndConditions.jsx` - Phone number
- `src/pages/PrivacyPolicy.jsx` - Phone number
- `src/pages/RefundPolicy.jsx` - Phone number

**Backend Changes:**
- No backend changes required for this update

---

## 🆘 **Need Help?**

If you encounter any issues:

1. **Check Build Logs:**
   - Netlify: Dashboard → Deploys → Click on latest deploy → View logs
   - Railway: Dashboard → Deployments → Click latest → View logs

2. **Test Locally First:**
   ```bash
   # Frontend
   cd frontend
   npm run dev
   # Visit http://localhost:5173
   
   # Backend
   cd backend/chittorgarh_vlog
   python manage.py runserver
   # Visit http://localhost:8000
   ```

3. **Common Commands:**
   ```bash
   # If you need to rollback
   git revert HEAD
   git push origin main
   
   # If you need to force push (use carefully!)
   git push origin main --force
   ```

---

## ✨ **Success Indicators**

You'll know everything is working when:

1. ✅ Netlify shows "Published" status
2. ✅ Railway shows "Active" status
3. ✅ Your live site shows the new phone number
4. ✅ Heritage View page is accessible and beautiful
5. ✅ Download modals appear and work correctly
6. ✅ No errors in browser console
7. ✅ Mobile version works smoothly

---

**Ready to deploy? Run the git commands above and watch the magic happen! 🚀**

If you need any help during deployment, just let me know!
