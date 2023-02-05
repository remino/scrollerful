import { calcInnerProgress, calcOuterProgress } from '../../src/calc.js'

describe('src/calc.js', () => {
	describe('calcInnerProgress()', () => {
		const cases = [
			// containerStart, containerSize, viewSize, expected
			[0, 200, 100, 0],
			[-100, 200, 100, 1],
			[-200, 200, 100, 2],
			[-300, 200, 100, 3],
		]

		cases.forEach(([
			containerStart, containerSize, viewSize, expected,
		]) => {
			it(`returns inner progress of ${expected} for containerStart ${containerStart}, containerSize ${containerSize}, and viewSize ${viewSize}`, () => {
				expect(calcInnerProgress(containerStart, containerSize, viewSize)).toBe(expected)
			})
		})
	})

	describe('calcOuterProgress()', () => {
		const cases = [
			// containerStart, containerSize, viewSize, expected
			[100, 200, 100, 0],
			[0, 200, 100, 1 / 3],
			[-100, 200, 100, 2 / 3],
			[-200, 200, 100, 1],
		]

		cases.forEach(([
			containerStart, containerSize, viewSize, expected,
		]) => {
			it(`returns inner progress of ${expected} for containerStart ${containerStart}, containerSize ${containerSize}, and viewSize ${viewSize}`, () => {
				expect(calcOuterProgress(containerStart, containerSize, viewSize)).toBe(expected)
			})
		})
	})
})
