(() => {
	const step = 20
	const endPosition = 1200
	let position = 0

	Array.from(['header p', 'header h2', 'header .scroll-down']).forEach(selector => {
		const el = document.querySelector(selector)
		if (!el) return
		el.remove()
	})

	document.body.style.overflow = 'hidden'

	const scroll = () => {
		if (position < endPosition) {
			window.scrollTo(0, position)
			position += step
			requestAnimationFrame(scroll)
		}
	}

	setTimeout(scroll, 10000)
})()
