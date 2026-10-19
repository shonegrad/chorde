#!/bin/bash

# Abort on errors
set -e

# Build
echo "Building project..."
npm run build

# Navigate into the build output directory
cd packages/web/dist

# Create a fresh git repo in dist/
rm -rf .git
git init
git add -A
git commit -m 'deploy'

# Force push to the gh-pages branch of the remote repo
git push -f https://github.com/shonegrad/chorde.git HEAD:gh-pages

cd -
echo "Deployment complete! Check https://shonegrad.github.io/chorde/"
