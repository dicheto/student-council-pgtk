# ✅ Production Deployment Checklist

## 🔧 Pre-Deployment Setup

### Environment & Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all required environment variables
- [ ] Test local development: `npm run dev`

### Database Setup
- [ ] Create Supabase project
- [ ] Execute DATABASE_SCHEMA.sql in Supabase SQL Editor
- [ ] Create two storage buckets: `news-images`, `event-images`
- [ ] Set bucket permissions (public or authenticated as needed)
- [ ] Create first admin user manually in Auth

### Third-Party Services

#### OpenAI / OpenRouter
- [ ] Get API key from OpenAI (optional) or OpenRouter
- [ ] Add to `.env.local`: `OPENAI_API_KEY` or `OPENROUTER_API_KEY`
- [ ] Test AI generation in admin panel

#### Discord Integration (Optional)
- [ ] Create Discord Application at developer.discord.com
- [ ] Get Bot Token from Bot section
- [ ] Create Webhook in your server
- [ ] Add to `.env.local` or admin panel
- [ ] Test webhook with sample POST request

### Authentication
- [ ] Test login functionality at `/login`
- [ ] Verify admin dashboard access at `/admin`
- [ ] Test role-based access control

---

## 🧪 Testing Checklist

### Core Functionality
- [ ] News CRUD operations
  - [ ] Create article
  - [ ] Edit article
  - [ ] Delete article
  - [ ] Publish to Discord (if enabled)
- [ ] Events CRUD operations
  - [ ] Create event
  - [ ] Edit event
  - [ ] Delete event
  - [ ] ICS export works
  - [ ] Google Calendar link works
- [ ] Image uploads
  - [ ] Drag-drop upload works
  - [ ] Images appear in preview
  - [ ] Images accessible via URL
  - [ ] Delete removes from storage
- [ ] AI content generation
  - [ ] Generate button works
  - [ ] Content streams correctly
  - [ ] Copy to clipboard works
  - [ ] Use in editor works

### User Features
- [ ] Public news page displays published articles
- [ ] Public events page shows calendar
- [ ] RSS feed accessible at `/api/rss`
- [ ] Dark/light theme toggle works
- [ ] Mobile responsive (tablet & phone)
- [ ] Language switching (en/bg)

### Authentication & Security
- [ ] Unauthenticated users cannot access `/admin`
- [ ] Non-admin users cannot see admin panel
- [ ] Middleware protects routes correctly
- [ ] Sensitive data (tokens) are masked

### Discord Integration
- [ ] Webhook posting works
- [ ] Embeds display correctly
- [ ] Images attach to embeds
- [ ] Links are clickable

### Error Handling
- [ ] Upload fails gracefully with message
- [ ] Network errors show proper feedback
- [ ] Invalid credentials show errors
- [ ] Database errors are handled

---

## 📊 Performance Optimization

### Before Deployment
- [ ] Run build: `npm run build` - should complete without errors
- [ ] Test production build locally: `npm start`
- [ ] Check bundle size: `npm run build --analyze`
- [ ] Verify no console errors in production build
- [ ] Test with slow network (DevTools throttling)
- [ ] Test with poor connectivity scenarios

### Image Optimization
- [ ] Use next/image component for all images
- [ ] Configure responsive image sizes
- [ ] Test image loading on slow networks
- [ ] Verify WebP support on older browsers

### Database
- [ ] All indexes are in place (verified in schema)
- [ ] RLS policies are efficient
- [ ] No N+1 query patterns
- [ ] Proper pagination on list views

---

## 🔒 Security Checklist

### Environment Variables
- [ ] No secrets in source code
- [ ] `.env.local` is in `.gitignore`
- [ ] All required env vars are set on hosting
- [ ] Supabase keys are rotated periodically

### Database
- [ ] RLS policies enabled on all tables
- [ ] Admin role required for admin operations
- [ ] User can only see/edit own content
- [ ] Activity logs capture all changes

### API Routes
- [ ] Validate all input parameters
- [ ] Check authentication before sensitive operations
- [ ] Rate limiting on public endpoints (if needed)
- [ ] No sensitive data in responses

### Discord Integration
- [ ] Bot token never exposed client-side
- [ ] Webhook URL masked in UI
- [ ] Only admins can update Discord settings
- [ ] Validate Discord responses

### Deployment
- [ ] Enable HTTPS on hosting
- [ ] Set secure headers (HSTS, CSP, etc.)
- [ ] Configure CORS properly
- [ ] Enable firewall/DDoS protection

---

## 📈 Analytics & Monitoring

### Setup
- [ ] Google Analytics configured (if using)
- [ ] Error tracking setup (Sentry, Rollbar, etc.)
- [ ] Uptime monitoring enabled
- [ ] Database backups configured in Supabase

### Logging
- [ ] Server logs monitored
- [ ] API response times tracked
- [ ] Database query performance monitored
- [ ] Error rates tracked

---

## 🚀 Deployment Steps (Vercel)

1. **Push to GitHub**
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. **Deploy to Vercel**
- Go to vercel.com
- Click "Import Project"
- Select your GitHub repo
- Configure environment variables
- Deploy

3. **Post-Deployment**
- [ ] Test live site
- [ ] Verify all features work
- [ ] Check error logs
- [ ] Set up monitoring/alerts
- [ ] Configure domain (if not using Vercel domain)

---

## 🚀 Deployment Steps (Self-Hosted)

1. **Build Application**
```bash
npm run build
```

2. **Create Docker Image (Optional)**
```bash
docker build -t pgtk-app .
```

3. **Deploy**
- Copy to server
- Run `npm install --production`
- Set environment variables
- Run `npm start`
- Configure reverse proxy (nginx/Apache)

4. **SSL Certificate**
- Use Let's Encrypt for HTTPS
- Auto-renew certificates

---

## 📋 Post-Deployment

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify database backups
- [ ] Test all features manually
- [ ] Check mobile responsiveness on real devices

### First Week
- [ ] Monitor uptime
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Fix any bugs that appear
- [ ] Monitor database usage

### Ongoing
- [ ] Regular security audits
- [ ] Update dependencies monthly
- [ ] Monitor storage usage
- [ ] Backup data regularly
- [ ] Review access logs

---

## 🔄 Maintenance Tasks

### Weekly
- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Backup database manually (if needed)

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review security advisories
- [ ] Check SSL certificate expiration
- [ ] Review user activity logs

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Database cleanup (archived items)
- [ ] Test disaster recovery plan

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Deployment fails
- Check build logs
- Verify all environment variables are set
- Check for TypeScript errors: `npm run build`
- Verify database connection

**Issue:** Features not working in production
- Check browser console for errors
- Check server logs
- Verify environment variables
- Test with cache disabled

**Issue:** Images not loading
- Check storage bucket permissions
- Verify URLs are correct
- Check CORS settings
- Verify storage quota

**Issue:** Discord not posting
- Verify webhook URL
- Check Discord server permissions
- Test webhook manually
- Check error logs

---

## 📚 Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Discord API Documentation](https://discord.com/developers/docs)

---

**Last Updated:** January 2026
**Maintained By:** Your Team
