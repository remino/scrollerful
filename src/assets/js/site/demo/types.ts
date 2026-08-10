export type ScrollProgress = {
	contain: number
	cover: number
}

export type ScrollDetail = {
	progress: ScrollProgress
}

export type ScrollEvent = CustomEvent<ScrollDetail> & {
	currentTarget: Element | null
	target: Element | null
}
