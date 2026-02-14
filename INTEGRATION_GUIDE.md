# 🔧 Step-by-Step Integration Guide

## Overview

This guide walks you through integrating all the pieces of the Student Council PGTK application in the correct order.

---

## STEP 1: Project Setup (5 minutes)

### 1.1 Install Dependencies
```bash
cd StudentCouncilPGTK
npm install
```

**What's installed:**
- Next.js 14 framework
- Supabase client libraries
- OpenAI SDK
- Discord.js
- Framer Motion for animations
- Tailwind CSS
- And more...

### 1.2 Verify Installation
```bash
npm run build
```

Should complete without errors.

---

## STEP 2: Environment Configuration (5 minutes)

### 2.1 Create Environment File
```bash
cp .env.example .env.local
```

### 2.2 Get Supabase Credentials

Visit https://supabase.com:
1. Click "New Project"
2. Name it "StudentCouncil"
3. Set password
4. Wait for project to be created
5. Go to Settings > API
6. Copy and note:
   - `Project URL`
   - `anon public key`
   - `service_role key`

### 2.3 Fill Environment File

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional services
OPENAI_API_KEY=sk-... (leave empty for now)
OPENROUTER_API_KEY= (leave empty)
```

### 2.4 Verify Connection
Test by starting server:
```bash
npm run dev
```

Visit http://localhost:3000 - should load without errors.

---

## STEP 3: Database Setup (10 minutes)

### 3.1 Setup Database Schema

In Supabase Dashboard:
1. Go to SQL Editor
2. Click "New Query"
3. Copy entire contents of `DATABASE_SCHEMA.sql`
4. Paste into editor
5. Click "RUN"

**This creates:**
- All tables with proper constraints
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for auto-timestamps

### 3.2 Create Storage Buckets

In Supabase Dashboard > Storage:
1. Click "New Bucket"
2. Name: `news-images`
3. Set to "Public"
4. Click "Create Bucket"
5. Repeat for `event-images`

### 3.3 Verify Tables

In SQL Editor, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should see:
- user_profiles
- news
- events
- discord_settings
- custom_pages
- media
- links
- activity_log

---

## STEP 4: Authentication Setup (5 minutes)

### 4.1 Configure Auth in Supabase

In Supabase Dashboard > Authentication > Providers:
1. Email/Password is already enabled
2. (Optional) Enable Google OAuth
3. (Optional) Enable GitHub OAuth

### 4.2 Invite First Admin User

Option A - Via Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Invite user"
3. Enter admin email
4. They get invite link

Option B - Manual creation:
1. In Authentication > Users, click "Create user"
2. Set email and password
3. Note the User ID

### 4.3 Create Admin Profile

In SQL Editor, run:
```sql
INSERT INTO public.user_profiles (id, username, full_name, role, language)
VALUES (
  'PASTE_USER_ID_HERE',
  'admin',
  'Administrator',
  'admin',
  'en'
);
```

### 4.4 Test Login

1. Stop dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Visit http://localhost:3000/login
4. Enter admin credentials
5. Should redirect to `/admin`

---

## STEP 5: Test Core Features (10 minutes)

### 5.1 Test News CRUD

In admin dashboard (`/admin`):
1. Click "News Management"
2. Click "Create New Article"
3. Enter title: "Test Article"
4. Enter content
5. Upload an image (drag-drop)
6. Select featured image
7. Click "Publish"
8. Verify article appears

### 5.2 Test Events

1. Click "Events Management"
2. Click "Create Event"
3. Enter details
4. Set date/time
5. Click "Create"
6. Verify on calendar

### 5.3 Test Public Pages

1. Visit http://localhost:3000/news
2. Should see published articles
3. Visit http://localhost:3000/events
4. Should see calendar

---

## STEP 6: Optional - AI Integration (10 minutes)

### 6.1 Get OpenAI Key

Visit https://platform.openai.com:
1. Sign up / login
2. Go to Settings > API keys
3. Click "Create new secret key"
4. Copy key

### 6.2 Add to Environment

Edit `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
```

### 6.3 Test AI Generation

1. Restart dev server (`npm run dev`)
2. Create new article
3. Enter title
4. Click "Generate with AI"
5. Wait for content
6. Should stream into content box

**Note:** Free tier has limited requests. Use OpenRouter (free models) as fallback.

---

## STEP 7: Optional - Discord Integration (15 minutes)

### 7.1 Create Discord Bot

Visit https://discord.com/developers/applications:
1. Click "New Application"
2. Name it
3. Go to "Bot" tab
4. Click "Add Bot"
5. Copy "TOKEN"

### 7.2 Get Webhook URL

In your Discord server:
1. Right-click channel
2. Edit Channel
3. Integrations > Webhooks
4. Create Webhook
5. Copy Webhook URL

### 7.3 Add to Environment

Edit `.env.local`:
```env
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=https://discordapp.com/api/webhooks/...
DISCORD_BOT_TOKEN=your-bot-token
```

### 7.4 Configure in Admin

1. Restart dev server
2. Go to `/admin/discord`
3. Paste Webhook URL
4. Paste Bot Token
5. Click "Test Connection"
6. Should show success message

### 7.5 Test Publishing

1. Create new article
2. Enable "Post to Discord"
3. Publish
4. Check your Discord channel
5. Should see embedded message

---

## STEP 8: Verify Everything (5 minutes)

### 8.1 Checklist

Run through each feature:

```
✅ Login works
✅ Can create articles
✅ Can upload images
✅ Can create events
✅ Can view public pages
✅ Dark mode toggle works
✅ Responsive on mobile
✅ (Optional) AI generation works
✅ (Optional) Discord posting works
✅ RSS feed accessible at /api/rss
```

### 8.2 Check Logs

```bash
# Watch browser console for errors
# Open DevTools (F12)
# Check Console and Network tabs
```

---

## STEP 9: Customization (Variable)

### 9.1 Update Branding

Edit `app/globals.css`:
```css
:root {
  --color-primary: #0047AB;
  --color-primary-light: #87CEEB;
}
```

### 9.2 Replace Logo

Replace `public/logo.svg` with your logo

### 9.3 Update Colors in Tailwind

Edit `tailwind.config.ts`:
```typescript
extend: {
  colors: {
    primary: {
      DEFAULT: '#0047AB',
      light: '#87CEEB',
    }
  }
}
```

---

## STEP 10: Deployment (Variable)

### 10.1 Deploy to Vercel (Recommended)

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git push origin main

# Then visit vercel.com
# Import project
# Add environment variables
# Deploy!
```

