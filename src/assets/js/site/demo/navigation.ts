const scrollToHash = () => {
	const target = document.getElementById(window.location.hash.slice(1))
	if (!target) return

	requestAnimationFrame(() => target.scrollIntoView())
}

export const initNavigation = () => {
	window.addEventListener('hashchange', scrollToHash)
	scrollToHash()
}
