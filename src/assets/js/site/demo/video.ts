import type { ScrollEvent } from './types'

let seeking = false

const clamp = (min, value, max) => Math.max(min, Math.min(max, value))
const isContain = () => document.body.classList.contains('demo--contain')

const seekVideo = (video, progress) => {
	if (seeking) return

	const media = video
	media.currentTime = (video.duration / 2) * Math.abs(clamp(0, progress, 1))
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

export const initVideo = () => {
	const video = document.querySelector('video')
	if (!video) return

	video.addEventListener('play', () => video.pause())
	video.addEventListener('seeked', () => {
		seeking = false
	})
	video.addEventListener('seeking', () => {
		seeking = true
	})

	video.pause()
	document.querySelectorAll('.section--video').forEach(el => {
		el.addEventListener('sclf:scroll', updateVideo)
	})
}
