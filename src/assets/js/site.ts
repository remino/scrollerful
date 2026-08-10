import initDemo from './site/demo'
import scrollerful from '../../lib/scrollerful'

const showContent = () => {
	document.documentElement.classList.add('content-visible')
}

const fallback = window.setTimeout(showContent, 1000)

const init = () => {
	initDemo()
	scrollerful()
	requestAnimationFrame(() => {
		document.documentElement.classList.add('site--ready')
		showContent()
		window.clearTimeout(fallback)
	})
}

if (document.readyState === 'interactive') {
	init()
} else {
	document.addEventListener('DOMContentLoaded', init)
}
