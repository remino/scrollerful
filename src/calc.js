export const calcInnerProgress = (containerStart, containerSize, viewSize) => (
	containerStart / -(containerSize - viewSize)
)

export const calcOuterProgress = (containerStart, containerSize, viewSize) => (
	(containerStart - viewSize) / -(containerSize + viewSize)
)
