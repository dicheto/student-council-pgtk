# 🚀 Quick Start Guide - Student Council PGTK Web App

## ⏱️ 5-Minute Setup

### 1. Clone & Install
```bash
cd StudentCouncilPGTK
npm install
```

### 2. Get Supabase Credentials
- Visit https://supabase.com
- Create a free project
- Go to Settings > API
- Copy Project URL and Anon Key

### 3. Configure Environment
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Setup Database
- In Supabase dashboard, go to SQL Editor
- Paste entire contents of `DATABASE_SCHEMA.sql`
- Click Execute

### 5. Create Storage Buckets
- In Supabase > Storage
- Create two buckets: `news-images`, `event-images`
- Set to Public

### 6. Create Admin User
- In Supabase > Auth
- Invite user or create manually
- Get their user ID
- Run this SQL in SQL Editor:

```sql
INSERT INTO public.user_profiles (id, username, full_name, role, language)
VALUES (
  'USER_ID_FROM_AUTH',
  'admin',
  'Admin Name',
  'admin',
  'en'
);
```

### 7. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 📍 Key URLs

| Page | URL | Access |
|------|-----|--------|
| Home | `/` | Public |
| News | `/news` | Public |
| Events | `/events` | Public |
| RSS Feed | `/api/rss?lang=en` | Public |
| Login | `/login` | Public |
| Admin Dashboard | `/admin` | Admin Only |
| News Management | `/admin/news` | Admin Only |
| Events Management | `/admin/events` | Admin Only |
| Discord Settings | `/admin/discord` | Admin Only |

---

## 🔑 Key Features & How to Use

### 1. Create News Article

1. Go to `/admin/news`
2. Click "Create New Article"
3. Fill in title and content
4. Use AI Generator button for content suggestion
5. Upload images via drag-drop
6. Select featured image
7. Enable "Post to Discord" if configured
8. Click "Publish"

**Live:** Article appears at `/news`

### 2. Create Event

1. Go to `/admin/events`
2. Click "Create Event"
3. Fill in details (title, date, location)
4. Set event color
5. Click "Create"

**Features:**
- Automatic ICS file for Apple/Outlook
- Google Calendar integration
- Calendar export buttons

### 3. Setup Discord Integration

1. Go to `/admin/discord`
2. Create Discord bot at https://discord.com/developers/applications
3. Get Webhook URL from channel settings
4. Paste into Discord Settings
5. Toggle "Active"
6. Test with button
7. Now articles with "Post to Discord" will auto-post

### 4. Use AI Content Generator

1. Enter article title
2. Click "Generate with AI" button
3. Wait for content to stream
4. Review generated content
5. Click "Use This Content" to insert

**Note:** Requires OPENAI_API_KEY in env

### 5. Upload Images

1. In news form, drag files into upload zone
2. Or click to select files
3. Images upload to Supabase Storage
4. URLs appear in preview grid
5. Select as featured image
6. Click X to remove

---

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:
```typescript
extend: {
  colors: {
    primary: {
      dark: '#0047AB',
      light: '#87CEEB',
    }
  }
}
```

### Logo

Replace `public/logo.svg` with your logo

### Theme

Edit `app/globals.css` for color variables

---

## 📊 Data Backup

### Backup Database
```bash
# In Supabase dashboard:
# Settings > Backups > Download backup
```

### Export News
```bash
# Visit /api/rss?lang=en to get XML
# Can be imported to other systems
```

---

## 🔐 Security Tips

1. **Never commit `.env.local`** - Already in .gitignore
2. **Rotate Discord tokens** regularly
3. **Use environment variables** for all secrets
4. **Enable RLS** in Supabase (already configured)
5. **Review user roles** before granting admin access

---

## ⚠️ Common Issues & Fixes

### "Failed to connect to Supabase"
```bash
# Check .env.local has correct values
echo $NEXT_PUBLIC_SUPABASE_URL
```

### "Unauthorized" on admin page
- Check user exists in `user_profiles` table
- Check role is 'admin' or 'editor'
- Clear cookies and login again

### Images won't upload
- Verify buckets exist: `news-images`, `event-images`
- Check bucket permissions are "Public"
- Check file size (max 10MB recommended)

### Discord posts aren't showing
- Verify webhook URL is correct
- Check Discord channel permissions
- Bot needs "Send Messages" permission
- Test webhook manually:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"content":"Test"}'
```

### AI Generator not working
- Check `OPENAI_API_KEY` in `.env.local`
- Verify OpenAI account has credits
- Check rate limits aren't exceeded

---

## 📱 Mobile Access

The app is fully responsive:
- Desktop: Full admin interface
- Tablet: Touch-friendly controls
- Phone: Optimized layout

Admin interface works on mobile but is best on desktop for content creation.

---

## 🌍 Multilingual Support

Built-in support for:
- **English** (en)
- **Bulgarian** (bg)

To add more languages:
1. Add language code to auth table
2. Create duplicate content with new language
3. Update locale in next.config.js

---

## 📞 Support Resources

- **Database Issues:** Check Supabase dashboard logs
- **API Errors:** Check browser DevTools Network tab
- **Discord Issues:** Check Discord developer portal
- **Deployment:** See DEPLOYMENT_CHECKLIST.md

---

## 🚀 Next Steps

1. ✅ Complete setup above
2. 📝 Create your first news article
3. 📅 Create your first event
4. 🤖 Setup Discord integration (optional)
5. 🚀 Deploy to Vercel or self-host
6. 📊 Monitor analytics and user feedback

---

## 📚 Full Documentation

For detailed information, see:
- `IMPLEMENTATION_GUIDE.md` - Full technical guide
- `DEPLOYMENT_CHECKLIST.md` - Production checklist
- `DATABASE_SCHEMA.sql` - Database schema with comments

---

**Ready to go!** 🎉
Start with `/admin` and begin creating content!
