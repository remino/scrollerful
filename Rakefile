namespace :build do
	def build(env)
		puts "Building for #{env}"
		system "TARGET=#{env} bundle exec middleman build --clean"
	end

	desc "Build site for staging"
	task :staging do
		build :staging
	end

	desc "Build site for production"
	task :production do
		build :production
	end
end

namespace :deploy do
	def deploy(env)
		puts "Building for #{env}"
		system "bin/deploy -c .env -c .env.#{env} -r"
	end

	desc "Deploy site for staging"
	task :staging do
		deploy :staging
	end

	desc "Deploy site for production"
	task :production do
		deploy :production
	end
end

desc "Serve development site"
task :serve do
	system "bundle exec middleman server"
end

task default: :serve
