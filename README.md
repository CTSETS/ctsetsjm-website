# CTS Empowerment & Training Solutions — Website

## How to Get This Live at ctsetsjm.com

Follow these steps in order. Total time: about 30 minutes.

---

### STEP 1: Create a GitHub Account (skip if you have one)

1. Go to **https://github.com** and click **Sign Up**
2. Use your CTS email (info@ctsetsjm.com) or personal email
3. Choose a username (e.g., `ctsetsjm`)
4. Verify your email

---

### STEP 2: Upload This Project to GitHub

1. Log into GitHub
2. Click the **+** icon (top right) → **New repository**
3. Name it: `cts-ets-website`
4. Set it to **Public** (free hosting requires this)
5. Click **Create repository**
6. On the next page, click **"uploading an existing file"** link
7. **Drag and drop ALL files** from this project folder into the upload area:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - `.gitignore`
   - `src/` folder (with `main.jsx` and `App.jsx` inside)
   - `public/` folder (with `logo.jpg` inside)
8. Click **Commit changes**

---

### STEP 3: Deploy on Vercel (Free)

1. Go to **https://vercel.com** and click **Sign Up**
2. Choose **"Continue with GitHub"** and authorise it
3. Click **"Add New..." → "Project"**
4. You'll see your `cts-ets-website` repo — click **Import**
5. Vercel auto-detects it's a Vite project. Just click **Deploy**
6. Wait 1-2 minutes for the build to complete
7. You'll get a live URL like `cts-ets-website.vercel.app` — **your site is now live!**

---

### STEP 4: Connect Your Domain (ctsetsjm.com)

#### In Vercel:
1. Go to your project dashboard on Vercel
2. Click **Settings** → **Domains**
3. Type `ctsetsjm.com` and click **Add**
4. Also add `www.ctsetsjm.com`
5. Vercel will show you **DNS records** you need to set up

#### In Squarespace (your domain registrar):
1. Log into your **Squarespace** account
2. Go to **Settings** → **Domains** → click on **ctsetsjm.com**
3. Click **DNS Settings** or **Advanced DNS**
4. **Delete** any existing A records or CNAME records pointing to Squarespace
5. Add the records Vercel shows you. Typically:

   | Type  | Host | Value                    |
   |-------|------|--------------------------|
   | A     | @    | 76.76.21.21              |
   | CNAME | www  | cname.vercel-dns.com     |

6. Save the changes
7. DNS can take **up to 48 hours** to fully update (usually much faster, 15-30 minutes)

---

### STEP 5: Cancel Squarespace Hosting (Optional)

Once your site is live on Vercel:
- You can **cancel your Squarespace website plan** (saves $16-33/month)
- **Keep the domain registration** at Squarespace (~$20/year) OR transfer it to another registrar
- Your site is hosted for **free** on Vercel

---

## Making Updates Later

To update the website content:
1. Go to your GitHub repo (`github.com/yourusername/cts-ets-website`)
2. Navigate to `src/App.jsx`
3. Click the **pencil icon** to edit
4. Make your changes
5. Click **Commit changes**
6. Vercel automatically rebuilds and deploys within 1-2 minutes

Or, come back to Claude and ask for help with updates — I can generate the updated files for you.

---

## Need Help?

- **Vercel docs**: https://vercel.com/docs
- **Squarespace DNS**: https://support.squarespace.com/hc/en-us/articles/205812378
- Or message me again in Claude!
