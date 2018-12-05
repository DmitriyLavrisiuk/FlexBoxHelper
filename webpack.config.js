// basic
const path = require('path');
const webpack = require('webpack');

// addition plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = (process.env.NODE_ENV === 'production');

// module settings
module.exports = {
    // path to base project
    context: path.resolve(__dirname, 'src'),

    // entry points
    entry: {
        // main file of project
        main: [
            './js/main.js',
            './scss/main.scss'
        ],
    },

    // path to building project
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '../'
    },

    // devServer configuration
    devServer: {
        contentBase: './app',
        port: 9000
    },

    devtool: (isProduction) ? '' : 'inline-source-map',

    module: {
        rules: [

            // SCSS
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'postcss-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        },
                    ],
                    fallback: 'style-loader',
                })
            },

            // IMAGES
            {
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: { name: '[path][name].[ext]' },
                    },
                    'img-loader',
                ],
            },

            // FONTS
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: { name: '[path][name].[ext]' }
                },
            },

            // SVG
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },
        ],
    },

    plugins: [
        /*new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            '$.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        }),*/
        new ExtractTextPlugin('./css/[name].css'),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([{ from: './img', to: 'img' }], {ignore: [{ glob:'svg/*'  },]}),
    ],
}


// PRODUCTION EXPORTS PLUGINS
if(isProduction) {
    module.exports.plugins.push(
        new UglifyJSPlugin({
            sourceMap: true
        }),
    );

    module.exports.plugins.push(
        new ImageminPlugin({
            test: /\.(png|jpe?g|gif|svg)$/i
        }),
    );

    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    );
}