namespace :build do
	def build(env)
		puts "Building for #{env}"
		system "TARGET=#{env} npm run build"
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
	desc "Deploy site to production"
	task :production do
		system "bin/deploy -c .env -r"
	end
end

desc "Serve development site"
task :serve do
	system "npm start"
end

task default: :serve
