# 🚀 Vercel Deployment Guide

Your code is ready to deploy! Follow these steps to get your Digital Twin MCP Server live.

## Prerequisites

- GitHub account (already done ✅)
- Vercel account (free tier is perfect)

---

## Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

## Step 2: Import Your Project

1. On Vercel dashboard, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find and select **archana-mukunthamani/digital-twin-mcp-portfolio**
4. Click **"Import"**

---

## Step 3: Configure Project Settings

### Root Directory
- **Important!** Set root directory to: `mcp-server`
- This tells Vercel where your Next.js app is located

### Framework Preset
- Should auto-detect as **Next.js**
- If not, select it manually

### Build Settings
**If these fields are locked and you can't edit them during import, don't worry!**

You can edit them after creating the project:

**Option A: Edit After Import**
1. Click "Import" (even if settings look wrong)
2. Go to Project Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Override" to edit each field
5. Set the values below
6. Redeploy

**Correct Build Settings:**
- **Build Command**: `pnpm build` (NOT `cd mcp-server && ...`)
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

**Why no `cd mcp-server`?** Because root directory is already set to `mcp-server`, so Vercel is already in that directory!

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add these **FIVE** variables:

| Name | Value | Where to Find |
|------|-------|---------------|
| `UPSTASH_VECTOR_REST_URL` | Your Upstash Vector URL | From your `.env.local` file |
| `UPSTASH_VECTOR_REST_TOKEN` | Your Upstash Vector token | From your `.env.local` file |
| `UPSTASH_REDIS_REST_URL` | Your Upstash Redis URL | From your `.env.local` file |
| `UPSTASH_REDIS_REST_TOKEN` | Your Upstash Redis token | From your `.env.local` file |
| `GROQ_API_KEY` | Your Groq API key | From your `.env.local` file |

**Important**: Make sure to add all **FIVE** variables before deploying!

**What each variable is for:**
- **UPSTASH_VECTOR_\***: Vector database for RAG (retrieves profile data)
- **UPSTASH_REDIS_\***: Redis database for analytics (stores interview history)
- **GROQ_API_KEY**: LLM API for generating interview responses

---

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see a success message with your live URL!

Your app will be available at: `https://digital-twin-mcp-portfolio.vercel.app`
(or similar URL assigned by Vercel)

---

## Step 6: Test Your Deployment

1. Click on the deployment URL
2. You should see your Digital Twin web UI
3. Try asking a question like "What are my recent projects?"
4. Verify the responses are working correctly

---

## Step 7: Add Custom Domain (Optional)

If you have a custom domain:

1. Go to your project settings in Vercel
2. Click **"Domains"**
3. Add your domain
4. Follow DNS configuration instructions

---

## Step 8: Update GitHub Repository

Once deployed, update your GitHub repository with the live URL:

1. Go to: https://github.com/archana-mukunthamani/digital-twin-mcp-portfolio
2. Click the ⚙️ gear icon next to "About"
3. Add your Vercel URL in the **"Website"** field
4. Click **"Save changes"**

---

## Troubleshooting

### Build Command Error: "cd mcp-server && pnpm install && pnpm build" exited with 1

**Problem**: Build fails with command error, or you can't edit build settings during import

**Solution - Edit Build Settings in Vercel:**

1. **Go to your project** in Vercel dashboard
2. Click **"Settings"** (top navigation)
3. Click **"General"** in the left sidebar
4. Scroll down to **"Build & Development Settings"**
5. Click **"Override"** next to each field to enable editing
6. Set these values:
   - **Build Command**: `pnpm build` (remove any `cd mcp-server`)
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
   - **Root Directory**: `mcp-server` (if not already set)
7. Click **"Save"**
8. Go to **"Deployments"** tab
9. Click the **"..."** menu on the latest deployment
10. Click **"Redeploy"**

**Key Point**: Since root directory is `mcp-server`, the build commands should NOT include `cd mcp-server`!

### Build Fails

**Problem**: "Build failed" error

**Solution**: 
1. Check if environment variables are set correctly
2. Verify root directory is set to `mcp-server`
3. Check the build logs for specific errors

### Environment Variables Not Working

**Problem**: App loads but queries fail

**Solution**:
1. Go to Project Settings → Environment Variables
2. Verify all three variables are present
3. Redeploy after adding variables

### 404 Error

**Problem**: Page not found

**Solution**:
1. Verify root directory is `mcp-server`
2. Clear Vercel cache and redeploy
3. Check framework preset is Next.js

### API Route Issues

**Problem**: MCP endpoint not responding

**Solution**:
1. Check environment variables are set
2. Verify Upstash database is accessible
3. Check deployment logs for errors

---

## Post-Deployment Checklist

- [ ] Deployment successful
- [ ] Web UI loads correctly
- [ ] Can ask questions and get responses
- [ ] Live URL added to GitHub repository
- [ ] Tested on mobile device
- [ ] Shared on LinkedIn with live demo link

---

## Automatic Deployments

🎉 **Good news!** Vercel automatically deploys whenever you push to your `main` branch.

To deploy updates:
```bash
git add .
git commit -m "Update: your changes"
git push portfolio main
```

Vercel will automatically build and deploy the new version!

---

## Production Optimization

### Performance
- Vercel automatically optimizes images
- Next.js 15 provides excellent performance out of the box
- Edge functions are enabled by default

### Monitoring
1. Go to your project in Vercel
2. Click **"Analytics"** to see:
   - Page views
   - Response times
   - Error rates

### Limits (Free Tier)
- 100 GB bandwidth/month
- Unlimited requests
- 100 build hours/month
- More than enough for a portfolio project!

---

## Next Step: Share on LinkedIn! 🎯

Once deployed, your portfolio is ready to share. See the LinkedIn sharing guide next!
