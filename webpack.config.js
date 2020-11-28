const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname,'./src/app.js'),
    output: {
        filename: "bundle.js",
        path: path.join(__dirname,'public')
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
      	    {
        	test: /\.css$/,
        	use: [
          		"style-loader",
          		"css-loader",
        	]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
};