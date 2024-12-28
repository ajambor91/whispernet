/** @type {import('next').NextConfig} */


const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  sassOptions: {
    additionalData: `$var: red;`,
  },
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/cms:path*',
        destination: 'http://127.0.0.1:8099/cms:path*',
      },
    ];
  },


};

export default nextConfig;
