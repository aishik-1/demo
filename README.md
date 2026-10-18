# B/Stack — Tech Club Platform & Engineering Guild

Official platform for **B/Stack**, the tech collective of Bosscoder School of Technology. Includes interactive 3D fluid scene, member directory, live front-page upcoming events editor, attendance verification, and role-based Google OAuth authentication.

---

## 🔐 Google OAuth & Role-Based Dashboard Access Control

Access to the **Guild Dashboard & Events Editor** is strictly protected and restricted to authorized administrator email addresses:

- `ziyadparkar01@gmail.com` (Ziyad Parkar - B/ALGO Lead)
- `aishikroy123@gmail.com` (Aishik Roy - Tech Club Head)
- `propriyansh71@gmail.com` (Priyansh Singh - B/HACK Lead)

### How Access Control Works:
1. **Google OAuth Verification**: When a user signs in via Google OAuth or enters their email, the profile email is verified against the authorized administrator whitelist.
2. **Authorized Access (200)**: Only users on the whitelist (`ziyadparkar01@gmail.com`, `aishikroy123@gmail.com`, `propriyansh71@gmail.com`) are granted instant access to the Dashboard with event editing and guild management permissions.
3. **Unauthorized Denial (403)**: Any user whose email is not on the authorized whitelist is blocked by the **403 Forbidden Access Screen**, preventing unauthorized access to the dashboard.
4. **Dynamic Whitelist Management**: Authorized administrators can view, add, or remove email addresses in the **Approved Event Editors** modal directly inside the dashboard.

---

## 🚀 How to Push to GitHub

1. Open your terminal in this project directory:
   ```bash
   # Initialize git (if not already initialized)
   git init

   # Stage all files
   git add .

   # Commit
   git commit -m "feat: B/Stack Tech Club with Google OAuth & role-based dashboard access"

   # Set branch to main
   git branch -M main
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g. `bstack-tech-club`). Do not add a README or .gitignore since they already exist in this project.

3. Link your remote repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```

---

## ⚡ How to Deploy on Vercel

1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New...** &rarr; **Project**.
3. Select your GitHub repository (`bstack-tech-club`) and click **Import**.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**: Add your Google OAuth credentials:
   - `VITE_GOOGLE_CLIENT_ID` = `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
   - `GOOGLE_CLIENT_ID` = `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
6. Click **Deploy**. Vercel will build and assign you a live production URL (e.g., `https://bstack-tech-club.vercel.app`).

---

## 🌐 Google Cloud Console Setup for Vercel

To allow real Google OAuth popup login on your live Vercel domain:

1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your OAuth 2.0 Web Client ID.
3. Under **Authorized JavaScript origins**, add:
   - `https://your-app-name.vercel.app`
   - `http://localhost:3000` (for local dev)
4. Under **Authorized redirect URIs**, add:
   - `https://your-app-name.vercel.app`
   - `http://localhost:3000`
5. Click **Save**.

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start local full-stack development server (Express + Vite)
npm run dev

# Build for production
npm run build
```

---

© 2026 B/Stack — Bosscoder School of Technology. All rights reserved.
