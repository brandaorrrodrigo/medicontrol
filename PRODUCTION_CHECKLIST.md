# ✅ Production Deployment Checklist

Use this checklist to ensure your MedicControl deployment is secure and production-ready.

---

## 📋 Pre-Deployment

### 1. Security

- [ ] **Backend JWT Secrets**
  - [ ] Generate strong JWT_SECRET (32+ characters)
  - [ ] Generate strong JWT_REFRESH_SECRET (32+ characters)
  - [ ] Use: `openssl rand -base64 32` to generate secure secrets
  - [ ] **NEVER** use default development secrets in production

- [ ] **Database Security**
  - [ ] Use strong database password
  - [ ] Enable SSL connection if possible
  - [ ] Restrict database access to backend server only
  - [ ] Keep DATABASE_URL secret and never commit to git

- [ ] **Email Configuration**
  - [ ] Create Gmail App Password (not regular password)
  - [ ] Enable 2FA on Gmail account
  - [ ] Test email sending in development first

- [ ] **Environment Files**
  - [ ] Ensure `.env` files are in `.gitignore`
  - [ ] Never commit secrets to version control
  - [ ] Create production `.env` files on deployment platforms

### 2. Code Review

- [ ] **Remove Debug Code**
  - [ ] Remove all `console.log` statements (or use proper logging)
  - [ ] Remove any hardcoded test data
  - [ ] Remove development-only features

- [ ] **Error Handling**
  - [ ] Verify all API endpoints have proper error handling
  - [ ] Ensure sensitive data is not exposed in error messages
  - [ ] Check that stack traces are not sent to client in production

- [ ] **Dependencies**
  - [ ] Run `npm audit` on both frontend and backend
  - [ ] Fix any high/critical vulnerabilities
  - [ ] Update outdated dependencies

---

## 🗄️ Database Setup

### Supabase (Recommended)

- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Save database password securely
- [ ] Copy connection string from Settings → Database
- [ ] Replace `[YOUR-PASSWORD]` in connection string
- [ ] Test connection locally before deploying

**Connection String Format:**
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Alternative: Railway PostgreSQL

- [ ] Create database on Railway
- [ ] Copy DATABASE_URL from Railway
- [ ] Test connection

---

## 🔧 Backend Deployment (Railway)

### Setup

- [ ] Push code to GitHub
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Select `backend` directory as root

### Environment Variables

Copy and configure these in Railway Variables:

```env
# Server
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.vercel.app

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT Secrets (GENERATE NEW ONES!)
JWT_SECRET=[GENERATE-RANDOM-32-CHARS]
JWT_REFRESH_SECRET=[GENERATE-RANDOM-32-CHARS]
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=[16-DIGIT-APP-PASSWORD]
EMAIL_FROM=noreply@mediccontrol.com

# Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Verification

- [ ] Check build logs for errors
- [ ] Verify deployment succeeded
- [ ] Copy backend URL (e.g., `https://xxx.up.railway.app`)
- [ ] Test API health: `https://your-backend-url/api/health`

---

## 🎨 Frontend Deployment (Vercel)

### Setup

- [ ] Create Vercel account
- [ ] Import project from GitHub
- [ ] Set root directory to `frontend`
- [ ] Framework preset should auto-detect: Next.js

### Environment Variables

Add in Vercel Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app/api
```

⚠️ **Important:** Don't forget the `/api` at the end!

### Verification

- [ ] Check build logs for errors
- [ ] Verify deployment succeeded
- [ ] Copy frontend URL (e.g., `https://xxx.vercel.app`)
- [ ] Update `FRONTEND_URL` in Railway backend variables

---

## 🔐 Gmail SMTP Setup

### Enable 2FA

