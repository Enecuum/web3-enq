const path = require('path')
const webpack = require("webpack");

module.exports = {
    entry: {
        enqweb3:'./prebuild/enqweb3.min.js',
    },
    resolve: {
        //modules: ["node_modules"],
        alias: {
            '@':__dirname,
            '@packs':path.resolve(__dirname,"packages")
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    useBuiltIns: "entry",
                                    corejs: 3,
                                    targets: {
                                        ie: 10,
                                    },
                                },
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
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].min.js',
        library: "Web3",
        libraryTarget: "umd"
    },
    mode:'production'
}