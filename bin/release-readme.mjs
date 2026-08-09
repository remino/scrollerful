import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const readmePath = resolve(root, 'README.md')

const versionLinePattern = /^Scrollerful v\d+\.\d+\.\d+(?:[-+\w.]+)?$/m
const pinnedPackagePattern =
	/https:\/\/unpkg\.com\/scrollerful@\d+\.\d+\.\d+(?:[-+\w.]+)?/g

export const updateReadmeVersion = (readme, version) => {
	const versionLine = `Scrollerful v${version}`
	let next = readme

	if (versionLinePattern.test(next)) {
		next = next.replace(versionLinePattern, versionLine)
	} else {
		const marker = '\nBy Rémino Rem'

		if (!next.includes(marker)) {
			throw new Error('README author marker was not found.')
		}

		next = next.replace(marker, `\n${versionLine}\n${marker}`)
	}

	let pinnedUrlCount = 0

	next = next.replace(pinnedPackagePattern, match => {
		pinnedUrlCount += 1
		return match.replace(/@\d+\.\d+\.\d+(?:[-+\w.]+)?$/, `@${version}`)
	})

	if (pinnedUrlCount !== 1) {
		throw new Error(
			`Expected to update 1 pinned README CDN URL, updated ${pinnedUrlCount}.`
		)
	}

	return next
}

const run = async ([command, version]) => {
	if (command !== 'update' || !version) {
		throw new Error('Usage: release-readme.mjs update <version>')
	}

	const readme = await readFile(readmePath, 'utf8')
	await writeFile(readmePath, updateReadmeVersion(readme, version))
}

if (import.meta.url === `file://${process.argv[1]}`) {
	run(process.argv.slice(2)).catch(error => {
		console.error(error.message)
		process.exitCode = 1
	})
}
