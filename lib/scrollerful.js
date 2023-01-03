import style from './scrollerful.sass'

const STYLE_EL_ID = 'scrollerful_style'

const animatedElements = parent => Array.from(parent.querySelectorAll('.scrollerful__animated'))
const minMax = (min, val, max) => Math.max(min, Math.min(max, val))

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
		new CustomEvent('scrollerfulscroll', {
			detail: { progress },
			bubbles: true,
			cancelable: true,
			composed: false,
		})
	)
}

const removeStyleProperties = (el, ...names) => {
	names.forEach(name => el.style.removeProperty(name))
}

const floatToIntegerPercentage = float => Math.round(float * 100)

const setStyleVars = ({
	target,
	detail: {
		progress: { inner, outer },
	},
}) => {
	if (outer < 0 || outer > 1) {
		removeStyleProperties(target, '--scrollerful-progress-inner', '--scrollerful-progress-outer')
		return
	}

	target.style.setProperty('--scrollerful-progress-inner', inner)
	target.style.setProperty('--scrollerful-progress-outer', outer)
}

const setContent = ({
	target,
	detail: {
		progress: { inner },
	},
}) => {
	animatedElements(target).forEach(animated => {
		const output = animated.querySelector('output')
		if (!output) return
		const percentage = minMax(0, floatToIntegerPercentage(inner), 100)
		output.innerText = `${percentage}%`
	})
}

const scroll = event => {
	Array.from(event.target.querySelectorAll('.scrollerful__section')).forEach(el => {
		el.addEventListener('scrollerfulscroll', setStyleVars)
		el.addEventListener('scrollerfulscroll', setContent)
		processSection(el)
	})
}

const init = () => {
	Array.from(document.querySelectorAll('.scrollerful--snap')).forEach(target => {
		target.addEventListener('resize', scroll)
		target.addEventListener('scroll', scroll)
		scroll({ target })
	})

	window.addEventListener('resize', scroll)
	window.addEventListener('scroll', scroll)
	scroll({ target: document })

	addStyle()
}

export default init
