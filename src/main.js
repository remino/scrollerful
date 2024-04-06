import style from './scrollerful.sass'
import { calcInnerProgress, calcOuterProgress } from './calc.js'

const PREFIX = 'sclf'

const CSS_CLASS_ENABLED = `${PREFIX}--enabled`
const CSS_CLASS_HORIZONTAL = `${PREFIX}--x`
const CSS_CLASS_INSIDE_INNER = `${PREFIX}--inside--inner`
const CSS_CLASS_INSIDE_OUTER = `${PREFIX}--inside--outer`
const CSS_CLASS_RULER = `${PREFIX}__ruler`
const CSS_PROP_PROGRESS_INNER = `--${PREFIX}-progress-inner`
const CSS_PROP_PROGRESS_OUTER = `--${PREFIX}-progress-outer`
const EVENT_INNER_ENTER = `${PREFIX}:inner:enter`
const EVENT_INNER_EXIT = `${PREFIX}:inner:exit`
const EVENT_OUTER_ENTER = `${PREFIX}:outer:enter`
const EVENT_OUTER_EXIT = `${PREFIX}:outer:exit`
const EVENT_SCROLL = `${PREFIX}:scroll`
const SEL_SCROLL = `.${PREFIX}`
const SEL_TRAY = `.${PREFIX}`
// TODO Predict internia to smoothen animations
// const SMOOTHING_FACTOR = 50
const EL_ID_RULER = `${PREFIX}_ruler`
const EL_ID_STYLE = `${PREFIX}_style`

let requestId

const getElScrollSize = (el, horizontal = false) => (horizontal ? el.scrollWidth : el.scrollHeight)
const getStyleEl = () => document.getElementById(EL_ID_STYLE)
const getViewportRect = () => document.getElementById(EL_ID_RULER).getBoundingClientRect()
const getViewportSize = horizontal => getViewportRect()[horizontal ? 'width' : 'height']
const showsOverflow = (el, horizontal) => ['auto', 'scroll']
	.includes(getComputedStyle(el).getPropertyValue(`overflow-${horizontal ? 'x' : 'y'}`))
const sortNums = (...nums) => nums.sort((a, b) => a - b)

const isWithin = (num, a, b) => {
	const [min, max] = sortNums(a, b)
	return num >= min && num <= max
}

const addEnabledClass = () => {
	document.documentElement.classList.add(CSS_CLASS_ENABLED)
}

const addRuler = () => {
	const ruler = document.createElement('div')
	ruler.setAttribute('id', EL_ID_RULER)
	ruler.classList.add(CSS_CLASS_RULER)
	document.body.appendChild(ruler)
}

const addStyle = () => {
	if (getStyleEl()) return

	const styleEl = document.createElement('style')
	styleEl.setAttribute('id', EL_ID_STYLE)
	styleEl.textContent = style

	if (!document.head.firstChild) {
		document.head.appendChild(styleEl)
		return
	}

	document.head.insertBefore(styleEl, document.head.firstChild)
}

const getElAxisCoords = (el, horizontal = false) => {
	if (horizontal) {
		const { left, width } = el.getBoundingClientRect()
		return { size: width, start: left }
	}

	const { height, top } = el.getBoundingClientRect()
	return { size: height, start: top }
}

const getContainerCoords = (el, horizontal) => {
	const { size, start } = getElAxisCoords(el, horizontal)
	const overflow = showsOverflow(el, horizontal)

	return {
		containerStart: start,
		containerSize: overflow ? getElScrollSize(el, horizontal) : size,
		viewSize: overflow ? size : getViewportSize(horizontal),
	}
}

const sectionProgress = (el, horizontal) => {
	const { containerStart, containerSize, viewSize } = getContainerCoords(el, horizontal)

	return {
		inner: calcInnerProgress(containerStart, containerSize, viewSize),
		outer: calcOuterProgress(containerStart, containerSize, viewSize),
	}
}

const processSection = async (el, horizontal) => {
	const progress = sectionProgress(el, horizontal)

	el.dispatchEvent(
		new CustomEvent(EVENT_SCROLL, {
			detail: { progress },
			bubbles: true,
			cancelable: true,
			composed: false,
		}),
	)
}

const removeStyleProperties = (el, ...names) => {
	names.forEach(name => el.style.removeProperty(name))
}

const setStyleVars = ({
	target,
	detail: {
		progress: { inner, outer },
	},
}) => {
	if (!isWithin(outer, 0, 1)) {
		removeStyleProperties(
			target,
			CSS_PROP_PROGRESS_INNER,
			CSS_PROP_PROGRESS_OUTER,
		)
		return
	}

	target.style.setProperty(CSS_PROP_PROGRESS_INNER, inner)
	target.style.setProperty(CSS_PROP_PROGRESS_OUTER, outer)
}

const triggerEnterExit = (target, progress, eventEnter, eventExit, className) => {
	if (!isWithin(progress, 0, 1)) {
		if (target.classList.contains(className)) {
			target.classList.remove(className)

			target.dispatchEvent(
				new CustomEvent(eventExit, {
					bubbles: true,
					cancelable: true,
					composed: false,
				}),
			)
		}
	} else if (!target.classList.contains(className)) {
		target.classList.add(className)

		target.dispatchEvent(
			new CustomEvent(eventEnter, {
				bubbles: true,
				cancelable: true,
				composed: false,
			}),
		)
	}
}

const triggerInnerEnterExit = ({ target, detail: { progress: { inner } } }) => {
	triggerEnterExit(target, inner, EVENT_INNER_ENTER, EVENT_INNER_EXIT, CSS_CLASS_INSIDE_INNER)
}

const triggerOuterEnterExit = ({ target, detail: { progress: { outer } } }) => {
	triggerEnterExit(target, outer, EVENT_OUTER_ENTER, EVENT_OUTER_EXIT, CSS_CLASS_INSIDE_OUTER)
}

const scrollFrame = async target => {
	const horizontal = target.classList.contains(CSS_CLASS_HORIZONTAL)

	Promise.all([
		target,
		...target.querySelectorAll(SEL_TRAY),
	].map(el => processSection(el, horizontal)))
}

const scroll = ({ target }) => {
	if (requestId) cancelAnimationFrame(requestId)

	requestId = requestAnimationFrame(() => {
		scrollFrame(target)
		requestId = null
	})
}

const addScrollListeners = scrollEl => {
	[scrollEl, ...scrollEl.querySelectorAll(SEL_TRAY)].forEach(el => {
		el.addEventListener(EVENT_SCROLL, setStyleVars)
		el.addEventListener(EVENT_SCROLL, triggerOuterEnterExit)
		el.addEventListener(EVENT_SCROLL, triggerInnerEnterExit)
	})
}

const scrollerful = () => {
	addStyle()
	addRuler()

	Array.from(document.querySelectorAll(SEL_SCROLL)).forEach(target => {
		target.addEventListener('resize', scroll)
		target.addEventListener('scroll', scroll)
		addScrollListeners(target)
		scroll({ target })
	})

	window.addEventListener('resize', () => scroll({ target: document.body }))
	window.addEventListener('scroll', () => scroll({ target: document.body }))
	addScrollListeners(document.body)
	scroll({ target: document.body })

	addEnabledClass()
}

export default scrollerful
