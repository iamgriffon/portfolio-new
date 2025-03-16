import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const isProd =process.env.NODE_ENV === 'production'
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
  assetPrefix: isProd ? '/portfolio-new/' : '',
  basePath: isProd ? '/portfolio-new' : '',
  output: 'standalone',
  distDir: 'build',
}
export default withNextIntl(nextConfig); 