import initDemo from './demo'
import scrollerful from '../../lib/scrollerful'

const init = () => {
	initDemo()
	scrollerful()
	requestAnimationFrame(() =>
		document.documentElement.classList.add('sclf--ready')
	)
}

if (document.readyState === 'interactive') {
	init()
} else {
	document.addEventListener('DOMContentLoaded', init)
}
