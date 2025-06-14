# GitHub Pages Setup Guide

## 1. jvsvault.dev - GitHub Pages (Free Hosting)

### Option A: Automated Deployment Script
Run the script I created:
```bash
./deploy-jvsvault-to-github-pages.sh
```

### Option B: Manual Steps
1. **Build the project:**
   ```bash
   cd ../jvsvault.dev
   npm install --legacy-peer-deps
   npm run build
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json:**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to https://github.com/jvsvault/jvsvault
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
   - Save

Your site will be available at: **https://jvsvault.github.io/jvsvault/**

---

## 2. jorgevs.com - GitHub Pages with Custom Domain

### Step 1: Push to GitHub
```bash
cd /Users/jorgevs/Documents/Dev/web_dev/jorgevs.com
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to https://github.com/jvsvault/jorgevs.com
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)
6. Save

### Step 3: Add CNAME file
Create a CNAME file in your repository:
```bash
echo "jorgevs.com" > CNAME
git add CNAME
git commit -m "Add CNAME for custom domain"
git push origin main
```

### Step 4: Configure GoDaddy DNS
1. Log in to GoDaddy
2. Go to your domain (jorgevs.com)
3. Click on "DNS" or "Manage DNS"
4. Update these records:

**Delete existing A records and add these:**
- Type: A, Name: @, Value: 185.199.108.153
- Type: A, Name: @, Value: 185.199.109.153
- Type: A, Name: @, Value: 185.199.110.153
- Type: A, Name: @, Value: 185.199.111.153

**Add/Update CNAME:**
- Type: CNAME, Name: www, Value: jvsvault.github.io

### Step 5: Wait for DNS propagation
- DNS changes can take 10 minutes to 48 hours
- Your site will be available at: **https://jorgevs.com**

---

## Important Notes

### For jvsvault (React/Vite app):
- The site URL will be: https://jvsvault.github.io/jvsvault/
- If you want a cleaner URL later, you can:
  1. Rename the repo to "jvsvault.github.io"
  2. Remove the base path from vite.config.ts
  3. Site will be at: https://jvsvault.github.io/

### For jorgevs.com:
- GitHub Pages provides free HTTPS
- Make sure to enable "Enforce HTTPS" in GitHub Pages settings
- The site works directly with HTML/CSS/JS (no build needed)

### Troubleshooting:
- If pages don't update, try hard refresh (Ctrl+F5)
- Check Actions tab in GitHub for deployment status
- For custom domain issues, use: https://dnschecker.org/#A/jorgevs.com