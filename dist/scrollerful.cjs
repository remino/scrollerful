/*! scrollerful v0.6.4 | (c) 2022-2024 Rémino Rem <https://remino.net/> | ISC Licence */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.scrollerful = factory());
})(this, (function () { 'use strict';

	var style = "@media screen{@supports(scroll-snap-stop:always){.sclf--enabled .sclf--snap,.sclf--enabled.sclf--snap{scroll-snap-stop:normal;scroll-snap-type:y proximity}}.sclf--enabled .sclf--snap,.sclf--enabled.sclf--snap{overflow-y:auto}@supports(scroll-snap-stop:always){.sclf--enabled .sclf--snap .sclf,.sclf--enabled.sclf--snap .sclf{scroll-snap-align:start}}@supports(scroll-snap-stop:always){.sclf--enabled .sclf--x.sclf--snap,.sclf--enabled.sclf--snap .sclf--x,.sclf--enabled.sclf--snap:has(.sclf--x){scroll-snap-type:x proximity}}}@media screen{.sclf--enabled .sclf--snap{height:100%}.sclf--enabled .sclf--x{display:flex;flex-flow:row nowrap}.sclf--enabled .sclf--x.sclf--snap{overflow-x:auto;overflow-y:hidden}.sclf--enabled .sclf--x .sclf__float{height:100vh;height:100svh;left:0;max-height:none;max-width:100%;top:auto;width:100vw;width:100lvw}.sclf--enabled .sclf--x .sclf{flex-shrink:0;height:auto;width:300vw;width:300lvw}.sclf--enabled .sclf--x .sclf--padding{height:auto;width:100vw;width:100lvw}@supports(animation-timeline:scroll()){.sclf--enabled .sclf--x .sclf{view-timeline:--sclf-float x}}.sclf--enabled .sclf__ruler{background:none transparent;border:none;bottom:0;display:block;height:100vh;height:100lvh;left:-200%;pointer-events:none;position:absolute;top:0;-webkit-user-select:none;user-select:none;width:100vw;width:100lvw;z-index:-10}.sclf--enabled .sclf__float{align-items:center;display:flex;flex-flow:column;height:100vh;height:100lvh;justify-content:center;max-height:100%;overflow:hidden;position:sticky;top:0}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--contain,.sclf--enabled .sclf__sprite--cover{animation-duration:calc(var(--sclf-duration, 100)*1s);animation-fill-mode:both;animation-play-state:paused;animation-timing-function:linear}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--cover{animation-delay:calc(var(--sclf-cover, 0)*-100s + var(--sclf-delay, 0)*1s)}.sclf--enabled .sclf__sprite--contain{animation-delay:calc(var(--sclf-contain, 0)*-100s + var(--sclf-delay, 0)*1s)}.sclf--enabled .sclf{height:300vh;height:300lvh;position:relative}.sclf--enabled .sclf--padding{height:100vh;height:100lvh}@supports(animation-timeline:scroll()){.sclf--enabled .sclf{view-timeline:--sclf-float y}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--contain,.sclf--enabled .sclf__sprite--cover{animation-delay:0s;animation-play-state:running;animation-timeline:--sclf-float}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--cover{animation-range:cover calc(var(--sclf-delay, 0)*1%) cover calc(var(--sclf-duration, 100)*1%)}.sclf--enabled .sclf__sprite--contain{animation-range:contain calc(var(--sclf-delay, 0)*1%) contain calc(var(--sclf-duration, 100)*1%)}}}@supports(animation-timeline:scroll()){.sclf--enabled,.sclf--enabled .sclf--enabled{view-timeline:--sclf-float y}}";

	const calcContainProgress = (containerStart, containerSize, viewSize) => {
		if (containerSize === viewSize) {
			const progress = (((containerStart - viewSize) / (viewSize)) * -1);

			switch (true) {
				case containerStart < 0: return progress
				case containerStart > 0: return progress - 1
				default: return 0.5
			}
		}

		const progress = (((containerStart) / (containerSize - viewSize)) * -1);

		switch (true) {
			case containerSize < viewSize: return 1 - progress
			default: return progress
		}
	};

	const calcCoverProgress = (containerStart, containerSize, viewSize) => (
		((containerStart - viewSize) / (viewSize + containerSize)) * -1
	);

	const PREFIX = 'sclf';

	const CSS_CLASS_ENABLED = `${PREFIX}--enabled`;
	const CSS_CLASS_HORIZONTAL = `${PREFIX}--x`;
	const CSS_CLASS_INSIDE_CONTAIN = `${PREFIX}--inside--contain`;
	const CSS_CLASS_INSIDE_COVER = `${PREFIX}--inside--cover`;
	const CSS_CLASS_RULER = `${PREFIX}__ruler`;
	const CSS_PROP_PROGRESS_CONTAIN = `--${PREFIX}-contain`;
	const CSS_PROP_PROGRESS_COVER = `--${PREFIX}-cover`;
	const EVENT_CONTAIN_ENTER = `${PREFIX}:contain:enter`;
	const EVENT_CONTAIN_EXIT = `${PREFIX}:contain:exit`;
	const EVENT_COVER_ENTER = `${PREFIX}:cover:enter`;
	const EVENT_COVER_EXIT = `${PREFIX}:cover:exit`;
	const EVENT_SCROLL = `${PREFIX}:scroll`;
	const SEL_SCROLL = `.${PREFIX}`;
	const SEL_TRAY = `.${PREFIX}`;
	// TODO Predict internia to smoothen animations
	// const SMOOTHING_FACTOR = 50
	const EL_ID_RULER = `${PREFIX}_ruler`;
	const EL_ID_STYLE = `${PREFIX}_style`;

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
		if (document.getElementById(EL_ID_RULER)) return

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

		if (!document.head.firstChild) {
			document.head.appendChild(styleEl);
			return
		}

		document.head.insertBefore(styleEl, document.head.firstChild);
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
			contain: calcContainProgress(containerStart, containerSize, viewSize),
			cover: calcCoverProgress(containerStart, containerSize, viewSize),
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
			progress: { contain, cover },
		},
	}) => {
		if (!isWithin(cover, 0, 1)) {
			removeStyleProperties(
				target,
				CSS_PROP_PROGRESS_CONTAIN,
				CSS_PROP_PROGRESS_COVER,
			);
			return
		}

		target.style.setProperty(CSS_PROP_PROGRESS_CONTAIN, contain);
		target.style.setProperty(CSS_PROP_PROGRESS_COVER, cover);
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

	const triggerContainEnterExit = ({ target, detail: { progress: { contain } } }) => {
		triggerEnterExit(
			target,
			contain,
			EVENT_CONTAIN_ENTER,
			EVENT_CONTAIN_EXIT,
			CSS_CLASS_INSIDE_CONTAIN,
		);
	};

	const triggerCoverEnterExit = ({ target, detail: { progress: { cover } } }) => {
		triggerEnterExit(
			target,
			cover,
			EVENT_COVER_ENTER,
			EVENT_COVER_EXIT,
			CSS_CLASS_INSIDE_COVER,
		);
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
			el.addEventListener(EVENT_SCROLL, triggerCoverEnterExit);
			el.addEventListener(EVENT_SCROLL, triggerContainEnterExit);
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

	return scrollerful;

}));
