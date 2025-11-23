# 🎖️ GENERAL'S FINAL DEPLOYMENT ORDERS (COMMANDO EDITION)

**TO:** Comrade Commander Pawan Salvi  
**FROM:** General Antonov (Antigravity)  
**DATE:** November 23, 2025  
**SUBJECT:** OPERATION "CHITTORGARH VLOG" - LOCAL STORAGE

---

## 🔴 MISSION STATUS: READY FOR LAUNCH

Comrade! We have stripped the system down to its bare essentials. No Cloudinary. No R2. Just pure, raw code and local storage.

### **THE STRATEGY:**
1.  **Videos**: Users upload -> Saved to Railway Server -> **You get an Email with a Download Link**.
2.  **PDFs**: Stored inside the code repository -> Served directly.
3.  **Cost**: $0.
4.  **Risk**: Railway deletes files every ~24 hours. **YOU MUST DOWNLOAD VIDEOS IMMEDIATELY UPON RECEIVING THE EMAIL.**

---

## ⚡ EXECUTION PLAN

### **STEP 1: PREPARE AMMUNITION (PDFs)**
Ensure your PDFs are in the correct folders on your computer:
*   `backend/chittorgarh_vlog/media/pdfs/paid/chittorgarh-guide.pdf`
*   `backend/chittorgarh_vlog/media/pdfs/free/media-kit-presentation.pdf`
*   `backend/chittorgarh_vlog/media/pdfs/free/media-kit-brochure.pdf`

*I have updated `.gitignore` so these files will be pushed to GitHub.*

### **STEP 2: PUSH TO GITHUB**
Run these commands in your project folder:
```powershell
git init
git add .
git commit -m "Final deployment - Local Storage Edition"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin master
```

### **STEP 3: LAUNCH BACKEND (Railway)**
1.  **New Project** -> **GitHub Repo**.
2.  **Add Database** (PostgreSQL).
3.  **Variables**:
    ```env
    DEBUG=False
    DJANGO_SECRET_KEY=<random-string>
    DATABASE_URL=... (Auto-filled)
    
    # Email (CRITICAL for receiving video links)
    EMAIL_HOST_USER=narendrakumar9664@gmail.com
    EMAIL_HOST_PASSWORD=<your-gmail-app-password>
    
    # Razorpay
    RAZORPAY_KEY_ID=rzp_test_Rg4YanWeF28b9d
    RAZORPAY_KEY_SECRET=WMwD3i6gjJJp0nWiuyVcFjUp
    
    # Frontend URL (For CORS)
    FRONTEND_URL=https://your-netlify-site.netlify.app
    ```
4.  **Run Migrations** (in Shell):
    ```bash
    python manage.py migrate
    python manage.py createsuperuser
    ```

### **STEP 4: LAUNCH FRONTEND (Netlify)**
1.  **New Site** -> **GitHub Repo**.
2.  **Variables**:
    ```env
    VITE_API_URL=<your-railway-url>
    VITE_RAZORPAY_KEY=rzp_test_Rg4YanWeF28b9d
    ```
3.  **Deploy!**

---

## 🫡 GENERAL'S FINAL THOUGHTS

Comrade, this is the simplest possible way to run this operation.
- You don't need to manage external storage accounts.
- You don't need to pay for anything.
- You just need to be **vigilant**. When that email comes, **DOWNLOAD THE VIDEO**.

**The code is ready.**
**The strategy is set.**

**GO MAKE HISTORY!**

*Salutes*

**END OF TRANSMISSION.**
