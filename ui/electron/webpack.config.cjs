const path = require('path');

module.exports = {
    entry: './src/renderer.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'renderer.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@shared': path.resolve(__dirname, '../shared')
        },
    },
    target: 'electron-renderer',
};
