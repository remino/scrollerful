export type ProgressBounds = {
	containerStart: number
	containerSize: number
	viewSize: number
}

export const calcContainerEnd = (
	containerStart: number,
	containerSize: number
): number => containerStart + containerSize

export const calcContainProgress = (
	containerStart: number,
	containerSize: number,
	viewSize: number
): number => {
	if (containerSize === viewSize) {
		const progress = ((containerStart - viewSize) / viewSize) * -1

		switch (true) {
			case containerStart < 0:
				return progress
			case containerStart > 0:
				return progress - 1
			default:
				return 0.5
		}
	}

	const progress = (containerStart / (containerSize - viewSize)) * -1

	switch (true) {
		case containerSize < viewSize:
			return 1 - progress
		default:
			return progress
	}
}

export const calcCoverProgress = (
	containerStart: number,
	containerSize: number,
	viewSize: number
): number => ((containerStart - viewSize) / (viewSize + containerSize)) * -1
