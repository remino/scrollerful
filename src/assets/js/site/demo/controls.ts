const controlsOpenKey = 'scrollerful-demo-controls-open'
const scopeSpriteSelector = '.sclf:not(.contain-always)'

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
		document
			.querySelectorAll(`${scopeSpriteSelector} .sclf__sprite`)
			.forEach(el => {
				el.classList.remove('sclf__sprite')
				el.classList.add('sclf__sprite--contain')
			})
	} else {
		document
			.querySelectorAll(`${scopeSpriteSelector} .sclf__sprite--contain`)
			.forEach(el => {
				el.classList.remove('sclf__sprite--contain')
				el.classList.add('sclf__sprite')
			})
	}
}

const changedSize = value => {
	document.body.style.setProperty('--container-size', value)
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

	const scope = document.querySelector<HTMLInputElement>(
		'input[name=scope]:checked'
	)
	if (scope) changedScope(scope.value)

	const size = document.querySelector<HTMLInputElement>(
		'input[name=size]:checked'
	)
	if (size) changedSize(size.value)

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

export const initControls = () => {
	const controls = setupControls(loadDemoTemplates())
	revealControlsAfterIntro(controls)
}
