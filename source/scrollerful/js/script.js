(function(){'use strict';var style = ":root {\n  --scrollerful-delay: 0s;\n}\n\n.scrollerful__animated {\n  animation-name: bg-rotate;\n  align-items: center;\n  background-color: #333;\n  display: flex;\n  flex-flow: column;\n  height: 100lvh;\n  justify-content: center;\n  overflow: hidden;\n  width: 100vw;\n}\n\n.scrollerful {\n  min-height: 100%;\n}\n.scrollerful--snap, .scrollerful__snap-page, .scrollerful__snap-page body {\n  scroll-snap-type: y proximity;\n}\n.scrollerful--snap, .scrollerful__snap-page {\n  overflow-y: auto;\n}\n.scrollerful--snap .scrollerful__section, .scrollerful__snap-page .scrollerful__section {\n  scroll-snap-align: start end;\n}\n.scrollerful--snap {\n  height: 100%;\n}\n.scrollerful__animated {\n  animation-delay: calc(var(--scrollerful-progress-outer, 0) * -100s + var(--scrollerful-delay, 0));\n  animation-duration: 100s;\n  animation-fill-mode: both;\n  animation-play-state: paused;\n  animation-timing-function: linear;\n}\n.scrollerful__section {\n  height: 300lvh;\n}\n.scrollerful__section--padding {\n  height: 100lvh;\n}\n.scrollerful__section__content {\n  align-items: center;\n  display: flex;\n  flex-flow: column;\n  height: 100lvh;\n  justify-content: center;\n  max-height: 100%;\n  overflow: hidden;\n  perspective-origin: center;\n  perspective: 150px;\n  position: sticky;\n  top: 0;\n  transform-style: preserve-3d;\n}";const STYLE_EL_ID = 'scrollerful_style';

const animatedElements = parent => Array.from(parent.querySelectorAll('.scrollerful__animated'));
const minMax = (min, val, max) => Math.max(min, Math.min(max, val));

const getStyleEl = () => document.getElementById(STYLE_EL_ID);

const addStyle = () => {
	if (getStyleEl()) return

	const styleEl = document.createElement('style');
	styleEl.setAttribute('id', STYLE_EL_ID);
	styleEl.textContent = style;

	document.head.appendChild(styleEl);
};

const getContainerCoords = el => {
	if (['auto', 'scroll'].includes(getComputedStyle(el).getPropertyValue('overflow-y'))) {
		const rect = el.getBoundingClientRect();
		const { top: containerTop, height: viewHeight } = rect;
		const { scrollHeight: containerHeight } = el;
		return { containerTop, containerHeight, viewHeight }
	}

	const { innerHeight: viewHeight } = window;
	const { height: containerHeight, top: containerTop } = el.getBoundingClientRect();
	return { containerTop, containerHeight, viewHeight }
};

const sectionProgress = el => {
	const { containerTop, containerHeight, viewHeight } = getContainerCoords(el);

	return {
		inner: containerTop / -(containerHeight - viewHeight),
		outer: (containerTop - viewHeight) / -(containerHeight + viewHeight),
	}
};

const processSection = el => {
	const progress = sectionProgress(el);

	el.dispatchEvent(
		new CustomEvent('scrollerfulscroll', {
			detail: { progress },
			bubbles: true,
			cancelable: true,
			composed: false,
		})
	);
};

const removeStyleProperties = (el, ...names) => {
	names.forEach(name => el.style.removeProperty(name));
};

const floatToIntegerPercentage = float => Math.round(float * 100);

const setStyleVars = ({
	target,
	detail: {
		progress: { inner, outer },
	},
}) => {
	if (outer < 0 || outer > 1) {
		removeStyleProperties(target, '--scrollerful-progress-inner', '--scrollerful-progress-outer');
		return
	}

	target.style.setProperty('--scrollerful-progress-inner', inner);
	target.style.setProperty('--scrollerful-progress-outer', outer);
};

const setContent = ({
	target,
	detail: {
		progress: { inner },
	},
}) => {
	animatedElements(target).forEach(animated => {
		const output = animated.querySelector('output');
		if (!output) return
		const percentage = minMax(0, floatToIntegerPercentage(inner), 100);
		output.innerText = `${percentage}%`;
	});
};

const scroll = event => {
	Array.from(event.target.querySelectorAll('.scrollerful__section')).forEach(el => {
		el.addEventListener('scrollerfulscroll', setStyleVars);
		el.addEventListener('scrollerfulscroll', setContent);
		processSection(el);
	});
};

const init$1 = () => {
	Array.from(document.querySelectorAll('.scrollerful--snap')).forEach(target => {
		target.addEventListener('resize', scroll);
		target.addEventListener('scroll', scroll);
		scroll({ target });
	});

	window.addEventListener('resize', scroll);
	window.addEventListener('scroll', scroll);
	scroll({ target: document });

	addStyle();
};const init = () => {
	if (document.readyState === 'interactive') {
		init$1();
	} else {
		document.addEventListener('DOMContentLoaded', init$1);
	}
};

init();})();