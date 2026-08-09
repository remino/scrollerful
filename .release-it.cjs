module.exports = {
	git: {
		commitMessage: 'Bump version to ${version}',
		requireCleanWorkingDir: true,
		requireUpstream: true,
		tagAnnotation: 'Release ${version}',
		tagName: 'v${version}',
	},
	github: {
		assets: ['dist/*'],
		autoGenerate: true,
		release: true,
		tokenRef: 'RELEASE_IT_GITHUB_TOKEN',
	},
	hooks: {
		'before:init': [
			'node -e "if (!process.env.RELEASE_IT_GITHUB_TOKEN) { console.error(\'RELEASE_IT_GITHUB_TOKEN is required for automated GitHub releases.\'); process.exit(1) }"',
			'npm test',
			'npm run typecheck',
			'npm run lint:check',
			'npm run format:check',
		],
		'after:bump': [
			'node bin/release-changelog.mjs promote ${version}',
			'node bin/release-readme.mjs update ${version}',
			'npm run build',
			'git add package.json package-lock.json CHANGELOG.md README.md dist',
		],
		'before:release':
			'npm pack --dry-run --cache /private/tmp/scrollerful-npm-cache',
		'after:github:release': 'npm run docs:publish',
	},
	npm: {
		publish: true,
		publishArgs: ['--access', 'public'],
	},
}
