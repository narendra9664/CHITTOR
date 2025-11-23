# Chittorgarh Vlog - Video Promotion Platform 🎬

> Professional video promotion service for businesses in Chittorgarh with 100,000+ Instagram followers

[![Production Ready](https://img.shields.io/badge/status-production--ready-green)]()
[![Docker](https://img.shields.io/badge/docker-ready-blue)]()
[![Free Tier](https://img.shields.io/badge/deployment-free--tier-brightgreen)]()

## ✨ Features

- 🎥 **Video Upload & Storage** - Cloudflare R2 cloud storage
- 💳 **Razorpay Integration** - Secure payment processing
- 📧 **Email Confirmations** - Automated booking confirmations
- 🎨 **GSAP 3D Animations** - Smooth, professional animations
- 📱 **Fully Responsive** - Mobile-first design
- 🔒 **Production Ready** - Security best practices
- 📄 **Legal Pages** - Terms, Privacy, Refund, Contact

## 🚀 Quick Start

### Local Development (Docker)

```bash
# Clone the repository
git clone https://github.com/yourusername/chittorgarh_vlogs.git
cd chittorgarh_vlogs

# Start with Docker Compose
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend: http://localhost:8000/admin
```

### First Time Setup

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create admin user
docker-compose exec backend python manage.py createsuperuser

# Access admin panel
http://localhost:8000/admin
```

## 📦 Tech Stack

### Frontend
- **React** 18 - UI library
- **Vite** - Build tool
- **GSAP** - 3D animations
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Framer Motion** - Additional animations

### Backend
- **Django** 4.2 - Python web framework
- **Django REST Framework** - API
- **PostgreSQL** - Database
- **Razorpay** - Payment gateway
- **boto3** - Cloudflare R2 integration
- **Gunicorn** - WSGI server

### Infrastructure
- **Docker** - Containerization
- **Netlify** - Frontend hosting (free)
- **Railway** - Backend hosting (free tier)
- **Cloudflare R2** - Video storage (10GB free)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT-READY-SUMMARY.md](PROJECT-READY-SUMMARY.md) | 📋 Complete overview |
| [DEPLOYMENT.md](DEPLOYMENT.md) | 🚀 Step-by-step deployment guide |
| [QUICK-DEPLOY-REFERENCE.md](QUICK-DEPLOY-REFERENCE.md) | ⚡ Quick reference card |
| [PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md) | ✅ Pre-launch checklist |
| [TESTING.md](TESTING.md) | 🧪 Testing procedures |

## 🎯 Deployment Status

### ✅ Ready for Production

- [x] All legal pages created (Razorpay requirement)
- [x] Cloud storage integrated (Cloudflare R2)
- [x] Email system configured (Gmail SMTP)
- [x] Payment gateway working (test mode)
- [x] Security hardened (rate limiting, CORS, validation)
- [x] Docker containerized
- [x] Documentation complete

### ⏳ Pending

- [ ] Deploy to Railway (backend)
- [ ] Deploy to Netlify (frontend)
- [ ] Set up Cloudflare R2 bucket
- [ ] Get Razorpay live keys (after legal page submission)

## 🛠️ Environment Variables

### Backend (.env.docker)
```env
DEBUG=False
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-secret
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=app-password
AWS_ACCESS_KEY_ID=your-r2-key
AWS_SECRET_ACCESS_KEY=your-r2-secret
AWS_STORAGE_BUCKET_NAME=bucket-name
```

### Frontend (.env.docker)
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY=rzp_test_...
```

## 📄 Legal Pages

All required pages for Razorpay activation:
- Terms & Conditions → `/terms`
- Privacy Policy → `/privacy`
- Refund Policy (5-7 day timeline) → `/refund-policy`
- Contact Us → `/contact`

## 💡 Key Features Explained

### 1. Video Upload with Visual Feedback
- Drag & drop or browse files
- 500MB max file size
- MP4, MOV, AVI, MPEG formats
- Green checkmark confirmation
- File size display

###  2. 3D GSAP Animations
- Floating video icon on hero
- Scroll-triggered service cards
- 3D rotating pricing cards
- Smooth transitions

### 3. Payment Flow
1. User selects plan
2. Fills booking form with video
3. Uploads video (stored in R2)
4. Redirects to Razorpay
5. Payment processed
6. Email confirmation sent
7. Admin receives booking notification

### 4. Admin Panel
- View all bookings
- Download booking PDFs
- Access uploaded videos (R2 links)
- Manage users

## 🔒 Security Features

- ✅ Rate limiting on all API endpoints
- ✅ Input validation (frontend + backend)
- ✅ XSS protection
- ✅ CORS properly configured
- ✅ File upload restrictions
- ✅ Environment variable secrets
- ✅ HTTPS enforced in production

## 📊 Cost Breakdown

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Netlify (Frontend) | Free tier | $0 |
| Railway (Backend) | Free tier | $0 |
| PostgreSQL (Railway) | 100MB | $0 |
| Cloudflare R2 | 10GB storage | $0 |
| Gmail SMTP | Free | $0 |
| **TOTAL** | | **$0/month** |

*Stays free as long as within tier limits*

## 🆘 Troubleshooting

### Local Development

**Backend not starting:**
```bash
docker-compose logs backend
docker-compose down && docker-compose up --build
```

**Database issues:**
```bash
docker-compose exec backend python manage.py migrate
```

### Production Issues

**CORS errors:**
- Check `FRONTEND_URL` in Railway env vars
- Verify `CORS_ALLOWED_ORIGINS` includes your Netlify URL

**Videos not uploading:**
- Verify R2 credentials
- Check bucket public access enabled
- Review Railway logs

**Emails not sending:**
- Confirm Gmail App Password (no spaces)
- Verify 2FA enabled on Gmail
- Check `EMAIL_BACKEND` is set to SMTP

## 📞 Support

- **Code Issues**: Create GitHub issue
- **Deployment Help**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Railway Support**: https://railway.app/help
- **Netlify Support**: https://answers.netlify.com/

## 📜 License

Private project for chittorgarh_vlog business use.

## 🙏 Acknowledgments

- Razorpay for payment processing
- Cloudflare for R2 storage
- Railway for backend hosting
- Netlify for frontend hosting

---

**Status**: Ready for deployment 🚀

Last updated: November 2025