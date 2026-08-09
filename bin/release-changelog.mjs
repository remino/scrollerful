import { readFile, writeFile } from 'node:fs/promises'

const changelogPath = new URL('../CHANGELOG.md', import.meta.url)
const headingPattern = version => `## ${normalizeTag(version)}`

export const normalizeTag = version =>
	version.startsWith('v') ? version : `v${version}`

export const getAnchor = version =>
	`#${normalizeTag(version).replaceAll('.', '')}`

const getSection = (changelog, heading) => {
	const start = changelog.indexOf(`${heading}\n`)
	if (start === -1) return null

	const contentStart = start + heading.length + 1
	const nextHeading = changelog.indexOf('\n## ', contentStart)
	const contentEnd = nextHeading === -1 ? changelog.length : nextHeading

	return {
		content: changelog.slice(contentStart, contentEnd),
		contentEnd,
		contentStart,
		start,
	}
}

export const extractReleaseNotes = (changelog, version) => {
	const section = getSection(changelog, headingPattern(version))
	if (!section) {
		throw new Error(`No changelog section found for ${normalizeTag(version)}.`)
	}

	const notes = section.content.trim()
	if (!notes) {
		throw new Error(`Changelog section for ${normalizeTag(version)} is empty.`)
	}

	return `${notes}\n`
}

export const promoteHead = (changelog, version) => {
	const tag = normalizeTag(version)
	const heading = headingPattern(version)

	if (getSection(changelog, heading)) {
		throw new Error(`Changelog already has a section for ${tag}.`)
	}

	const headSection = getSection(changelog, '## HEAD')
	if (!headSection) {
		throw new Error('No HEAD changelog section found.')
	}

	const headNotes = headSection.content.trim()
	if (!headNotes) {
		throw new Error('HEAD changelog section is empty.')
	}

	if (!changelog.slice(headSection.contentEnd).startsWith('\n## v')) {
		throw new Error('No existing version section found after HEAD.')
	}

	let next = `${changelog.slice(0, headSection.contentStart)}\n${heading}\n\n${headNotes}\n${changelog.slice(headSection.contentEnd)}`

	const tocEntry = `- [${tag}](${getAnchor(version)})`
	if (!next.includes(`${tocEntry}\n`)) {
		next = next.replace('- [HEAD](#head)\n', `- [HEAD](#head)\n${tocEntry}\n`)
	}

	return next
}

const run = async ([command, version]) => {
	if (!command || !version) {
		throw new Error('Usage: release-changelog.mjs <promote|notes> <version>')
	}

	const changelog = await readFile(changelogPath, 'utf8')

	if (command === 'promote') {
		await writeFile(changelogPath, promoteHead(changelog, version))
		return
	}

	if (command === 'notes') {
		process.stdout.write(extractReleaseNotes(changelog, version))
		return
	}

	throw new Error(`Unknown changelog command: ${command}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
	run(process.argv.slice(2)).catch(error => {
		console.error(error.message)
		process.exitCode = 1
	})
}
