# Creating Your Portfolio Repository - Step-by-Step Guide

This guide will help you create a completely new GitHub repository for your portfolio and push all your project code to it.

## 📝 Overview

You're transitioning from:
- ❌ Team repository: `Himani1201/digital-twin-project-team2`
- ❌ Fork: `archana-mukunthamani/digital-twin-project-team2-1`

To:
- ✅ **Your own portfolio repository** (fresh start, professional presentation)

---

## 🎯 Step 1: Create New Repository on GitHub

### 1.1 Go to GitHub
1. Visit [github.com](https://github.com)
2. Sign in to your account

### 1.2 Create Repository
1. Click the **"+"** icon in the top-right corner
2. Select **"New repository"**

### 1.3 Configure Repository Settings

Fill in these details:

| Field | Value | Notes |
|-------|-------|-------|
| **Owner** | Your GitHub username | Should be selected by default |
| **Repository name** | `digital-twin-mcp-portfolio` | Or choose your own name |
| **Description** | "Digital Twin MCP Server - A RAG-powered AI assistant using Upstash Vector and Next.js" | Makes it clear what the project does |
| **Visibility** | **Public** ✅ | Important for portfolio/LinkedIn |
| **Initialize README** | ❌ **LEAVE UNCHECKED** | You already have all the files |
| **Add .gitignore** | ❌ **LEAVE UNCHECKED** | You already have one |
| **Choose a license** | ✅ Optional: MIT License | Good for portfolio projects |

### 1.4 Create Repository
Click the green **"Create repository"** button.

### 1.5 Copy Repository URL
GitHub will show you a page with setup instructions. **Copy the HTTPS URL** shown at the top:
```
https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio.git
```

**IMPORTANT**: Save this URL - you'll need it in the next step!

---

## 🔧 Step 2: Update Local Repository Configuration

### 2.1 Edit the Setup Script

1. Open the file: `setup-new-repo.bat`
2. Find this line:
   ```batch
   set NEW_REPO_URL=YOUR_NEW_REPO_URL
   ```
3. Replace `YOUR_NEW_REPO_URL` with your actual repository URL:
   ```batch
   set NEW_REPO_URL=https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio.git
   ```
4. Save the file

### 2.2 Run the Setup Script

Open PowerShell in your project directory and run:

```powershell
.\setup-new-repo.bat
```

This script will:
- ✅ Commit all your current changes
- ✅ Add the new remote repository (named "portfolio")
- ✅ Create a clean `main` branch from your `dev` branch
- ✅ Push everything to your new portfolio repository

### 2.3 What Happens During the Script

The script performs these git operations:

```bash
# 1. Commits your latest work
git add [all your new files]
git commit -m "Portfolio ready: Final presentation materials"

# 2. Adds new remote
git remote add portfolio https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio.git

# 3. Creates main branch
git branch -M dev main

# 4. Pushes to new repository
git push -u portfolio main
```

---

## 🎨 Step 3: Polish Your Repository (Make it Portfolio-Ready)

Now that your code is pushed, let's make it LinkedIn-worthy!

### 3.1 Replace README

Your current README is team-focused. Replace it with the portfolio version:

```powershell
# In your project directory
Copy-Item README-PORTFOLIO.md README.md -Force
git add README.md
git commit -m "docs: Update README for portfolio presentation"
git push portfolio main
```

### 3.2 Add Repository Topics (Tags)

Topics help people discover your project:

1. Go to your repository on GitHub
2. Click the ⚙️ (settings gear) next to "About" 
3. Add these topics:
   - `mcp-server`
   - `rag`
   - `retrieval-augmented-generation`
   - `nextjs`
   - `typescript`
   - `upstash`
   - `vector-database`
   - `digital-twin`
   - `ai-assistant`
   - `portfolio-project`

### 3.3 Add Repository Description

In the same "About" section:
- Description: "AI-powered digital twin assistant using RAG (Retrieval-Augmented Generation) with Upstash Vector and Next.js"
- Website: Add your deployed Vercel URL (if deployed)

### 3.4 Pin Repository to Profile

1. Go to your GitHub profile page
2. Click "Customize your pins"
3. Select your new `digital-twin-mcp-portfolio` repository
4. This will show it prominently on your profile

---

## 🚀 Step 4: Deploy to Vercel (Optional but Recommended)

A live demo makes your portfolio much more impressive!

### 4.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `digital-twin-mcp-portfolio` repository

### 4.2 Configure Environment Variables

Add these in Vercel:
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`
- `GROQ_API_KEY`

### 4.3 Deploy

Click "Deploy" and wait for the build to complete.

### 4.4 Add Live URL to Repository

Once deployed:
1. Copy your Vercel URL (e.g., `https://digital-twin-mcp-portfolio.vercel.app`)
2. Go to your GitHub repository settings
3. Add it to the "Website" field in the "About" section

---

## 💼 Step 5: Share on LinkedIn

### 5.1 Create a LinkedIn Post

Here's a template:

```
🚀 Excited to share my latest project: Digital Twin MCP Server!

I built an AI-powered assistant that uses Retrieval-Augmented Generation (RAG) 
to answer questions about professional profiles. It's like having a smart 
assistant that knows everything about your career!

🔧 Tech Stack:
• Next.js 15 + TypeScript
• Upstash Vector Database
• Groq API (Llama 3.3)
• Model Context Protocol (MCP)

💡 Key Features:
• Semantic search using vector embeddings
• Job posting analysis & matching
• Technical interview simulation
• Dual interface: MCP server + Web UI

This project taught me a lot about LLMs, vector databases, and building 
production-ready RAG systems.

🔗 Check it out: https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio
[If deployed] 🌐 Live demo: https://your-app.vercel.app

#AI #MachineLearning #RAG #NextJS #TypeScript #VectorDatabase #Portfolio

[Add relevant hashtags for your field]
```

### 5.2 Add to LinkedIn Profile

1. Go to your LinkedIn profile
2. Click "Add profile section" → "Featured"
3. Add a link to your GitHub repository
4. Use a screenshot of your project as the thumbnail

### 5.3 Update LinkedIn Projects Section

Add an entry in the "Projects" section:
- **Project name**: Digital Twin MCP Server
- **Description**: AI-powered RAG assistant using Upstash Vector and Next.js
- **Project URL**: Your GitHub repository URL
- **Time period**: Your project dates

---

## 🧹 Step 6: Clean Up Old Remotes (Optional)

If you want to completely disconnect from the team repository:

```powershell
# Remove the old remotes
git remote remove origin
git remote remove myfork

# Rename 'portfolio' to 'origin' (makes it the default)
git remote rename portfolio origin

# Verify
git remote -v
```

Now your local repository only points to your portfolio repository!

---

## ✅ Verification Checklist

Before sharing your portfolio, verify:

- [ ] Repository is public
- [ ] README is clear and professional
- [ ] Topics/tags are added
- [ ] .env and .env.local are NOT in the repository (check .gitignore)
- [ ] All important files are committed
- [ ] Code is well-organized
- [ ] Documentation is up-to-date
- [ ] License is added (if desired)
- [ ] Repository is pinned to your profile
- [ ] Live demo is deployed (optional)
- [ ] LinkedIn post is created
- [ ] LinkedIn profile is updated

---

## 🎯 Additional Tips for Portfolio Presentation

### Add Visual Elements

Consider adding to your README:
- 📸 Screenshots of the web UI
- 📊 Architecture diagrams (use the Mermaid diagrams from New_Docs/)
- 🎥 GIF demo of the application in action
- 📈 Performance metrics or benchmarks

### Highlight Technical Decisions

Add a `docs/TECHNICAL_DECISIONS.md` file explaining:
- Why you chose Upstash Vector
- Why you use Groq instead of OpenAI
- How you optimized the RAG pipeline
- Challenges you overcame

### Add Code Quality Badges

Add badges to your README for:
- TypeScript
- Build status
- Code style (Prettier/ESLint)
- Dependencies status

---

## 🛠️ Troubleshooting

### Problem: "Remote already exists"
```bash
# Solution: Remove and re-add
git remote remove portfolio
git remote add portfolio YOUR_URL
```

### Problem: "Failed to push"
```bash
# Solution: Force push (safe because it's a new repo)
git push -u portfolio main --force
```

### Problem: ".env files are in the repository"
```bash
# Solution: Remove them
git rm --cached .env .env.local mcp-server/.env.local
git commit -m "Remove sensitive files"
git push
```

---

## 🎓 Summary

You've successfully:
1. ✅ Created a new independent repository
2. ✅ Pushed all your code to it
3. ✅ Made it portfolio-ready
4. ✅ Prepared it for LinkedIn sharing

Your digital twin project is now ready to impress recruiters and show off your skills!

---

## 📞 Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Verify your repository URL is correct
3. Ensure you have write permissions to the repository
4. Check that your .gitignore is working properly

Good luck with your portfolio! 🚀
