import type { ScrollEvent } from './types'

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

export const initProgress = () => {
	document.querySelectorAll('.section--percentage').forEach(el => {
		el.addEventListener('sclf:scroll', updatePercentage)
	})
}