- [ ] Go to [myaccount.google.com/security](https://myaccount.google.com/security)
- [ ] Enable "2-Step Verification"

### Generate App Password

- [ ] Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- [ ] Select "Mail" and "Other"
- [ ] Name: "MedicControl"
- [ ] Click "Generate"
- [ ] Copy 16-digit password
- [ ] Add to Railway as `SMTP_PASS`

### Test

- [ ] Try password recovery feature on your deployed site
- [ ] Check if email is received

---

## 🧪 Post-Deployment Testing

### Backend API

- [ ] Test health endpoint: `GET /api/health`
- [ ] Test registration: `POST /api/auth/register`
- [ ] Test login: `POST /api/auth/login`
- [ ] Test password recovery: `POST /api/auth/forgot-password`

### Frontend

- [ ] Access homepage
- [ ] Register new account
- [ ] Verify email (if implemented)
- [ ] Login with credentials
- [ ] Test all main features:
  - [ ] Dashboard loads correctly
  - [ ] Medications page works
  - [ ] Sinais vitais page works
  - [ ] Exames page works
  - [ ] Fotos page works
  - [ ] Consultas page works
  - [ ] Prescrições page works
  - [ ] Profile update works
  - [ ] Logout works
- [ ] Test password recovery flow
- [ ] Test file uploads (exams, photos)

### Cross-browser Testing

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

---

## 🚨 Monitoring

### Logs

- [ ] **Backend (Railway):**
  - Access Deployments → View Logs
  - Watch for errors on startup
  - Monitor API request logs

- [ ] **Frontend (Vercel):**
  - Access Functions → Logs
  - Check for runtime errors

- [ ] **Database (Supabase):**
  - Monitor connection count
  - Check for slow queries

### Performance

- [ ] Test page load times
- [ ] Check API response times
- [ ] Monitor database query performance in Prisma Studio

---

## 🔄 Ongoing Maintenance

### Weekly

- [ ] Check error logs (Railway, Vercel)
- [ ] Monitor database usage (Supabase dashboard)
- [ ] Check free tier limits

### Monthly

- [ ] Review and update dependencies
- [ ] Run security audit: `npm audit`
- [ ] Check for CVEs in dependencies
- [ ] Backup database

### As Needed

- [ ] Review user feedback
- [ ] Monitor performance metrics
- [ ] Plan feature updates

---

## 💰 Free Tier Limits

Keep an eye on these limits:

| Service | Free Tier | Limit |
|---------|-----------|-------|
| **Supabase** | Database | 500MB, 2GB bandwidth/month |
| **Railway** | Compute | $5/month credit (~550h) |
| **Vercel** | Hosting | 100GB bandwidth, unlimited deploys |
| **Gmail SMTP** | Email | 500 emails/day |

---

## 🆘 Troubleshooting

### "Cannot connect to database"

→ Check `DATABASE_URL` in Railway
→ Verify Supabase database is active
→ Test connection string locally first

### "CORS error"

→ Verify `FRONTEND_URL` matches exact Vercel URL
→ Ensure no trailing slash in URL
→ Redeploy backend after changing FRONTEND_URL

### "Email not sending"

→ Verify Gmail App Password (not regular password)
→ Check 2FA is enabled on Gmail
→ Test with a simple email first
→ Check Railway logs for SMTP errors

### "Prisma client not found"

→ Ensure `npx prisma generate` is in Railway build command
→ Check `railway.json` build command
→ Redeploy backend

### "401 Unauthorized" errors

→ Check JWT secrets are set in Railway
→ Verify tokens are being sent correctly
→ Check token expiration times

---

## ✅ Production Ready!

Once all items are checked:

✅ **Backend** is deployed and running
✅ **Frontend** is deployed and accessible
✅ **Database** is connected and working
✅ **Email** service is configured
✅ **All features** are tested and working

Your MedicControl system is now live in production!

---

## 📞 Support Resources

- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Prisma Docs:** [prisma.io/docs](https://prisma.io/docs)

---

**Last Updated:** 2024
**Version:** 1.0.0
