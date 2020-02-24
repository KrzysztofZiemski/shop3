const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/scripts/handleSite.js'),
        registration: path.resolve(__dirname, './src/scripts/handleRegistration.js'),
        login: path.resolve(__dirname, './src/scripts/handleLogin.js'),
        admin: path.resolve(__dirname, './src/scripts/adminSite.js'),
        logout: path.resolve(__dirname, './src/scripts/handleLogout.js'),
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
            template: path.resolve(__dirname, './src/pages/shop/index.html'),
            filename: 'index.html',
            chunks: ['app'],
        }),
        new HtmlWebpackPlugin({
            title: 'registration-shop',
            template: path.resolve(__dirname, './src/pages/registration/index.html'),
            filename: 'registration/index.html',
            chunks: ['registration'],
        }),
        new HtmlWebpackPlugin({
            title: 'login-shop',
            template: path.resolve(__dirname, './src/pages/login/index.html'),
            filename: 'login/index.html',
            chunks: ['login'],
        }),
        new HtmlWebpackPlugin({
            title: 'admin',
            template: path.resolve(__dirname, './src/pages/admin/index.html'),
            filename: 'admin/index.html',
            chunks: ['admin'],
        }),
        new HtmlWebpackPlugin({
            title: 'logout',
            template: path.resolve(__dirname, './src/pages/logout/index.html'),
            filename: 'logout/index.html',
            chunks: ['logout'],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: path.resolve(__dirname, 'disc'),
            ignoreOrder: false,
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