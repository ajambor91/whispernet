/** @type {import('next').NextConfig} */
import path from "node:path";
import {fileURLToPath} from "node:url";
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8099/api/:path*',
            },
        ];
    },
     webpack: (config) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        config.resolve.alias['@shared'] = path.resolve(__dirname,'..','shared');
        return config;
    },
    sassOptions: {
        additionalData: `$var: red;`,
    },
    experimental: {
        externalDir: true,
    },

};

export default nextConfig;
