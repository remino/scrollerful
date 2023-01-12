import scrollerful from './scrollerful.js'

(function init() {
	if (document.readyState === 'interactive') {
		scrollerful()
	} else {
		document.addEventListener('DOMContentLoaded', scrollerful)
	}
}())
