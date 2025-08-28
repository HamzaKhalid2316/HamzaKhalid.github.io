# GitHub Pages Deployment Guide

## Quick Deployment Steps

### 1. Prepare Your Repository
1. Create a new repository on GitHub named `hamzakhalid.me` or your preferred name
2. Upload all the portfolio files to the repository:
   - `index.html`
   - `favicon.png`
   - `site.webmanifest`
   - `HamzaKhalidCVCF(1).pdf`
   - `README.md`
   - `google-apps-script.js`
   - `google-sheet-setup-instructions.md`

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select "Deploy from a branch"
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 3. Access Your Website
- Your website will be available at: `https://yourusername.github.io/repository-name`
- It may take a few minutes for the site to become available
- GitHub will show you the URL in the Pages settings

### 4. Custom Domain Setup (Optional)
If you want to use `hamzakhalid.me`:
1. In the Pages settings, enter your custom domain
2. Configure your domain's DNS settings:
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub's IP addresses
3. Enable "Enforce HTTPS" once DNS propagates

### 5. Configure Contact Form
1. Follow the instructions in `google-sheet-setup-instructions.md`
2. Update the form submission URL in `index.html`
3. Test the contact form functionality

## File Checklist
- ✅ `index.html` - Main website file
- ✅ `favicon.png` - Website icon
- ✅ `site.webmanifest` - PWA manifest
- ✅ `HamzaKhalidCVCF(1).pdf` - Downloadable CV
- ✅ `README.md` - Documentation
- ✅ `google-apps-script.js` - Form backend code
- ✅ `google-sheet-setup-instructions.md` - Setup guide

## Post-Deployment Tasks
1. Test all links and functionality
2. Verify responsive design on mobile devices
3. Set up Google Apps Script for contact form
4. Update WhatsApp number in chat button
5. Configure analytics (optional)
6. Run Lighthouse audit for performance

Your professional portfolio website is now ready to go live! 🚀

