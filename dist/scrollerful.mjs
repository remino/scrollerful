/*! scrollerful v0.4.6 | (c) 2022-2023 Rémino Rem <https://remino.net/> | ISC Licence */
var style = ":root{--scrollerful-delay:0s}.scrollerful{min-height:100%}@supports(scroll-snap-stop:always){.scrollerful--snap,.scrollerful__snap-page,.scrollerful__snap-page body{scroll-snap-stop:always;scroll-snap-type:y proximity}}.scrollerful--snap,.scrollerful__snap-page{overflow-y:auto}@supports(scroll-snap-stop:always){.scrollerful--snap .scrollerful__tray,.scrollerful__snap-page .scrollerful__tray{scroll-snap-align:start end}}.scrollerful--snap{height:100%}.scrollerful__ruler{background:none transparent;border:none;bottom:0;display:block;height:100vh;height:100lvh;left:-200%;pointer-events:none;position:absolute;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1rem;z-index:-10}.scrollerful__plate{align-items:center;display:flex;flex-flow:column;height:100vh;height:100lvh;justify-content:center;max-height:100%;overflow:hidden;position:sticky;top:0}.scrollerful__sprite,.scrollerful__sprite--inner,.scrollerful__sprite--outer{animation-duration:100s;animation-fill-mode:both;animation-play-state:paused;animation-timing-function:linear}.scrollerful__sprite,.scrollerful__sprite--inner{animation-delay:calc(var(--scrollerful-progress-inner, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful__sprite,.scrollerful__sprite--outer{animation-delay:calc(var(--scrollerful-progress-outer, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful__tray{height:300vh;height:300lvh;position:relative}.scrollerful__tray--padding{height:100vh;height:100lvh}";

const SCRIPT_NAME = 'scrollerful';

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

const getStyleEl = () => document.getElementById(EL_ID_STYLE);
const getViewportHeight = () => document.getElementById(EL_ID_RULER)
	.getBoundingClientRect().height;
const sortNums = (...nums) => nums.sort((a, b) => a - b);

const isWithin = (num, a, b) => {
	const [min, max] = sortNums(a, b);
	return num >= min && num <= max
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

const getContainerCoords = el => {
	if (['auto', 'scroll'].includes(getComputedStyle(el).getPropertyValue('overflow-y'))) {
		const rect = el.getBoundingClientRect();
		const { top: containerTop, height: viewHeight } = rect;
		const { scrollHeight: containerHeight } = el;
		return { containerTop, containerHeight, viewHeight }
	}

	const viewHeight = getViewportHeight();
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

const scroll = ({ target }) => {
	[target, ...target.querySelectorAll(SEL_TRAY)].forEach(el => {
		processSection(el);
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
};

export { scrollerful as default };
