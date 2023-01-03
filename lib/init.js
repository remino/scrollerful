import scrollerful from './scrollerful.js'

const init = () => {
	if (document.readyState === 'interactive') {
		scrollerful()
	} else {
		document.addEventListener('DOMContentLoaded', scrollerful)
	}
}

init()
