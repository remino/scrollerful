import { updateReadmeVersion } from '../../bin/release-readme.mjs'

describe('bin/release-readme.mjs', () => {
	const readme = `# Scrollerful

By Rémino Rem

<script src="https://unpkg.com/scrollerful@1.2.1/dist/scrollerful-auto.min.js"></script>
`

	it('adds the visible README version line', () => {
		const next = updateReadmeVersion(readme, '1.2.2')

		expect(next).toContain('Scrollerful v1.2.2\n\nBy Rémino Rem')
	})

	it('updates an existing visible README version line', () => {
		const next = updateReadmeVersion(
			readme.replace('By Rémino Rem', 'Scrollerful v1.2.1\n\nBy Rémino Rem'),
			'1.2.2'
		)

		expect(next).toContain('Scrollerful v1.2.2\n\nBy Rémino Rem')
		expect(next).not.toContain('Scrollerful v1.2.1')
	})

	it('updates pinned CDN examples', () => {
		const next = updateReadmeVersion(readme, '1.2.2')

		expect(next).toContain('https://unpkg.com/scrollerful@1.2.2')
		expect(next).not.toContain('scrollerful@1.2.1')
	})

	it('fails when the expected pinned URL is missing', () => {
		expect(() =>
			updateReadmeVersion(readme.replaceAll('@1.2.1', ''), '1.2.2')
		).toThrowError('Expected to update 1 pinned README CDN URL, updated 0.')
	})
})
