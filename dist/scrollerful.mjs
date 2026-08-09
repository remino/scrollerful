/*! scrollerful v1.2.1 | (c) 2022-2026 Rémino Rem <https://remino.net/> | ISC Licence */
//#region inline-css:L1VzZXJzL3JlbWkvU2l0ZXMvcmVtaW5vL3Njcm9sbGVyZnVsL3NyYy9saWIvc2Nyb2xsZXJmdWwuY3Nz
var inline_css_L1VzZXJzL3JlbWkvU2l0ZXMvcmVtaW5vL3Njcm9sbGVyZnVsL3NyYy9saWIvc2Nyb2xsZXJmdWwuY3Nz_default = "@media screen{@supports (scroll-snap-stop:always){.sclf--enabled .sclf--snap,.sclf--enabled.sclf--snap{scroll-snap-stop:normal;scroll-snap-type:y proximity}}.sclf--enabled .sclf--snap,.sclf--enabled.sclf--snap{overflow-y:auto}@supports (scroll-snap-stop:always){.sclf--enabled .sclf--snap .sclf,.sclf--enabled.sclf--snap .sclf{scroll-snap-align:start}}@supports (scroll-snap-stop:always){.sclf--enabled .sclf--x.sclf--snap,.sclf--enabled.sclf--snap .sclf--x,.sclf--enabled.sclf--snap:has(.sclf--x){scroll-snap-type:x proximity}}}@media screen{.sclf--enabled .sclf--snap{height:100%}.sclf--enabled .sclf--x{display:flex;flex-flow:row nowrap}.sclf--enabled .sclf--x.sclf--snap{overflow-x:auto;overflow-y:hidden}.sclf--enabled .sclf--x .sclf__float{height:100vh;height:100svh;left:0;max-height:none;max-width:100%;top:auto;width:100vw;width:100lvw}.sclf--enabled .sclf--x .sclf{flex-shrink:0;height:auto;width:300vw;width:300lvw}.sclf--enabled .sclf--x .sclf--padding{height:auto;width:100vw;width:100lvw}.sclf--enabled .sclf__ruler{background:none transparent;border:none;bottom:0;display:block;height:100vh;height:100lvh;left:-200%;pointer-events:none;position:absolute;top:0;-webkit-user-select:none;user-select:none;width:100vw;width:100lvw;z-index:-10}.sclf--enabled .sclf__float{max-height:100%;overflow:hidden;position:sticky;top:0}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--contain,.sclf--enabled .sclf__sprite--cover{animation-duration:calc(var(--sclf-duration, 100)*1s);animation-fill-mode:both;animation-name:var(--sclf-animation);animation-play-state:paused;animation-timing-function:linear}.sclf--enabled .sclf__sprite,.sclf--enabled .sclf__sprite--cover{animation-delay:calc(var(--sclf-cover, 0)*-100s + var(--sclf-delay, 0)*1s)}.sclf--enabled .sclf__sprite--contain{animation-delay:calc(var(--sclf-contain, 0)*-100s + var(--sclf-delay, 0)*1s)}.sclf--enabled .sclf{height:300vh;height:300lvh}.sclf,.sclf--enabled .sclf--padding{height:100vh;height:100lvh}.sclf{position:relative}.sclf__float{align-items:center;display:flex;flex-flow:column;height:100vh;height:100lvh;justify-content:center}}";
//#endregion
//#region src/lib/calc.ts
var calcContainProgress = (containerStart, containerSize, viewSize) => {
	if (containerSize === viewSize) {
		const progress = (containerStart - viewSize) / viewSize * -1;
		switch (true) {
			case containerStart < 0: return progress;
			case containerStart > 0: return progress - 1;
			default: return .5;
		}
	}
	const progress = containerStart / (containerSize - viewSize) * -1;
	switch (true) {
		case containerSize < viewSize: return 1 - progress;
		default: return progress;
	}
};
var calcCoverProgress = (containerStart, containerSize, viewSize) => (containerStart - viewSize) / (viewSize + containerSize) * -1;
//#endregion
//#region src/lib/main.ts
var PREFIX = "sclf";
var CSS_CLASS_ENABLED = `${PREFIX}--enabled`;
var CSS_CLASS_HORIZONTAL = `${PREFIX}--x`;
var CSS_CLASS_INSIDE_CONTAIN = `${PREFIX}--inside--contain`;
var CSS_CLASS_INSIDE_COVER = `${PREFIX}--inside--cover`;
var CSS_CLASS_RULER = `${PREFIX}__ruler`;
var CSS_PROP_PROGRESS_CONTAIN = `--${PREFIX}-contain`;
var CSS_PROP_PROGRESS_COVER = `--${PREFIX}-cover`;
var EVENT_CONTAIN_ENTER = `${PREFIX}:contain:enter`;
var EVENT_CONTAIN_EXIT = `${PREFIX}:contain:exit`;
var EVENT_COVER_ENTER = `${PREFIX}:cover:enter`;
var EVENT_COVER_EXIT = `${PREFIX}:cover:exit`;
var EVENT_SCROLL = `${PREFIX}:scroll`;
var SEL_SCROLL = `.${PREFIX}`;
var SEL_TRAY = `.${PREFIX}`;
var EL_ID_RULER = `${PREFIX}_ruler`;
var EL_ID_STYLE = `${PREFIX}_style`;
var requestId;
var getElScrollSize = (el, horizontal = false) => horizontal ? el.scrollWidth : el.scrollHeight;
var isDocumentScroller = (el) => el === document.body || el === document.documentElement;
var getDocumentScrollSize = (horizontal = false) => Math.max(getElScrollSize(document.body, horizontal), getElScrollSize(document.documentElement, horizontal));
var getStyleEl = () => document.getElementById(EL_ID_STYLE);
var hasBundledStyle = () => Boolean(document.querySelector("meta[name=\"scrollerful-css\"]"));
var getViewportRect = () => document.getElementById(EL_ID_RULER).getBoundingClientRect();
var getViewportSize = (horizontal) => getViewportRect()[horizontal ? "width" : "height"];
var showsOverflow = (el, horizontal) => ["auto", "scroll"].includes(getComputedStyle(el).getPropertyValue(`overflow-${horizontal ? "x" : "y"}`));
var sortNums = (...nums) => nums.sort((a, b) => a - b);
var isWithin = (num, a, b) => {
	const [min, max] = sortNums(a, b);
	return num >= min && num <= max;
};
var addEnabledClass = () => {
	document.documentElement.classList.add(CSS_CLASS_ENABLED);
};
var addRuler = () => {
	if (document.getElementById(EL_ID_RULER)) return;
	const ruler = document.createElement("div");
	ruler.setAttribute("id", EL_ID_RULER);
	ruler.classList.add(CSS_CLASS_RULER);
	document.body.appendChild(ruler);
};
var addStyle = () => {
	if (getStyleEl() || hasBundledStyle()) return;
	const styleEl = document.createElement("style");
	styleEl.setAttribute("id", EL_ID_STYLE);
	styleEl.textContent = inline_css_L1VzZXJzL3JlbWkvU2l0ZXMvcmVtaW5vL3Njcm9sbGVyZnVsL3NyYy9saWIvc2Nyb2xsZXJmdWwuY3Nz_default;
	if (!document.head.firstChild) {
		document.head.appendChild(styleEl);
		return;
	}
	document.head.insertBefore(styleEl, document.head.firstChild);
};
var getElAxisCoords = (el, horizontal = false) => {
	if (horizontal) {
		const { left, width } = el.getBoundingClientRect();
		return {
			size: width,
			start: left
		};
	}
	const { height, top } = el.getBoundingClientRect();
	return {
		size: height,
		start: top
	};
};
var getContainerCoords = (el, horizontal) => {
	const { size, start } = getElAxisCoords(el, horizontal);
	const overflow = showsOverflow(el, horizontal);
	const documentScroller = isDocumentScroller(el);
	let containerSize = size;
	if (documentScroller) containerSize = getDocumentScrollSize(horizontal);
	else if (overflow) containerSize = getElScrollSize(el, horizontal);
	return {
		containerStart: start,
		containerSize,
		viewSize: overflow ? size : getViewportSize(horizontal)
	};
};
var sectionProgress = (el, horizontal) => {
	const { containerStart, containerSize, viewSize } = getContainerCoords(el, horizontal);
	return {
		contain: calcContainProgress(containerStart, containerSize, viewSize),
		cover: calcCoverProgress(containerStart, containerSize, viewSize)
	};
};
var processSection = (el, horizontal) => {
	const progress = sectionProgress(el, horizontal);
	el.dispatchEvent(new CustomEvent(EVENT_SCROLL, {
		detail: { progress },
		bubbles: true,
		cancelable: true,
		composed: false
	}));
};
var removeStyleProperties = (el, ...names) => {
	names.forEach((name) => el.style.removeProperty(name));
};
var setStyleVars = (event) => {
	const { target, detail } = event;
	if (!target) return;
	const { progress: { contain, cover } } = detail;
	if (!isWithin(cover, 0, 1)) {
		removeStyleProperties(target, CSS_PROP_PROGRESS_CONTAIN, CSS_PROP_PROGRESS_COVER);
		return;
	}
	target.style.setProperty(CSS_PROP_PROGRESS_CONTAIN, String(contain));
	target.style.setProperty(CSS_PROP_PROGRESS_COVER, String(cover));
};
var triggerEnterExit = (target, progress, eventEnter, eventExit, className) => {
	if (!isWithin(progress, 0, 1)) {
		if (target.classList.contains(className)) {
			target.classList.remove(className);
			target.dispatchEvent(new CustomEvent(eventExit, {
				bubbles: true,
				cancelable: true,
				composed: false
			}));
		}
	} else if (!target.classList.contains(className)) {
		target.classList.add(className);
		target.dispatchEvent(new CustomEvent(eventEnter, {
			bubbles: true,
			cancelable: true,
			composed: false
		}));
	}
};
var triggerContainEnterExit = (event) => {
	const { target, detail } = event;
	if (!target) return;
	const { progress: { contain } } = detail;
	triggerEnterExit(target, contain, EVENT_CONTAIN_ENTER, EVENT_CONTAIN_EXIT, CSS_CLASS_INSIDE_CONTAIN);
};
var triggerCoverEnterExit = (event) => {
	const { target, detail } = event;
	if (!target) return;
	const { progress: { cover } } = detail;
	triggerEnterExit(target, cover, EVENT_COVER_ENTER, EVENT_COVER_EXIT, CSS_CLASS_INSIDE_COVER);
};
var scrollFrame = (target) => {
	const horizontal = target.classList.contains(CSS_CLASS_HORIZONTAL);
	Promise.all([target, ...Array.from(target.querySelectorAll(SEL_TRAY))].map((el) => processSection(el, horizontal)));
};
var scroll = (target) => {
	if (requestId) cancelAnimationFrame(requestId);
	requestId = requestAnimationFrame(() => {
		scrollFrame(target);
		requestId = null;
	});
};
var addScrollListeners = (scrollEl) => {
	[scrollEl, ...Array.from(scrollEl.querySelectorAll(SEL_TRAY))].forEach((el) => {
		el.addEventListener(EVENT_SCROLL, setStyleVars);
		el.addEventListener(EVENT_SCROLL, triggerCoverEnterExit);
		el.addEventListener(EVENT_SCROLL, triggerContainEnterExit);
	});
};
var scrollerful = () => {
	addStyle();
	addRuler();
	Array.from(document.querySelectorAll(SEL_SCROLL)).forEach((target) => {
		target.addEventListener("resize", () => scroll(target));
		target.addEventListener("scroll", () => scroll(target));
		addScrollListeners(target);
		scroll(target);
	});
	window.addEventListener("resize", () => scroll(document.body));
	window.addEventListener("scroll", () => scroll(document.body));
	addScrollListeners(document.body);
	scroll(document.body);
	addEnabledClass();
};
//#endregion
//#region src/lib/scrollerful.ts
var scrollerful_default = scrollerful;
//#endregion
export { scrollerful_default as default };
