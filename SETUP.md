# Lumora Store — Setup Guide

## What's Done
- Storefront (index.html) with 12 products, cart, checkout, auth
- Cart page (cart.html)
- Admin panel (admin.html) — order management
- Profile page (profile.html) — fixed duplicate section
- Products updated with real Fampay UPI + working placeholder images
- Backend code written (backend/apps-script.gs) — Google Sheets + Telegram
- Git repo initialized and committed

## What's Left (You Need To Do)

### 1. Deploy the Backend (Google Apps Script)
1. Go to https://script.google.com
2. Create a new project
3. Delete the default `Code.gs` content
4. Paste the entire contents of `backend/apps-script.gs`
5. Click **Deploy → New deployment**
6. Type: **Web app**
7. Execute as: **Me**
8. Who has access: **Anyone**
9. Click **Deploy** — you'll need to authorize with your Google account (lumora.main5@gmail.com)
10. Copy the **Web App URL** (looks like `https://script.google.com/macros/s/.../exec`)
11. Paste that URL into `js/products.js` in the `BACKEND_URL` variable

### 2. Create GitHub Repo & Deploy
1. Run: `gh auth login` (follow prompts to log into GitHub)
2. Run: `gh repo create lumora-store --public --source=. --push`
3. Go to your repo on GitHub.com → **Settings → Pages**
4. Source: **Deploy from a branch**
5. Branch: **master**, folder: **/ (root)**
6. Click **Save**
7. Wait 1-2 minutes, then visit: `https://<your-github-username>.github.io/lumora-store/`

### 3. Test It
- Open the store URL
- Add a product to cart
- Fill checkout form
- Pay via UPI QR (or just enter your UPI ID)
- You should get a Telegram notification instantly
- Open Google Sheets → Orders sheet should have the row

## What Works Now
✅ Store UI, cart, checkout, auth, admin, profile
✅ Real Fampay UPI QR code generation
✅ Telegram bot notifications (code ready)
✅ Backend code for Google Sheets
✅ Git version control

## What Needs the Backend Deployed
⚠️ Orders syncing to Google Sheets
⚠️ Admin panel reading live orders from Sheet
⚠️ Telegram actually firing (needs Apps Script deployed)

## Free Hosting
- GitHub Pages is free, fast, and enough for now
- Cloudflare Pages is also free but adds complexity — not needed yet
- You can migrate to Cloudflare later if you want a custom domain or more control

## Files
```
RetroReads/
├── index.html          # Storefront
├── cart.html           # Cart page
├── admin.html          # Admin panel
├── profile.html        # User profile (fixed)
├── css/style.css       # Styles
├── js/
│   ├── products.js     # Product data + config (BACKEND_URL here)
│   └── main.js         # All app logic
└── backend/
    └── apps-script.gs  # Google Apps Script backend
```
