const webpack = require('webpack')

module.exports = {
	devtool: 'source-map',
	entry: './myapp.js',
	output: {
		filename: './public/javascripts/bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env']
			}
		}]
	}
}