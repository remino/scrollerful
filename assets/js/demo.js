const showInnerProgress = ({ target, detail: { progress: { inner: progress } } }) => {
	// eslint-disable-next-line no-param-reassign
	target.querySelector('output').textContent = Math.max(0, Math.min(100, Math.round(progress * 100)))
}

const main = () => {
	Array.from(document.querySelectorAll('.scrollerful__tray')).forEach(el => {
		if (!el.querySelector('output')) return
		el.addEventListener('scrollerfulscroll', showInnerProgress)
	})
}

(function init() {
	if (document.readyState === 'interactive') {
		main()
	} else {
		document.addEventListener('DOMContentLoaded', main)
	}
}())
