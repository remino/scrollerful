/*! scrollerful v0.5.1 | (c) 2022-2023 Rémino Rem <https://remino.net/> | ISC Licence */
var style = ":root{--scrollerful-delay:0s}@media screen{.scrollerful--enabled .scrollerful{min-height:100%}@supports(scroll-snap-stop:always){.scrollerful--enabled .scrollerful--snap,.scrollerful--enabled .scrollerful--snap--page,.scrollerful--enabled .scrollerful--snap--page body{scroll-snap-stop:always;scroll-snap-type:y proximity}}.scrollerful--enabled .scrollerful--snap,.scrollerful--enabled .scrollerful--snap--page{overflow-y:auto}@supports(scroll-snap-stop:always){.scrollerful--enabled .scrollerful--snap .scrollerful__tray,.scrollerful--enabled .scrollerful--snap--page .scrollerful__tray{scroll-snap-align:start end}}.scrollerful--enabled .scrollerful--snap{height:100%}.scrollerful--enabled .scrollerful--x{display:flex;flex-flow:row nowrap}.scrollerful--enabled .scrollerful--x.scrollerful--snap{overflow-x:auto;overflow-y:hidden}@supports(scroll-snap-stop:always){.scrollerful--enabled .scrollerful--x.scrollerful--snap{scroll-snap-type:x proximity}}.scrollerful--enabled .scrollerful--x .scrollerful__plate{left:0;max-height:none;max-width:100%;top:auto;width:100vw;width:100lvw}.scrollerful--enabled .scrollerful--x .scrollerful__tray{flex-shrink:0;height:auto;width:300vw;width:300lvw}.scrollerful--enabled .scrollerful--x .scrollerful__tray--padding{height:auto;width:100vw;width:100lvw}.scrollerful--enabled .scrollerful__ruler{background:none transparent;border:none;bottom:0;display:block;height:100vh;height:100lvh;left:-200%;pointer-events:none;position:absolute;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:100vw;width:100lvw;z-index:-10}.scrollerful--enabled .scrollerful__plate{align-items:center;display:flex;flex-flow:column;height:100vh;height:100lvh;justify-content:center;max-height:100%;overflow:hidden;position:sticky;top:0}.scrollerful--enabled .scrollerful__sprite,.scrollerful--enabled .scrollerful__sprite--inner,.scrollerful--enabled .scrollerful__sprite--outer{animation-duration:100s;animation-fill-mode:both;animation-play-state:paused;animation-timing-function:linear}.scrollerful--enabled .scrollerful__sprite,.scrollerful--enabled .scrollerful__sprite--inner{animation-delay:calc(var(--scrollerful-progress-inner, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful--enabled .scrollerful__sprite,.scrollerful--enabled .scrollerful__sprite--outer{animation-delay:calc(var(--scrollerful-progress-outer, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful--enabled .scrollerful__tray{height:300vh;height:300lvh;position:relative}.scrollerful--enabled .scrollerful__tray--padding{height:100vh;height:100lvh}}";

const SCRIPT_NAME = 'scrollerful';

const CSS_CLASS_ENABLED = `${SCRIPT_NAME}--enabled`;
const CSS_CLASS_HORIZONTAL = `${SCRIPT_NAME}--x`;
const CSS_CLASS_INSIDE_INNER = `${SCRIPT_NAME}--inside--inner`;
const CSS_CLASS_INSIDE_OUTER = `${SCRIPT_NAME}--inside--outer`;
const CSS_CLASS_RULER = `${SCRIPT_NAME}__ruler`;
const CSS_PROP_PROGRESS_INNER = `--${SCRIPT_NAME}-progress-inner`;
const CSS_PROP_PROGRESS_OUTER = `--${SCRIPT_NAME}-progress-outer`;
const EVENT_INNER_ENTER = `${SCRIPT_NAME}innerenter`;
const EVENT_INNER_EXIT = `${SCRIPT_NAME}innerexit`;
const EVENT_OUTER_ENTER = `${SCRIPT_NAME}outerenter`;
const EVENT_OUTER_EXIT = `${SCRIPT_NAME}outerexit`;
const EVENT_SCROLL = `${SCRIPT_NAME}scroll`;
const SEL_SCROLL = `.${SCRIPT_NAME}`;
const SEL_TRAY = `.${SCRIPT_NAME}__tray`;
const EL_ID_RULER = `${SCRIPT_NAME}_ruler`;
const EL_ID_STYLE = `${SCRIPT_NAME}_style`;

let requestId;

