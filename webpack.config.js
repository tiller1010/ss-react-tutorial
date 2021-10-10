const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		browser: {
			import: [
				'@babel/polyfill',
				path.resolve(__dirname, 'themes/simple/javascript/react/browser.jsx'),
				'style-loader!' + path.resolve(__dirname, 'themes/simple/scss/custom.scss')
			]
		},
		server: {
			import: [
				'@babel/polyfill',
				path.resolve(__dirname, 'themes/simple/javascript/react/server.jsx')
			]
		}
	},
	output: {
		filename: 'javascript/[name]-bundle.js',
		path: path.resolve(__dirname, 'themes/simple')
	},
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.jsx$/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	}
}