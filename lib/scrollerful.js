import style from './scrollerful.sass'

const SCRIPT_NAME = 'scrollerful'

const CSS_CLASS_INSIDE_INNER = `${SCRIPT_NAME}--inside--inner`
const CSS_CLASS_INSIDE_OUTER = `${SCRIPT_NAME}--inside--outer`
const CSS_PROP_PROGRESS_INNER = `--${SCRIPT_NAME}-progress-inner`
const CSS_PROP_PROGRESS_OUTER = `--${SCRIPT_NAME}-progress-outer`
const EVENT_INNER_ENTER = `${SCRIPT_NAME}innerenter`
const EVENT_INNER_EXIT = `${SCRIPT_NAME}innerexit`
const EVENT_OUTER_ENTER = `${SCRIPT_NAME}outerenter`
const EVENT_OUTER_EXIT = `${SCRIPT_NAME}outerexit`
const EVENT_SCROLL = `${SCRIPT_NAME}scroll`
const SEL_SNAP = `.${SCRIPT_NAME}--snap`
const SEL_TRAY = `.${SCRIPT_NAME}__tray`
const STYLE_EL_ID = `${SCRIPT_NAME}_style`

const getStyleEl = () => document.getElementById(STYLE_EL_ID)

const addStyle = () => {
	if (getStyleEl()) return

	const styleEl = document.createElement('style')
	styleEl.setAttribute('id', STYLE_EL_ID)
	styleEl.textContent = style

	document.head.appendChild(styleEl)
}

const getContainerCoords = el => {
	if (['auto', 'scroll'].includes(getComputedStyle(el).getPropertyValue('overflow-y'))) {
		const rect = el.getBoundingClientRect()
		const { top: containerTop, height: viewHeight } = rect
		const { scrollHeight: containerHeight } = el
		return { containerTop, containerHeight, viewHeight }
	}

	const { innerHeight: viewHeight } = window
	const { height: containerHeight, top: containerTop } = el.getBoundingClientRect()
	return { containerTop, containerHeight, viewHeight }
}

const sectionProgress = el => {
	const { containerTop, containerHeight, viewHeight } = getContainerCoords(el)

	return {
		inner: containerTop / -(containerHeight - viewHeight),
		outer: (containerTop - viewHeight) / -(containerHeight + viewHeight),
	}
}

const processSection = el => {
	const progress = sectionProgress(el)

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
	if (outer < 0 || outer > 1) {
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
	if (progress < 0 || progress > 1) {
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

const scroll = ({ target }) => {
	Array.from(target.querySelectorAll(SEL_TRAY)).forEach(el => {
		processSection(el)
	})
}

const addSectionListeners = parent => {
	Array.from(parent.querySelectorAll(SEL_TRAY)).forEach(el => {
		el.addEventListener(EVENT_SCROLL, setStyleVars)
		el.addEventListener(EVENT_SCROLL, triggerOuterEnterExit)
		el.addEventListener(EVENT_SCROLL, triggerInnerEnterExit)
	})
}

const scrollerful = () => {
	addStyle()

	Array.from(document.querySelectorAll(SEL_SNAP)).forEach(target => {
		target.addEventListener('resize', scroll)
		target.addEventListener('scroll', scroll)
		addSectionListeners(target)
		scroll({ target })
	})

	window.addEventListener('resize', scroll)
	window.addEventListener('scroll', scroll)
	addSectionListeners(document)
	scroll({ target: document })
}

export default scrollerful
