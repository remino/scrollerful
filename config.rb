require 'terser'

activate :directory_indexes
activate :livereload

activate :autoprefixer do |prefix|
	prefix.browsers = 'last 2 versions'
end

configure :build do
	activate :asset_hash, exts: %w(.css .js)
	activate :gzip
	activate :minify_javascript, compressor: Terser.new
	
	after_configuration do
		use ::HtmlCompressor::Rack,
			if: :use_middleware?,
			compress_css: true,
			compress_javascript: true,
			css_compressor: :yui,
			enabled: true,
      javascript_compressor: Terser.new,
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

	activate :external_pipeline,
		name: :img,
		command: "bin/build_images #{app.source_dir} .build/img",
		source: ".build/img",
		latency: 2

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

helpers do
	def use_middleware?(path)
		puts 'path: ' + path
		path != '/scrollerful/demo/simple/index.html'
	end
end
	
ignore '.DS_Store'

page '/*.json', layout: false
page '/*.txt', layout: false
page '/*.xml', layout: false
page '/scrollerful/demo/readme.html', layout: false

prefix = '/scrollerful'

set :source, 'pages'
set :build_dir, 'build'
set :css_dir, prefix
set :haml, { format: :html5 }
set :images_dir, prefix
set :js_dir, prefix
set :partials_dir, prefix
set :relative_links, false
