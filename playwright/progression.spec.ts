import { expect, test } from '@playwright/test'

const axes = ['vertical', 'horizontal'] as const
const sizes = [300, 100, 50] as const

const expectedProgress = (size: number, start: number, viewport: number) => {
	let contain: number

	if (size === viewport) {
		if (start < 0) contain = -(start / viewport) + 1
		else if (start > 0) contain = -(start / viewport) - 1
		else contain = 0.5
	} else if (size < viewport) contain = 1 + start / (size - viewport)
	else contain = -start / (size - viewport)

	return {
		contain,
		cover: -(start - viewport) / (viewport + size),
	}
}

axes
	.flatMap(axis => sizes.map(size => ({ axis, size })))
	.forEach(({ axis, size }) => {
		test(`${axis} ${size}% container progresses contain and cover sprites`, async ({
			page,
		}) => {
			await page.goto(
				`/playwright/fixtures/progression.html?axis=${axis}&size=${size}`
			)

			const values = await page.evaluate(
				async ({ testAxis }) => {
					const scroller = document.getElementById('scroller') as HTMLElement
					const section = document.getElementById('section') as HTMLElement
					const containSprite = document.getElementById(
						'contain-sprite'
					) as HTMLElement
					const coverSprite = document.getElementById(
						'cover-sprite'
					) as HTMLElement
					const horizontal = testAxis === 'horizontal'
					const viewport = horizontal
						? scroller.clientWidth
						: scroller.clientHeight
					const initialRect = section.getBoundingClientRect()
					const sectionSize = horizontal
						? initialRect.width
						: initialRect.height
					const scrollOffset = viewport + (sectionSize - viewport) / 2

					if (horizontal) scroller.scrollLeft = scrollOffset
					else scroller.scrollTop = scrollOffset

					await new Promise<void>(resolve => {
						requestAnimationFrame(() => {
							requestAnimationFrame(() => resolve())
						})
					})

					const rect = section.getBoundingClientRect()
					const start = horizontal ? rect.left : rect.top
					const read = (element: HTMLElement) => {
						const style = getComputedStyle(element)
						return {
							contain: Number(style.getPropertyValue('--sclf-contain')),
							cover: Number(style.getPropertyValue('--sclf-cover')),
							opacity: Number(style.opacity),
						}
					}

					return {
						start,
						sectionSize,
						viewport,
						containSprite: read(containSprite),
						coverSprite: read(coverSprite),
					}
				},
				{ testAxis: axis }
			)

			const expected = expectedProgress(
				values.sectionSize,
				values.start,
				values.viewport
			)

			expect(values.containSprite.contain).toBeCloseTo(expected.contain)
			expect(values.containSprite.cover).toBeCloseTo(expected.cover)
			expect(values.coverSprite.contain).toBeCloseTo(expected.contain)
			expect(values.coverSprite.cover).toBeCloseTo(expected.cover)
			expect(values.containSprite.opacity).toBeCloseTo(expected.contain, 2)
			expect(values.coverSprite.opacity).toBeCloseTo(expected.cover, 2)
		})
	})
