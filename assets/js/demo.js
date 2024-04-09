const showProgress = (target, progress) => {
	// eslint-disable-next-line no-param-reassign
	target.querySelector('output').textContent = Math.max(0, Math.min(100, Math.round(progress * 100)))
}

const showContainProgress = ({ target, detail: { progress: { contain: progress } } }) => {
	showProgress(target, progress)
}

const showCoverProgress = ({ target, detail: { progress: { cover: progress } } }) => {
	showProgress(target, progress)
}

const main = () => {
	const eventFunc = document.body.classList.contains('demo--contain')
		? showContainProgress : showCoverProgress

	Array.from(document.querySelectorAll('.sclf')).forEach(el => {
		if (!el.querySelector('output')) return
		el.addEventListener('sclf:scroll', eventFunc)
	})
}

(function init() {
	if (document.readyState === 'interactive') {
		main()
	} else {
		document.addEventListener('DOMContentLoaded', main)
	}
}())
