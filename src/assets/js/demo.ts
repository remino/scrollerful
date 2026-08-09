import { addCopyButtons } from '@remino/functions'

let seeking = false
const controlsOpenKey = 'scrollerful-demo-controls-open'

type ScrollProgress = {
	contain: number
	cover: number
}

type ScrollDetail = {
	progress: ScrollProgress
}

type ScrollEvent = CustomEvent<ScrollDetail> & {
	currentTarget: Element | null
	target: Element | null
}

const clamp = (min, value, max) => Math.max(min, Math.min(max, value))
const isContain = () => document.body.classList.contains('demo--contain')

const showProgress = (target, progress) => {
	const output = target.querySelector('.item--percentage output')
	if (!output) return

	output.textContent = String(
		Math.max(0, Math.min(100, Math.round(progress * 100)))
	)
}

const updatePercentage = (event: Event) => {
	const { target, detail } = event as ScrollEvent

	if (!target) return

	const {
		progress: { contain, cover },
	} = detail

	showProgress(target, isContain() ? contain : cover)
}

const changedDirection = value => {
	document.body.classList.remove(
		'demo--horizontal',
		'demo--vertical',
		'sclf--x'
	)
	document.body.classList.add(`demo--${value}`)
	if (value === 'horizontal') document.body.classList.add('sclf--x')
}

const changedScope = value => {
	document.body.classList.remove('demo--contain', 'demo--cover')
	document.body.classList.add(`demo--${value}`)

	if (value === 'contain') {
		document.querySelectorAll('.sclf__sprite').forEach(el => {
			el.classList.remove('sclf__sprite')
			el.classList.add('sclf__sprite--contain')
		})
	} else {
		document.querySelectorAll('.sclf__sprite--contain').forEach(el => {
			el.classList.remove('sclf__sprite--contain')
			el.classList.add('sclf__sprite')
		})
	}
}

const changedSize = value => {
	document.body.classList.remove('demo--small', 'demo--medium', 'demo--large')
	document.body.classList.add(`demo--${value}`)
}

const radioChanged = ({ currentTarget }) => {
	switch (currentTarget.name) {
		case 'direction':
			changedDirection(currentTarget.value)
			break
		case 'scope':
			changedScope(currentTarget.value)
			break
		case 'size':
			changedSize(currentTarget.value)
			break
		default:
			break
	}
}

const loadDemoTemplates = () => {
	let controls: Element | null = null

	document.querySelectorAll('template.js-template').forEach(template => {
		if (!(template instanceof HTMLTemplateElement)) return

		const content = template.content.cloneNode(true) as DocumentFragment
		controls ??= content.querySelector('.controls')
		template.replaceWith(content)
	})

	return controls
}

const setupControls = element => {
	if (!(element instanceof HTMLDetailsElement)) return null
	const controls = element

	try {
		controls.open = localStorage.getItem(controlsOpenKey) === 'true'
	} catch {
		// Keep the controls closed when browser storage is unavailable.
	}

	controls.addEventListener('toggle', () => {
		try {
			localStorage.setItem(controlsOpenKey, String(controls.open))
		} catch {
			// The controls still work when browser storage is unavailable.
		}
	})

	document.querySelectorAll('input[type=radio]').forEach(el => {
		el.addEventListener('change', radioChanged)
	})

	return controls
}

const revealControlsAfterIntro = controls => {
	const intro = document.querySelector('.sclf')
	if (!controls || !intro) return

	const observer = new IntersectionObserver(entries => {
		if (entries[0].isIntersecting) return

		controls.classList.add('controls--visible')
		observer.disconnect()
	})

	observer.observe(intro)
}

const setupCopyButtons = () => {
	addCopyButtons({
		blockSelector: '.prose__article pre',
		wrapperClass: 'code-block',
		wrapperElement: true,
	})
}

const scrollToHash = () => {
	const target = document.getElementById(window.location.hash.slice(1))
	if (!target) return

	requestAnimationFrame(() => target.scrollIntoView())
}

const seekVideo = (video, progress) => {
	if (seeking) return

	const time = (video.duration / 2) * Math.abs(clamp(0, progress, 1))
	const media = video
	media.currentTime = time
}

const setupVideo = () => {
	const video = document.querySelector('video')
	if (!video) return

	video.addEventListener('play', () => {
		video.pause()
	})
	video.addEventListener('seeked', () => {
		seeking = false
	})
	video.addEventListener('seeking', () => {
		seeking = true
	})

	video.pause()
}

const updateVideo = (event: Event) => {
	const { currentTarget, detail } = event as ScrollEvent

	if (!currentTarget) return

	const {
		progress: { contain, cover },
	} = detail

	const video = currentTarget.querySelector('video')
	if (!video) return

	seekVideo(video, isContain() ? contain : cover)
}

const main = () => {
	const controls = setupControls(loadDemoTemplates())

	Array.from(document.querySelectorAll('.section--percentage')).forEach(el => {
		el.addEventListener('sclf:scroll', updatePercentage)
	})

	Array.from(document.querySelectorAll('.section--video')).forEach(el => {
		el.addEventListener('sclf:scroll', updateVideo)
	})

	revealControlsAfterIntro(controls)
	setupCopyButtons()
	setupVideo()
	window.addEventListener('hashchange', scrollToHash)
	scrollToHash()
}

;(function init() {
	if (document.readyState === 'interactive') {
		main()
	} else {
		document.addEventListener('DOMContentLoaded', main)
	}
})()
