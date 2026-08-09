// eslint-disable-next-line import/no-unresolved
import style from './scrollerful.css?inline'
import { calcContainProgress, calcCoverProgress } from './calc'

const PREFIX = 'sclf'

const CSS_CLASS_ENABLED = `${PREFIX}--enabled`
const CSS_CLASS_HORIZONTAL = `${PREFIX}--x`
const CSS_CLASS_INSIDE_CONTAIN = `${PREFIX}--inside--contain`
const CSS_CLASS_INSIDE_COVER = `${PREFIX}--inside--cover`
const CSS_CLASS_RULER = `${PREFIX}__ruler`
const CSS_PROP_PROGRESS_CONTAIN = `--${PREFIX}-contain`
const CSS_PROP_PROGRESS_COVER = `--${PREFIX}-cover`
const EVENT_CONTAIN_ENTER = `${PREFIX}:contain:enter`
const EVENT_CONTAIN_EXIT = `${PREFIX}:contain:exit`
const EVENT_COVER_ENTER = `${PREFIX}:cover:enter`
const EVENT_COVER_EXIT = `${PREFIX}:cover:exit`
const EVENT_SCROLL = `${PREFIX}:scroll`
const SEL_SCROLL = `.${PREFIX}`
const SEL_TRAY = `.${PREFIX}`
const EL_ID_RULER = `${PREFIX}_ruler`
const EL_ID_STYLE = `${PREFIX}_style`

type AxisCoords = {
	size: number
	start: number
}

type ContainerCoords = {
	containerStart: number
	containerSize: number
	viewSize: number
}

type ScrollProgress = {
	contain: number
	cover: number
}

type ScrollEventDetail = {
	progress: ScrollProgress
}

let requestId

const getElScrollSize = (el: HTMLElement, horizontal = false): number =>
	horizontal ? el.scrollWidth : el.scrollHeight
const isDocumentScroller = (el: HTMLElement): boolean =>
	el === document.body || el === document.documentElement
const getDocumentScrollSize = (horizontal = false): number =>
	Math.max(
		getElScrollSize(document.body, horizontal),
		getElScrollSize(document.documentElement, horizontal)
	)
const getStyleEl = (): HTMLStyleElement | null =>
	document.getElementById(EL_ID_STYLE) as HTMLStyleElement | null
const hasBundledStyle = (): boolean =>
	Boolean(document.querySelector('meta[name="scrollerful-css"]'))
const getViewportRect = (): DOMRect =>
	document.getElementById(EL_ID_RULER).getBoundingClientRect()
const getViewportSize = (horizontal: boolean): number =>
	getViewportRect()[horizontal ? 'width' : 'height']
const showsOverflow = (el: HTMLElement, horizontal: boolean): boolean =>
	['auto', 'scroll'].includes(
		getComputedStyle(el).getPropertyValue(`overflow-${horizontal ? 'x' : 'y'}`)
	)
const sortNums = (...nums: number[]): number[] => nums.sort((a, b) => a - b)

const isWithin = (num: number, a: number, b: number): boolean => {
	const [min, max] = sortNums(a, b)
	return num >= min && num <= max
}

const addEnabledClass = (): void => {
	document.documentElement.classList.add(CSS_CLASS_ENABLED)
}

const addRuler = (): void => {
	if (document.getElementById(EL_ID_RULER)) return

	const ruler = document.createElement('div')

	ruler.setAttribute('id', EL_ID_RULER)
	ruler.classList.add(CSS_CLASS_RULER)
	document.body.appendChild(ruler)
}

const addStyle = (): void => {
	if (getStyleEl() || hasBundledStyle()) return

	const styleEl = document.createElement('style')
	styleEl.setAttribute('id', EL_ID_STYLE)
	styleEl.textContent = style

	if (!document.head.firstChild) {
		document.head.appendChild(styleEl)
		return
	}

	document.head.insertBefore(styleEl, document.head.firstChild)
}

const getElAxisCoords = (el: HTMLElement, horizontal = false): AxisCoords => {
	if (horizontal) {
		const { left, width } = el.getBoundingClientRect()
		return { size: width, start: left }
	}

	const { height, top } = el.getBoundingClientRect()
	return { size: height, start: top }
}

const getContainerCoords = (
	el: HTMLElement,
	horizontal: boolean
): ContainerCoords => {
	const { size, start } = getElAxisCoords(el, horizontal)
	const overflow = showsOverflow(el, horizontal)
	const documentScroller = isDocumentScroller(el)
	let containerSize = size

	if (documentScroller) {
		containerSize = getDocumentScrollSize(horizontal)
	} else if (overflow) {
		containerSize = getElScrollSize(el, horizontal)
	}

	return {
		containerStart: start,
		containerSize,
		viewSize: overflow ? size : getViewportSize(horizontal),
	}
}

