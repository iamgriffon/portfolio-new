#!/bin/bash

# Exit on error
set -e

# Display commands
set -x

# Create the build directory
GITHUB_PAGES=true npm run build

# Run the preparation script
node scripts/prepare-gh-pages.js

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d out -t true

echo "Deployed successfully!" 