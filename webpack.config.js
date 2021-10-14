const path = require('path');
const webpack = require('webpack');

// Import the core config
const webpackConfig = require('@silverstripe/webpack-config');
const {
	resolveJS,
	externalJS,
	moduleJS,
	// pluginJS,
	moduleCSS,
	pluginCSS,
} = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
	// the root path, where your webpack.config.js is located.
	ROOT: path.resolve(),
	// your node_modules folder name, or full path
	MODULES: 'node_modules',
	// relative path from your css files to your other files, such as images and fonts
	FILES_PATH: '../',
	// thirdparty folder containing copies of packages which wouldn't be available on NPM
	THIRDPARTY: 'thirdparty',
	// the root path to your javascript source files
	SRC: path.resolve('app/client/src'),
	// Dist
	DIST: path.resolve('app/client/dist'),
}

module.exports = [
	{
		name: 'app',
		entry: {
			main: `${PATHS.SRC}/js/main.jsx`
		},
		output: {
			path: PATHS.DIST,
			filename: 'js/[name].bundle.js',
		},
		devtool: (ENV !== 'production') ? 'source-map' : '',
		resolve: resolveJS(ENV, PATHS),
		externals: externalJS(ENV, PATHS),
		module: moduleJS(ENV, PATHS),
		// plugins: pluginJS(ENV, PATHS)
	},
	{
		name: 'theme',
		entry: [
			'@babel/polyfill',
			path.resolve(__dirname, 'themes/simple/javascript/react/index.jsx'),
			path.resolve(__dirname, 'themes/simple/scss/custom.scss')
		],
		output: {
			filename: 'javascript/bundle.js',
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
							loader: 'style-loader'
						},
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
];