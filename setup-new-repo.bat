@echo off
REM Setup script for pushing to new portfolio repository
REM 
REM BEFORE RUNNING THIS SCRIPT:
REM 1. Create a new repository on GitHub.com
REM 2. Copy the repository URL (e.g., https://github.com/YOUR-USERNAME/digital-twin-mcp-portfolio.git)
REM 3. Replace YOUR_NEW_REPO_URL below with your actual repository URL

echo ========================================
echo Digital Twin Portfolio Repository Setup
echo ========================================
echo.

REM Replace this with your actual repository URL from GitHub
set NEW_REPO_URL=https://github.com/archana-mukunthamani/digital-twin-mcp-portfolio.git

if "%NEW_REPO_URL%"=="YOUR_NEW_REPO_URL" (
    echo ERROR: Please edit this script and replace YOUR_NEW_REPO_URL with your actual GitHub repository URL
    echo.
    echo Example: set NEW_REPO_URL=https://github.com/username/digital-twin-mcp-portfolio.git
    pause
    exit /b 1
)

echo Step 1: Committing current changes...
git add PRESENTATION_SLIDES.md
git add New_Docs/
git add job-postings/job5.md
git add scripts/simulate_interview_job5.py
git add scripts/embed_digitaltwin.py
git add test_recent_projects.py
git add test_vector_query.py
git commit -m "Portfolio ready: Final presentation materials and project completion"

echo.
echo Step 2: Adding new remote repository (portfolio)...
git remote add portfolio %NEW_REPO_URL%

echo.
echo Step 3: Verifying remotes...
git remote -v

echo.
echo Step 4: Creating main branch from dev...
git branch -M dev main

echo.
echo Step 5: Pushing to new portfolio repository...
git push -u portfolio main

echo.
echo ========================================
echo SUCCESS! Your code is now in your portfolio repository
echo ========================================
echo.
echo Next steps:
echo 1. Visit your repository on GitHub
echo 2. Add topics/tags for better discoverability: "mcp-server", "rag", "nextjs", "upstash", "digital-twin"
echo 3. Enable GitHub Pages if you want to deploy the web UI
echo 4. Update your LinkedIn with the new repository link
echo.
echo Your new portfolio repository: %NEW_REPO_URL%
echo.
pause
