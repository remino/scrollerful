import { execFile } from 'child_process'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcss from 'postcss'
import { rm, readFile, mkdir, copyFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { build } from 'vite'
import { promisify } from 'util'

const root = process.cwd()
const execFileAsync = promisify(execFile)

const paths = {
	dist: resolve(root, 'dist'),
	distLegacy: resolve(root, 'dist/scrollerful'),
	publicAssets: resolve(root, 'public/scrollerful'),
}

const packageJson = JSON.parse(
	await readFile(resolve(root, 'package.json'), 'utf8')
)
const currentYear = new Date().getFullYear()
const banner = `/*! ${packageJson.name} v${packageJson.version} | (c) 2022-${currentYear} ${packageJson.author.name} <${packageJson.author.url}> | ${packageJson.license} Licence */`

const inlineCssStringPlugin = () => ({
	enforce: 'pre',
	name: 'inline-css-string',
	async resolveId(source, importer) {
		const query = '?inline'
		if (!source.endsWith(query)) return null

		const sourcePath = source.slice(0, -query.length)
		const resolved = await this.resolve(sourcePath, importer, {
			skipSelf: true,
		})

		if (!resolved) return null

		return `inline-css:${Buffer.from(resolved.id).toString('base64url')}`
	},
	async load(id) {
		const prefix = 'inline-css:'
		if (!id.startsWith(prefix)) return null

		const filePath = Buffer.from(id.slice(prefix.length), 'base64url').toString(
			'utf8'
		)

		this.addWatchFile(filePath)

		const css = await readFile(filePath, 'utf8')
		const result = await postcss([autoprefixer, cssnano]).process(css, {
			from: filePath,
		})

		return `export default ${JSON.stringify(result.css)}`
	},
})

const buildLibrary = async ({
	entry,
	fileName,
	formats,
	minify = false,
	name,
	outDir,
	emptyOutDir = false,
}) =>
	build({
		configFile: false,
		publicDir: false,
		plugins: [inlineCssStringPlugin()],
		build: {
			emptyOutDir,
			lib: {
				entry,
				fileName,
				formats,
				name,
			},
			minify,
			outDir,
			rollupOptions: {
				output: {
					banner,
				},
			},
			sourcemap: false,
		},
	})

const clean = async () => {
	await Promise.all([
		rm(paths.dist, { force: true, recursive: true }),
		rm(paths.distLegacy, { force: true, recursive: true }),
	])
}

const copyArtifacts = async () => {
	await mkdir(paths.publicAssets, { recursive: true })
	await copyFile(
		resolve(root, 'src/pages/scrollerful/demo.mp4'),
		resolve(paths.publicAssets, 'demo.mp4')
	)
	await execFileAsync('magick', [
		resolve(root, 'src/pages/scrollerful/share.avif'),
		'-quality',
		'90',
		resolve(paths.publicAssets, 'share.avif.jpg'),
	])
	await execFileAsync('magick', [
		resolve(root, 'src/pages/scrollerful/share.avif'),
		resolve(paths.publicAssets, 'share.avif.webp'),
	])
}

const ensureBanner = async filePath => {
	const file = await readFile(filePath, 'utf8')
	if (file.startsWith(banner)) return

	await writeFile(filePath, `${banner}\n${file}`)
}

const main = async () => {
	await clean()

	await buildLibrary({
		entry: resolve(root, 'src/lib/scrollerful.ts'),
		fileName: format =>
			format === 'es' ? 'scrollerful.mjs' : 'scrollerful.cjs',
		formats: ['es', 'cjs'],
		emptyOutDir: true,
		outDir: paths.dist,
	})

	await buildLibrary({
		entry: resolve(root, 'src/lib/scrollerful.ts'),
		fileName: format =>
			format === 'es' ? 'scrollerful.min.mjs' : 'scrollerful.min.js',
		formats: ['es', 'cjs'],
		minify: true,
		outDir: paths.dist,
	})

	await buildLibrary({
		entry: resolve(root, 'src/lib/auto.ts'),
		fileName: () => 'scrollerful-auto.min.js',
		formats: ['umd'],
		minify: true,
		name: 'scrollerful',
		outDir: paths.dist,
	})

	await Promise.all([
		ensureBanner(resolve(paths.dist, 'scrollerful.mjs')),
		ensureBanner(resolve(paths.dist, 'scrollerful.cjs')),
		ensureBanner(resolve(paths.dist, 'scrollerful.min.mjs')),
		ensureBanner(resolve(paths.dist, 'scrollerful.min.js')),
		ensureBanner(resolve(paths.dist, 'scrollerful-auto.min.js')),
	])

	await copyArtifacts()
}

main().catch(error => {
	console.error(error)
	process.exitCode = 1
})
