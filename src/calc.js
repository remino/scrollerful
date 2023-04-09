export const calcContainerEnd = (containerStart, containerSize) => containerStart + containerSize

export const calcInnerProgress = (containerStart, containerSize, viewSize) => {
	if (containerSize === viewSize) {
		const progress = (((containerStart - viewSize) / (viewSize)) * -1)

		switch (true) {
			case containerStart < 0: return progress
			case containerStart > 0: return progress - 1
			default: return 0.5
		}
	}

	const progress = (((containerStart) / (containerSize - viewSize)) * -1)

	switch (true) {
		case containerSize < viewSize: return 1 - progress
		default: return progress
	}
}

export const calcOuterProgress = (containerStart, containerSize, viewSize) => (
	((containerStart - viewSize) / (viewSize + containerSize)) * -1
)
