/** @type {import('next').NextConfig} */
import path from "node:path";
import {fileURLToPath} from "node:url";
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8099/:path*',
            },
        ];
    },
     webpack: (config) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');
        return config;
    },
    sassOptions: {
        additionalData: `$var: red;`,
    },
};

export default nextConfig;
