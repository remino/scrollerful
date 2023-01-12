require 'terser'

activate :livereload

activate :autoprefixer do |prefix|
	prefix.browsers = 'last 2 versions'
end

configure :build do
	activate :gzip
	activate :minify_css
	activate :minify_javascript, compressor: Terser.new

	activate :asset_hash do |config|
		config.ignore = [
			/share-.*/,
		]
	end
	
	after_configuration do
		use ::HtmlCompressor::Rack,
			compress_css: true,
			compress_javascript: true,
			css_compressor: :yui,
			enabled: true,
			javascript_compressor: :yui,
			preserve_line_breaks: false,
			preserve_patterns: [],
			remove_comments: true,
			remove_form_attributes: false,
			remove_http_protocol: false,
			remove_https_protocol: false,
			remove_input_attributes: true,
			remove_intertag_spaces: true,
			remove_javascript_protocol: true,
			remove_link_attributes: true,
			remove_multi_spaces: true,
			remove_quotes: true,
			remove_script_attributes: true,
			remove_style_attributes: true,
			simple_boolean_attributes: true,
			simple_doctype: false
	end

	after_build do |builder|
		builder.thor.run 'bin/build_brotli build'
	end

	before_build do |builder|
		builder.thor.run 'npm run js:build'
	end

	ignore '/nav/*'
	ignore '/index.html'
end

activate :external_pipeline,
	name: :css,
	command: "npm run #{build? ? 'css:build' : 'css:watch'}",
	source: ".build/css",
	latency: 2

activate :external_pipeline,
	name: :js,
	command: "npm run #{build? ? 'js:build' : 'js:watch'}",
	source: ".build/js",
	latency: 2

ignore '.DS_Store'

page '/*.json', layout: false
page '/*.txt', layout: false
page '/*.xml', layout: false

prefix = '/scrollerful'

set :source, 'pages'
set :build_dir, 'build'
set :css_dir, prefix
set :haml, { format: :html5 }
set :images_dir, prefix
set :js_dir, prefix
set :partials_dir, prefix
set :relative_links, false
