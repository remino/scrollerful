const main = () => {
	if (document.readyState === 'interactive') {
		init()
	} else {
		document.addEventListener('DOMContentLoaded', init)
	}
}

main()
