import {
	extractReleaseNotes,
	promoteHead,
} from '../../bin/release-changelog.mjs'

describe('bin/release-changelog.mjs', () => {
	const changelog = `# CHANGELOG

<!-- mtoc-start -->

- [HEAD](#head)
- [v1.2.1](#v121)

<!-- mtoc-end -->

## HEAD

- Fixed
    - Keep horizontal document scroll progress accurate.

## v1.2.1

- Previous release.
`

	it('promotes HEAD notes under the requested version', () => {
		const next = promoteHead(changelog, '1.2.2')

		expect(next).toContain('- [v1.2.2](#v122)\n- [v1.2.1](#v121)')
		expect(next).toContain(`## HEAD

## v1.2.2

- Fixed
    - Keep horizontal document scroll progress accurate.

## v1.2.1`)
	})

	it('extracts release notes for a version', () => {
		const next = promoteHead(changelog, '1.2.2')

		expect(extractReleaseNotes(next, '1.2.2')).toBe(`- Fixed
    - Keep horizontal document scroll progress accurate.
`)
	})

	it('fails when HEAD has no release notes', () => {
		const emptyHead = changelog.replace(
			'- Fixed\n    - Keep horizontal document scroll progress accurate.\n',
			''
		)

		expect(() => promoteHead(emptyHead, '1.2.2')).toThrowError(
			'HEAD changelog section is empty.'
		)
	})
})
