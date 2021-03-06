const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const paths = require('./paths');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    stats: {
        //https://github.com/webpack-contrib/mini-css-extract-plugin/issues/138
        children: false,
        assets: false,
        warnings: false,
    },
    output: {
        path: paths.outputPath,
        filename: 'js/[name]-[contenthash:8].js',
        chunkFilename: 'js/[name]-[contenthash:8].js',
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(), // so that file hashes don't change unexpectedly
        new CleanWebpackPlugin(),
        new Dotenv({
            path: paths.envProdPath, // Path to .env.production file
            expand: true,
        }),
        new Dotenv({
            path: paths.envPath, // Path to .env file
            expand: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[contenthash:8].css',
            chunkFilename: 'css/[name]-[contenthash:8].css',
        }),
    ],
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
};