const getElScrollSize = (el, horizontal = false) => (horizontal ? el.scrollWidth : el.scrollHeight);
const getStyleEl = () => document.getElementById(EL_ID_STYLE);
const getViewportRect = () => document.getElementById(EL_ID_RULER).getBoundingClientRect();
const getViewportSize = horizontal => getViewportRect()[horizontal ? 'width' : 'height'];
const showsOverflow = (el, horizontal) => ['auto', 'scroll']
	.includes(getComputedStyle(el).getPropertyValue(`overflow-${horizontal ? 'x' : 'y'}`));
const sortNums = (...nums) => nums.sort((a, b) => a - b);

const isWithin = (num, a, b) => {
	const [min, max] = sortNums(a, b);
	return num >= min && num <= max
};

const addEnabledClass = () => {
	document.documentElement.classList.add(CSS_CLASS_ENABLED);
};

const addRuler = () => {
	const ruler = document.createElement('div');
	ruler.setAttribute('id', EL_ID_RULER);
	ruler.classList.add(CSS_CLASS_RULER);
	document.body.appendChild(ruler);
};

const addStyle = () => {
	if (getStyleEl()) return

	const styleEl = document.createElement('style');
	styleEl.setAttribute('id', EL_ID_STYLE);
	styleEl.textContent = style;

	document.head.appendChild(styleEl);
};

const getElAxisCoords = (el, horizontal = false) => {
	if (horizontal) {
		const { left, width } = el.getBoundingClientRect();
		return { size: width, start: left }
	}

	const { height, top } = el.getBoundingClientRect();
	return { size: height, start: top }
};

const getContainerCoords = (el, horizontal) => {
	const { size, start } = getElAxisCoords(el, horizontal);
	const overflow = showsOverflow(el, horizontal);

	return {
		containerStart: start,
		containerSize: overflow ? getElScrollSize(el, horizontal) : size,
		viewSize: overflow ? size : getViewportSize(horizontal),
	}
};

const sectionProgress = (el, horizontal) => {
	const { containerStart, containerSize, viewSize } = getContainerCoords(el, horizontal);

	return {
		inner: containerStart / -(containerSize - viewSize),
		outer: (containerStart - viewSize) / -(containerSize + viewSize),
	}
};

const processSection = async (el, horizontal) => {
	const progress = sectionProgress(el, horizontal);

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
	if (!isWithin(outer, 0, 1)) {
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

const triggerEnterExit = (target, progress, eventEnter, eventExit, className) => {
	if (!isWithin(progress, 0, 1)) {
		if (target.classList.contains(className)) {
			target.classList.remove(className);

			target.dispatchEvent(
				new CustomEvent(eventExit, {
					bubbles: true,
					cancelable: true,
					composed: false,
				}),
			);
		}
	} else if (!target.classList.contains(className)) {
		target.classList.add(className);

		target.dispatchEvent(
			new CustomEvent(eventEnter, {
				bubbles: true,
				cancelable: true,
				composed: false,
			}),
		);
	}
};

const triggerInnerEnterExit = ({ target, detail: { progress: { inner } } }) => {
	triggerEnterExit(target, inner, EVENT_INNER_ENTER, EVENT_INNER_EXIT, CSS_CLASS_INSIDE_INNER);
};

const triggerOuterEnterExit = ({ target, detail: { progress: { outer } } }) => {
	triggerEnterExit(target, outer, EVENT_OUTER_ENTER, EVENT_OUTER_EXIT, CSS_CLASS_INSIDE_OUTER);
};

const scrollFrame = async target => {
	const horizontal = target.classList.contains(CSS_CLASS_HORIZONTAL);

	Promise.all([
		target,
		...target.querySelectorAll(SEL_TRAY),
	].map(el => processSection(el, horizontal)));
};

const scroll = ({ target }) => {
	if (requestId) cancelAnimationFrame(requestId);

	requestId = requestAnimationFrame(() => {
		scrollFrame(target);
		requestId = null;
	});
};

const addScrollListeners = scrollEl => {
	[scrollEl, ...scrollEl.querySelectorAll(SEL_TRAY)].forEach(el => {
		el.addEventListener(EVENT_SCROLL, setStyleVars);
		el.addEventListener(EVENT_SCROLL, triggerOuterEnterExit);
		el.addEventListener(EVENT_SCROLL, triggerInnerEnterExit);
	});
};

const scrollerful = () => {
	addStyle();
	addRuler();

	Array.from(document.querySelectorAll(SEL_SCROLL)).forEach(target => {
		target.addEventListener('resize', scroll);
		target.addEventListener('scroll', scroll);
		addScrollListeners(target);
		scroll({ target });
	});

	window.addEventListener('resize', () => scroll({ target: document.body }));
	window.addEventListener('scroll', () => scroll({ target: document.body }));
	addScrollListeners(document.body);
	scroll({ target: document.body });

	addEnabledClass();
};

export { scrollerful as default };
