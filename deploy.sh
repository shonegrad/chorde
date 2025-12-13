#!/bin/bash

# Abort on errors
set -e

# Build
echo "Building project..."
npm run build

# Navigate into the build output directory
cd dist

# Create a fresh git repo in dist/
git init
git add -A
git commit -m 'deploy'

# Force push to the gh-pages branch of the remote repo
# (Uses the URL of the parent repo)
git push -f https://github.com/shonegrad/chorde.git master:gh-pages

cd -
echo "Deployment complete! Check https://shonegrad.github.io/chorde/"
