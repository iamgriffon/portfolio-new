# GitHub Pages Deployment Guide

This guide explains how to deploy your Next.js portfolio to GitHub Pages.

## Automatic Deployment with GitHub Actions

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages whenever you push to the `main` branch.

### Prerequisites

1. Make sure GitHub Pages is enabled for your repository:
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the `gh-pages` branch and `/(root)` folder
   - Click Save

### How It Works

1. Push your changes to the `main` branch
2. GitHub Actions will automatically:
   - Build your Next.js application with static export
   - Deploy it to the `gh-pages` branch
   - Make it available at `https://[username].github.io/portfolio`

### Workflow Details

The workflow is defined in `.github/workflows/deploy.yml` and handles:
- Building the Next.js application
- Exporting static files
- Deploying to GitHub Pages

## Manual Deployment

You can also deploy manually using the provided npm scripts:

```bash
# Deploy to GitHub Pages
npm run deploy:gh-pages
```

Or use the shell script:

```bash
./scripts/deploy-gh-pages.sh
```

## Configuration

The deployment is configured in:

1. `next.config.mjs` - Configures Next.js for static export
2. `package.json` - Contains deployment scripts
3. `.github/workflows/deploy.yml` - GitHub Actions workflow

## Troubleshooting

### Images or Assets Not Loading

If images or assets are not loading, check:
- Ensure all links to assets use relative paths
- Verify that `assetPrefix` and `basePath` in `next.config.mjs` match your repository name

### 404 Errors on Page Refresh

GitHub Pages doesn't natively support SPA routing. You can:
- Use the `as` prop for Next.js links
- Consider using 404.html redirect hack for client-side routing

### Environment Variables

For production environment variables with GitHub Pages:
1. Add them to GitHub repository secrets
2. Reference them in your GitHub Actions workflow 