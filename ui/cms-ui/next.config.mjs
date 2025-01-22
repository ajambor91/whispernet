/** @type {import('next').NextConfig} */
import  i18n from './i18n.config.mjs';


const nextConfig = {
  i18n,
  /* config options here */
  reactStrictMode: true,
  sassOptions: {
    additionalData: `$var: red;`,
  },
  experimental: {
    externalDir: true,
    turbo: false
  },
  async rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: 'http://127.0.0.1:9099/cms/:path*',
      },
    ];
  },


};

export default nextConfig;
