!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";var e=":root{--scrollerful-delay:0s}.scrollerful{min-height:100%}@supports(scroll-snap-stop:always){.scrollerful--snap,.scrollerful__snap-page,.scrollerful__snap-page body{scroll-snap-stop:always;scroll-snap-type:y proximity}}.scrollerful--snap,.scrollerful__snap-page{overflow-y:auto}@supports(scroll-snap-stop:always){.scrollerful--snap .scrollerful__tray,.scrollerful__snap-page .scrollerful__tray{scroll-snap-align:start end}}.scrollerful--snap{height:100%}.scrollerful__ruler{background:none transparent;border:none;bottom:0;display:block;height:100vh;height:100lvh;left:-200%;pointer-events:none;position:absolute;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1rem;z-index:-10}.scrollerful__plate{align-items:center;display:flex;flex-flow:column;height:100vh;height:100lvh;justify-content:center;max-height:100%;overflow:hidden;position:sticky;top:0}.scrollerful__sprite,.scrollerful__sprite--inner,.scrollerful__sprite--outer{animation-duration:100s;animation-fill-mode:both;animation-play-state:paused;animation-timing-function:linear}.scrollerful__sprite,.scrollerful__sprite--inner{animation-delay:calc(var(--scrollerful-progress-inner, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful__sprite,.scrollerful__sprite--outer{animation-delay:calc(var(--scrollerful-progress-outer, 0)*-100s + var(--scrollerful-delay, 0))}.scrollerful__tray{height:300vh;height:300lvh;position:relative}.scrollerful__tray--padding{height:100vh;height:100lvh}";const t="scrollerful",r=`${t}--inside--inner`,l=`${t}--inside--outer`,n=`${t}__ruler`,o=`--${t}-progress-inner`,s=`--${t}-progress-outer`,i=`${t}innerenter`,a=`${t}innerexit`,c=`${t}outerenter`,d=`${t}outerexit`,u=`${t}scroll`,p=`.${t}`,g=`.${t}__tray`,h=`${t}_ruler`,f=`${t}_style`,y=(e,t,r)=>{const[l,n]=((...e)=>e.sort(((e,t)=>e-t)))(t,r);return e>=l&&e<=n},m=e=>{const t=(e=>{const{containerTop:t,containerHeight:r,viewHeight:l}=(e=>{if(["auto","scroll"].includes(getComputedStyle(e).getPropertyValue("overflow-y"))){const t=e.getBoundingClientRect(),{top:r,height:l}=t,{scrollHeight:n}=e;return{containerTop:r,containerHeight:n,viewHeight:l}}const t=document.getElementById(h).getBoundingClientRect().height,{height:r,top:l}=e.getBoundingClientRect();return{containerTop:l,containerHeight:r,viewHeight:t}})(e);return{inner:t/-(r-l),outer:(t-l)/-(r+l)}})(e);e.dispatchEvent(new CustomEvent(u,{detail:{progress:t},bubbles:!0,cancelable:!0,composed:!1}))},v=({target:e,detail:{progress:{inner:t,outer:r}}})=>{var l;y(r,0,1)?(e.style.setProperty(o,t),e.style.setProperty(s,r)):(l=e,[o,s].forEach((e=>l.style.removeProperty(e))))},_=(e,t,r,l,n)=>{y(t,0,1)?e.classList.contains(n)||(e.classList.add(n),e.dispatchEvent(new CustomEvent(r,{bubbles:!0,cancelable:!0,composed:!1}))):e.classList.contains(n)&&(e.classList.remove(n),e.dispatchEvent(new CustomEvent(l,{bubbles:!0,cancelable:!0,composed:!1})))},b=({target:e,detail:{progress:{inner:t}}})=>{_(e,t,i,a,r)},E=({target:e,detail:{progress:{outer:t}}})=>{_(e,t,c,d,l)},w=({target:e})=>{[e,...e.querySelectorAll(g)].forEach((e=>{m(e)}))},L=e=>{[e,...e.querySelectorAll(g)].forEach((e=>{e.addEventListener(u,v),e.addEventListener(u,E),e.addEventListener(u,b)}))};var $=()=>{(()=>{if(document.getElementById(f))return;const t=document.createElement("style");t.setAttribute("id",f),t.textContent=e,document.head.appendChild(t)})(),(()=>{const e=document.createElement("div");e.setAttribute("id",h),e.classList.add(n),document.body.appendChild(e)})(),Array.from(document.querySelectorAll(p)).forEach((e=>{e.addEventListener("resize",w),e.addEventListener("scroll",w),L(e),w({target:e})})),window.addEventListener("resize",(()=>w({target:document.body}))),window.addEventListener("scroll",(()=>w({target:document.body}))),L(document.body),w({target:document.body})};"interactive"===document.readyState?$():document.addEventListener("DOMContentLoaded",$)}));