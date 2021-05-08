const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: [
		'@babel/polyfill',
		path.resolve(__dirname, 'themes/simple/javascript/react/index.jsx')
	],
	output: {
		filename: 'javascript/bundle.js',
		path: path.resolve(__dirname, 'themes/simple')
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx$/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}