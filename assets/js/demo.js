const showProgress = (target, progress) => {
	// eslint-disable-next-line no-param-reassign
	target.querySelector('output').textContent = Math.max(0, Math.min(100, Math.round(progress * 100)))
}

const showInnerProgress = ({ target, detail: { progress: { inner: progress } } }) => {
	showProgress(target, progress)
}

const showOuterProgress = ({ target, detail: { progress: { outer: progress } } }) => {
	showProgress(target, progress)
}

const main = () => {
	const eventFunc = document.body.classList.contains('demo--inner')
		? showInnerProgress : showOuterProgress

	Array.from(document.querySelectorAll('.scrollerful__tray')).forEach(el => {
		if (!el.querySelector('output')) return
		el.addEventListener('scrollerfulscroll', eventFunc)
	})
}

(function init() {
	if (document.readyState === 'interactive') {
		main()
	} else {
		document.addEventListener('DOMContentLoaded', main)
	}
}())