const sectionProgress = (
	el: HTMLElement,
	horizontal: boolean
): ScrollProgress => {
	const { containerStart, containerSize, viewSize } = getContainerCoords(
		el,
		horizontal
	)

	return {
		contain: calcContainProgress(containerStart, containerSize, viewSize),
		cover: calcCoverProgress(containerStart, containerSize, viewSize),
	}
}

const processSection = (el: HTMLElement, horizontal: boolean): void => {
	const progress = sectionProgress(el, horizontal)

	el.dispatchEvent(
		new CustomEvent(EVENT_SCROLL, {
			detail: { progress },
			bubbles: true,
			cancelable: true,
			composed: false,
		})
	)
}

const removeStyleProperties = (el: HTMLElement, ...names: string[]): void => {
	names.forEach(name => el.style.removeProperty(name))
}

const setStyleVars = (event: Event): void => {
	const { target, detail } = event as CustomEvent<ScrollEventDetail> & {
		target: HTMLElement | null
	}

	if (!target) return

	const {
		progress: { contain, cover },
	} = detail

	if (!isWithin(cover, 0, 1)) {
		removeStyleProperties(
			target,
			CSS_PROP_PROGRESS_CONTAIN,
			CSS_PROP_PROGRESS_COVER
		)
		return
	}

	target.style.setProperty(CSS_PROP_PROGRESS_CONTAIN, String(contain))
	target.style.setProperty(CSS_PROP_PROGRESS_COVER, String(cover))
}

const triggerEnterExit = (
	target: HTMLElement,
	progress: number,
	eventEnter: string,
	eventExit: string,
	className: string
): void => {
	if (!isWithin(progress, 0, 1)) {
		if (target.classList.contains(className)) {
			target.classList.remove(className)

			target.dispatchEvent(
				new CustomEvent(eventExit, {
					bubbles: true,
					cancelable: true,
					composed: false,
				})
			)
		}
	} else if (!target.classList.contains(className)) {
		target.classList.add(className)

		target.dispatchEvent(
			new CustomEvent(eventEnter, {
				bubbles: true,
				cancelable: true,
				composed: false,
			})
		)
	}
}

const triggerContainEnterExit = (event: Event): void => {
	const { target, detail } = event as CustomEvent<ScrollEventDetail> & {
		target: HTMLElement | null
	}

	if (!target) return

	const {
		progress: { contain },
	} = detail

	triggerEnterExit(
		target,
		contain,
		EVENT_CONTAIN_ENTER,
		EVENT_CONTAIN_EXIT,
		CSS_CLASS_INSIDE_CONTAIN
	)
}

const triggerCoverEnterExit = (event: Event): void => {
	const { target, detail } = event as CustomEvent<ScrollEventDetail> & {
		target: HTMLElement | null
	}

	if (!target) return

	const {
		progress: { cover },
	} = detail

	triggerEnterExit(
		target,
		cover,
		EVENT_COVER_ENTER,
		EVENT_COVER_EXIT,
		CSS_CLASS_INSIDE_COVER
	)
}

const scrollFrame = (target: HTMLElement): void => {
	const horizontal = target.classList.contains(CSS_CLASS_HORIZONTAL)

	Promise.all(
		[target, ...Array.from(target.querySelectorAll<HTMLElement>(SEL_TRAY))].map(
			el => processSection(el, horizontal)
		)
	)
}

const scroll = (target: HTMLElement): void => {
	if (requestId) cancelAnimationFrame(requestId)

	requestId = requestAnimationFrame(() => {
		scrollFrame(target)
		requestId = null
	})
}

const addScrollListeners = (scrollEl: HTMLElement): void => {
	;[
		scrollEl,
		...Array.from(scrollEl.querySelectorAll<HTMLElement>(SEL_TRAY)),
	].forEach(el => {
		el.addEventListener(EVENT_SCROLL, setStyleVars)
		el.addEventListener(EVENT_SCROLL, triggerCoverEnterExit)
		el.addEventListener(EVENT_SCROLL, triggerContainEnterExit)
	})
}

const scrollerful = (): void => {
	addStyle()
	addRuler()

	Array.from(document.querySelectorAll<HTMLElement>(SEL_SCROLL)).forEach(
		target => {
			target.addEventListener('resize', () => scroll(target))
			target.addEventListener('scroll', () => scroll(target))
			addScrollListeners(target)
			scroll(target)
		}
	)

	window.addEventListener('resize', () => scroll(document.body))
	window.addEventListener('scroll', () => scroll(document.body))
	addScrollListeners(document.body)
	scroll(document.body)

	addEnabledClass()
}

export default scrollerful
