const path = require('path')

//Version Upgrade: Update this and have a better grasp over what exactly it is doing
module.exports = {
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: true,
        hot: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    performance: {
        hints: false
    },
    mode: 'development'
}