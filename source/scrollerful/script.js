(function(){'use strict';var style = ":root{--scrollerful-delay: 0s}.scrollerful{min-height:100%}.scrollerful--snap,.scrollerful__snap-page,.scrollerful__snap-page body{scroll-snap-type:y proximity}.scrollerful--snap,.scrollerful__snap-page{overflow-y:auto}.scrollerful--snap .scrollerful__tray,.scrollerful__snap-page .scrollerful__tray{scroll-snap-align:start end}.scrollerful--snap{height:100%}.scrollerful__plate{align-items:center;display:flex;flex-flow:column;height:100lvh;justify-content:center;max-height:100%;overflow:hidden;perspective-origin:center;perspective:150px;position:sticky;top:0;transform-style:preserve-3d}.scrollerful__sprite{animation-delay:calc(var(--scrollerful-progress-outer, 0)*-100s + var(--scrollerful-delay, 0));animation-duration:100s;animation-fill-mode:both;animation-play-state:paused;animation-timing-function:linear}.scrollerful__tray{height:300lvh}.scrollerful__tray--padding{height:100lvh}";const SCRIPT_NAME = 'scrollerful';

const CSS_CLASS_SNAP = `.${SCRIPT_NAME}--snap`;
const CSS_CLASS_TRAY = `.${SCRIPT_NAME}__tray`;
const CSS_PROP_PROGRESS_INNER = `--${SCRIPT_NAME}-progress-inner`;
const CSS_PROP_PROGRESS_OUTER = `--${SCRIPT_NAME}-progress-outer`;
const EVENT_SCROLL = `${SCRIPT_NAME}scroll`;
const STYLE_EL_ID = `${SCRIPT_NAME}_style`;

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
		new CustomEvent(EVENT_SCROLL, {
			detail: { progress },
			bubbles: true,
			cancelable: true,
			composed: false,
		}),
	);
};

const removeStyleProperties = (el, ...names) => {
	names.forEach(name => el.style.removeProperty(name));
};

const setStyleVars = ({
	target,
	detail: {
		progress: { inner, outer },
	},
}) => {
	if (outer < 0 || outer > 1) {
		removeStyleProperties(
			target,
			CSS_PROP_PROGRESS_INNER,
			CSS_PROP_PROGRESS_OUTER,
		);
		return
	}

	target.style.setProperty(CSS_PROP_PROGRESS_INNER, inner);
	target.style.setProperty(CSS_PROP_PROGRESS_OUTER, outer);
};

const scroll = event => {
	Array.from(event.target.querySelectorAll(CSS_CLASS_TRAY)).forEach(el => {
		el.addEventListener(EVENT_SCROLL, setStyleVars);
		processSection(el);
	});
};

const scrollerful = () => {
	addStyle();

	Array.from(document.querySelectorAll(CSS_CLASS_SNAP)).forEach(target => {
		target.addEventListener('resize', scroll);
		target.addEventListener('scroll', scroll);
		scroll({ target });
	});

	window.addEventListener('resize', scroll);
	window.addEventListener('scroll', scroll);
	scroll({ target: document });
};(function init() {
	if (document.readyState === 'interactive') {
		scrollerful();
	} else {
		document.addEventListener('DOMContentLoaded', scrollerful);
	}
}());})();