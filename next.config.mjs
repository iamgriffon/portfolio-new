import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const isProd = process.env.NODE_ENV === 'production';
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'portfolio';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'github.com',
      },
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  assetPrefix: isProd && isGithubPages ? `/${repoName}/` : '',
  basePath: isProd && isGithubPages ? `/${repoName}` : '',
  output: 'export',
  distDir: 'out',
}

export default withNextIntl(nextConfig); 