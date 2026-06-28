import scrollerful from './scrollerful'

const init = () => {
	if (document.readyState === 'interactive') {
		scrollerful()
	} else {
		document.addEventListener('DOMContentLoaded', scrollerful)
	}
}

init()
