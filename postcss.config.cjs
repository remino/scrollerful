module.exports = {
	plugins: [
		require('autoprefixer'),
		require('cssnano')({
			preset: require('cssnano-preset-default'),
		}),
	],
}