### 10.2 Alternative: Deploy to Railway

1. Visit railway.app
2. Connect GitHub
3. Deploy

### 10.3 Self-Hosted

```bash
npm run build
npm start
# Or use Docker
```

---

## 🔍 Verification Checklist

After each step, verify:

```
[ ] No build errors
[ ] No console errors in browser
[ ] Features work as expected
[ ] Database connected
[ ] Authentication working
[ ] Images uploading
[ ] Admin dashboard accessible
[ ] Public pages visible
```

---

## ❌ Common Issues & Solutions

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install
npm run dev
```

### "Supabase connection failed"
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check network connectivity

### "Images won't upload"
- Verify storage buckets exist
- Check bucket permissions (set to Public)
- Restart dev server

### "Login not working"
- Check user exists in Supabase Auth
- Verify user_profiles table has entry
- Clear browser cookies

### "Admin dashboard not loading"
- Check middleware.ts permissions
- Verify user role is 'admin' or 'editor'
- Check browser console for errors

---

## 📊 Post-Integration Testing

### Performance Tests
```bash
# Build and analyze
npm run build
# Check for errors
npm start
# Test in production mode
```

### Security Tests
- [ ] Cannot access /admin without login
- [ ] Cannot access /admin as non-admin user
- [ ] Tokens are masked in UI
- [ ] No secrets in console logs

### Functionality Tests
- [ ] All CRUD operations work
- [ ] Images upload correctly
- [ ] Theme toggle works
- [ ] Language switching works
- [ ] Mobile responsive

---

## 🎉 Next Steps

Once integrated:

1. **Create Content**
   - Add initial articles
   - Add upcoming events
   - Configure Discord

2. **Customize**
   - Update colors/branding
   - Add your logo
   - Modify text/copy

3. **Test Thoroughly**
   - Test all features
   - Test on mobile
   - Test edge cases

4. **Deploy**
   - Choose hosting
   - Configure domain
   - Setup backups

5. **Monitor**
   - Watch for errors
   - Monitor usage
   - Collect feedback

---

## 📞 Quick Reference

| Task | How To |
|------|--------|
| View logs | Browser DevTools (F12) |
| Check database | Supabase Dashboard |
| Reset password | Supabase Auth > Users |
| View uploads | Supabase Storage |
| Check env vars | `.env.local` file |
| Restart server | Ctrl+C then `npm run dev` |
| Build for prod | `npm run build` |
| Deploy | Push to GitHub |

---

## 📚 Related Guides

- **Setup Help**: See QUICK_START.md
- **Technical Details**: See IMPLEMENTATION_GUIDE.md
- **Deployment**: See DEPLOYMENT_CHECKLIST.md
- **API Reference**: See API_DOCUMENTATION.md

---

## ✅ You're Ready!

You now have a fully integrated, production-ready web application for your student council!

**Total Time: ~1 hour for complete setup**

Next: Read QUICK_START.md for ongoing usage and maintenance tips.

---

*Last Updated: January 2026*
