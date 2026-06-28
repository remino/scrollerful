let seeking = false

const clamp = (min, value, max) => Math.max(min, Math.min(max, value))
const isContain = () => document.body.classList.contains('demo--contain')

const showProgress = (target, progress) => {
	// eslint-disable-next-line no-param-reassign
	target.querySelector('.item--percentage output').textContent = Math.max(0, Math.min(100, Math.round(progress * 100)))
}

const updatePercentage = ({ target, detail: { progress: { contain, cover } } }) => {
	showProgress(target, isContain() ? contain : cover)
}

const changedDirection = value => {
	document.body.classList.remove('demo--horizontal', 'demo--vertical', 'sclf--x')
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
		default: break
	}
}

const setupControls = () => {
	const controls = document.querySelector('.controls')
	if (!controls) return

	document.querySelectorAll('input[type=radio]').forEach(el => {
		el.addEventListener('change', radioChanged)
	})
}

const getYouTubeVideo = () => {
	document.getElementById('ytvid')
}

const seekVideo = (video, progress) => {
	if (seeking) return

	const time = (video.duration / 2) * Math.abs(clamp(0, progress, 1))
	// eslint-disable-next-line no-param-reassign
	video.currentTime = time
}

const setupVideo = () => {
	const video = document.querySelector('video')
	if (!video) return

	video.addEventListener('play', () => { video.pause() })
	video.addEventListener('seeked', () => { seeking = false })
	video.addEventListener('seeking', () => { seeking = true })

	video.pause()
}

const setupYouTubeVideo = () => {
	// pause video right away
	const ytvid = getYouTubeVideo()
	if (!ytvid) return

	ytvid.pauseVideo()
}

const updateVideo = ({ currentTarget, detail: { progress: { contain, cover } } }) => {
	const video = currentTarget.querySelector('video')
	if (!video) return

	seekVideo(video, isContain() ? contain : cover)
}

const main = () => {
	Array.from(document.querySelectorAll('.section--percentage')).forEach(el => {
		el.addEventListener('sclf:scroll', updatePercentage)
	})

	Array.from(document.querySelectorAll('.section--video')).forEach(el => {
		el.addEventListener('sclf:scroll', updateVideo)
	})

	setupControls()
	// setupYouTubeVideo()
	setupVideo()
}

(function init() {
	if (document.readyState === 'interactive') {
		main()
	} else {
		document.addEventListener('DOMContentLoaded', main)
	}
}())
