import sass from 'rollup-plugin-sass'

export default {
	input: 'source/js/index.js',
	output: {
		compact: true,
		file: 'source/scrollerful/script.js',
		format: 'iife',
	},
	plugins: [sass()],
}
