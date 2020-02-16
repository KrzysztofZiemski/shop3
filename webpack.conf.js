const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        app: './src/scripts/handleSite.js',
        registration: './src/scripts/handleRegistration.js',
        login: './src/scripts/handleLogin.js',
        admin: './src/scripts/adminSite.js',
        logout: './src/scripts/handleLogout.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'disc'),
        publicPath: "http://localhost:8080/"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'shop',
            template: './src/shop/index.html',
            filename: 'index.html',
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            title: 'registration-shop',
            template: './src/registration/index.html',
            filename: 'registration/index.html',
            chunks: ['registration'],
        }),
        new HtmlWebpackPlugin({
            title: 'login-shop',
            template: './src/login/index.html',
            filename: 'login/index.html',
            chunks: ['login'],
        }),
        new HtmlWebpackPlugin({
            title: 'admin',
            template: './src/admin/index.html',
            filename: 'admin/index.html',
            chunks: ['admin'],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
            chunkFilename: path.resolve(__dirname, 'disc'),
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            title: 'logout',
            template: './src/logout/index.html',
            filename: 'logout/index.html',
            chunks: ['logout'],
        }),
    ],
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.js$/, use: 'babel-loader' },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8080,
    }
}