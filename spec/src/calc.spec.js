import { calcInnerProgress, calcOuterProgress } from '../../src/calc.js'

describe('src/calc.js', () => {
	describe('calcInnerProgress()', () => {
		const cases = [
			// testNumber, containerStart, containerSize, viewSize, expected

			// Container taller than viewport
			['1.01', 100, 200, 100, -1],
			['1.02', 0, 200, 100, 0],
			['1.03', -50, 200, 100, 0.5],
			['1.04', -100, 200, 100, 1],
			['1.05', -200, 200, 100, 2],

			// Container shorter than viewport
			['1.06', 100, 50, 100, -1],
			['1.07', 50, 50, 100, 0],
			['1.08', 25, 50, 100, 0.5],
			['1.09', 0, 50, 100, 1],
			['1.10', -50, 50, 100, 2],

			// Container of same height than viewport
			['1.11', 100, 100, 100, -1],
			['1.12', 50, 100, 100, -0.5],
			['1.13', 0, 100, 100, 0.5],
			['1.14', -50, 100, 100, 1.5],
			['1.15', -100, 100, 100, 2],
		]

		cases.forEach(([
			testNumber, containerStart, containerSize, viewSize, expected,
		]) => {
			it(`(${testNumber}) returns inner progress of ${expected} for containerStart ${containerStart}, containerSize ${containerSize}, and viewSize ${viewSize}`, () => {
				expect(calcInnerProgress(containerStart, containerSize, viewSize)).toBe(expected)
			})
		})
	})

	describe('calcOuterProgress()', () => {
		const cases = [
			// testNumber, containerStart, containerSize, viewSize, expected

			// Container taller than viewport
			['2.01', 100, 200, 100, 0],
			['2.02', 0, 200, 100, 1 / 3],
			['2.03', -50, 200, 100, 0.5],
			['2.04', -100, 200, 100, 2 / 3],
			['2.05', -200, 200, 100, 1],

			// Container shorter than viewport
			['2.06', 100, 50, 100, 0],
			['2.07', 50, 50, 100, 1 / 3],
			['2.08', 25, 50, 100, 0.5],
			['2.09', 0, 50, 100, 2 / 3],
			['2.10', -50, 50, 100, 1],

			// Container of same height than viewport
			['2.11', 100, 100, 100, 0],
			['2.12', 50, 100, 100, 0.25],
			['2.13', 0, 100, 100, 0.5],
			['2.14', -50, 100, 100, 0.75],
			['2.15', -100, 100, 100, 1],
		]

		cases.forEach(([
			testNumber, containerStart, containerSize, viewSize, expected,
		]) => {
			it(`(${testNumber}) returns outer progress of ${expected} for containerStart ${containerStart}, containerSize ${containerSize}, and viewSize ${viewSize}`, () => {
				expect(calcOuterProgress(containerStart, containerSize, viewSize)).toBe(expected)
			})
		})
	})
})
