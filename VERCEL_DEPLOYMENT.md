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

### Build Settings (Should Auto-Detect)
- Build Command: `pnpm build`
- Output Directory: `.next`
- Install Command: `pnpm install`

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add these three variables:

| Name | Value | Where to Find |
|------|-------|---------------|
| `UPSTASH_VECTOR_REST_URL` | Your Upstash URL | From your `.env.local` file |
| `UPSTASH_VECTOR_REST_TOKEN` | Your Upstash token | From your `.env.local` file |
| `GROQ_API_KEY` | Your Groq API key | From your `.env.local` file |

**Important**: Make sure to add all three variables before deploying!

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
