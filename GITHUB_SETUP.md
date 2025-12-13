# GitHub Repository Setup Guide

## Option 1: Using GitHub Web Interface (Recommended)

1. **Create Repository on GitHub**:
   - Go to https://github.com/new
   - Repository name: `chorde`
   - Description: "A modern songbook application for musicians with ChordPro support"
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Add Remote and Push**:
   ```bash
   # Add the remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/chorde.git
   
   # Push to GitHub
   git push -u origin master
   ```

## Option 2: Using GitHub CLI (If Installed)

```bash
# Install gh CLI first (if not already installed)
brew install gh

# Authenticate
gh auth login

# Create repo and push
gh repo create chorde --public --source=. --remote=origin --push
```

## After Pushing

Your repository will be live at:
`https://github.com/YOUR_USERNAME/chorde`

You can now share, collaborate, and deploy from GitHub!
