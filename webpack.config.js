const path = require('path')
const webpack = require("webpack");

module.exports = {
    entry: {
        enqweb3:'./dev/build.js',
        ENQweb3lib:'./dev/buildEnq.js'
    },
    resolve: {
        modules: ["node_modules"],
        alias: {
            process: "process/browser"
        },
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "assert": require.resolve("assert"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "url": require.resolve("url/"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            fs:false
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                            ],
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-modules-commonjs",
                        ],
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        library: "Web3",
        libraryTarget: "umd"
    },
    mode: 'production'
}