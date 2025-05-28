# Scrollerful

By Rémino Rem <https://remino.net>

JavaScript library using CSS variables to animate elements while user scrolls.

⚠️ **2024-08-05:** If you only want scroll animations in CSS and you don't need
to add JavaScript knowing the position of the scroll, I recommend you use the
[Scroll-driven Animations module in CSS](https://drafts.csswg.org/scroll-animations-1/)
now supported by Chrome, instead of Scrollerful, along with the
[polyfill](https://github.com/flackr/scroll-timeline) for browsers that don't
yet support it, like Firefox and Safari.

[Demo](https://remino.net/scrollerful/) |
[Code](https://github.com/remino/scrollerful/)

- [About](#about)
  - [What is it?](#what-is-it)
  - [How does it work?](#how-does-it-work)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Via CDN](#via-cdn)
  - [Via npm](#via-npm)
  - [Download](#download)
- [Usage](#usage)
- [Tips](#tips)
  - [Control when the animation starts and ends](#control-when-the-animation-starts-and-ends)
  - [Applying multiple animations with different timings](#applying-multiple-animations-with-different-timings)
  - [Animating only when the container covers the viewport](#animating-only-when-the-container-covers-the-viewport)
  - [Limited support for the new `animation-timeline`](#limited-support-for-the-new-animation-timeline)
  - [Horizontal scrolling](#horizontal-scrolling)
  - [Snapping](#snapping)
  - [Make the whole page the container](#make-the-whole-page-the-container)
  - [Make sprites animate but without the floater](#make-sprites-animate-but-without-the-floater)
  - [Animating the `<body>` itself.](#animating-the-body-itself)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

https://github.com/remino/scrollerful/assets/29999/9dba06bb-6cc7-434c-8ad0-a56101809890

### What is it?

**Scrollerful** is a tiny JavaScript library of around 1 KB brotlied that works
with some stylesheet it inserts in the HTML to control CSS animations while
scrolling.

### How does it work?

1. You set a _floater_ in a _container_ with _sprites_ (or elements) to animate.
2. When you scroll, the library checks to see how much of the container has been
   scrolled in and out the viewport, while the floater with its sprites remains
   entirely visible.
3. The library sets some CSS variables to indicate how much as been scrolled and
   what point of the animation should be displayed, effectively animating
   sprites will scrolling.

[Back to top](#scrollerful)

### Built With

- JavaScript
- [Sass](https://sass-lang.com)
- [rollup.js](https://rollupjs.org/guide/en/)
- Docs:
  - [Middleman](https://middlemanapp.com)
  - [mansite](https://github.com/remino/mansite)

[Back to top](#scrollerful)

<!-- GETTING STARTED -->

## Getting Started

There are some ways to get **Scrollerful**:

### Via CDN

Link its auto-start script via `unpkg.org`:

```html
<script
  defer
  src="https://unpkg.com/scrollerful@1.0.0/dist/scrollerful-auto.min.js"></script>
```

### Via npm

Get it via `npm`:

```sh
npm add scrollerful
```

The package comes with ES and CommonJS modules, which you can import in your
code:

```js
// Using ES6 import
import scrollerful from 'scrollerful'

// Using CommonJS require
const scrollerful = require('scrollerful')

// Start it
scrollerful()
```

### Download

You can simply
[get the package on GitHub](https://github.com/remino/scrollerful) or clone the
repo from there. The script is bundled as modules both in CommonJS and ES
formats. [Back to top](#scrollerful)

## Usage

**Step 1.** Define your HTML:

```html
<div class="sclf">
  <div class="sclf__float">
    <div class="bg sclf__sprite"></div>
    <div class="toy sclf__sprite--contain"></div>
  </div>
</div>
```

**Step 2.** Define your CSS with animation keyframes:

```css
@keyframes bg {
  from {
    background-color: #000;
  }

  to {
    background-color: #fff;
  }
}

@keyframes toy {
  from {
    border-radius: 100%;
    color: #fff;
    transform: rotate(0) scale(1);
  }

  to {
    border-radius: 0;
    color: #000;
    transform: rotate(1turn) scale(1.4);
  }
}

.sclf--enabled .bg {
  animation-name: bg;
  inset: 0;
  position: absolute;
  z-index: -1;
}

.sclf--enabled .toy {
  animation-name: toy;
  height: 6rem;
  width: 6rem;
}
```

**Step 3.** Define your JavaScript to respond to events and start
**Scrollerful**:

```js
import scrollerful from 'scrollerful'

const SYMBOLS = '🛑✋😳🔶⌛🏃🤔💭😃👍✅'
const symbol = percentage => SYMBOLS[Math
    .round(percentage / SYMBOLS.length)]
const clamp = (val, min, max) = Math
    .max(min, Math.min(max, val))

// Show emoji based on how much has been scrolled:
const showContainProgress = ({
    detail: { progress: { contain: progress } }
}) => {
    document.querySelector('.toy').textContent =
        symbol(clamp(Math.round(progress * 100), 0, 100))
}

const main = () => {
    document.querySelector('.sclf')
        .addEventListener('sclf:scroll', showContainProgress)

    scrollerful()
}

main()
```

**Step 4.** Try it!

[See the above in action](https://remino.net/scrollerful/demo/simple/)

[Back to top](#scrollerful)

## Tips

### Control when the animation starts and ends

You can set some CSS variables to begin an animation far after scrolling into
the container, or finish it before reaching the end.

```css
.sclf--enabled .toy {
  /* Start animation when scrolling at a quarter: */
  --sclf-delay: 25;

  /* End animation when scrolling at three quarters: */
  --sclf-duration: 75;
}
```

### Applying multiple animations with different timings

It’s doable, but tricky and reserved for the pros. The variables used to control
single animations cannot work with multiple ones. You will also have to manage
the `animation-range` for the `animation-timeline` yourself.

```css
.sclf--enabled .toy {
  animation-delay:
    calc(var(--sclf-progress-contain, 0) * -100s + 25s),
    calc(var(--sclf-progress-contain, 0) * -100s + 50s),
    calc(var(--sclf-progress-contain, 0) * -100s + 0s);

  animation-duration: 50s, 50s, 25s;

  animation-range:
    contain 25% contain 75%,
    contain 50% contain 100%,
    contain 0% contain 25%;
}
```

Let’s take the values for the first animation above for example:

1. Every second here is a percent of scrolling of the sprite’s container.
2. Its delay is set to 25 seconds, so starts when scrolling at 25%.
3. Its duration is set to 50 seconds, so plus the delay, ends when reaching 75%.
4. As a `contain` sprite is animated only when the container fills the viewport,
   its matching `animation-range` should be when the sprite’s container is
   `contain`ed within the viewport, from 25% to 75%. Thus
   `contain 25% contain 75%`. (For `cover` sprites, it would be `cover` instead
   of `contain`.)

Note: if you only set one animation, or all your animations have the same delay
and duration, this library takes care of that for you.

### Animating only when the container covers the viewport

There are two kinds of sprites: `cover` and `contain`. For `cover`, the default,
animate the moment we see any glimpse of its container. As for `contain`, the
animation only begins when the container covers the whole viewport, i.e. when
its top reaches the top of the browser’s window.

### Limited support for the new `animation-timeline`

CSS scroll animations are coming with `animation-timeline` and a handful of
other properties.

To improve animation performance, this library automatically works with then if
the browser supports it.

However, keep in mind that the specs for
[CSS scroll animations](https://wiki.csswg.org/ideas/timelines) may change. At
the moment, only Chrome support them by default, and Firefox as well when its
`layout.css.scroll-driven-animations.enabled` flag is enabled.

That said, `animation-timeline` cannot emit events like **Scrollerful**
does—that’s exclusive to JavaScript.

### Horizontal scrolling

You can achieve horizontal scrolling (scrolling along the X axis) by wrapping
containers in an element with the `sclf--x` CSS, or simply adding that class in
the `<body>`:

```html
<body class="sclf--x">
  <div class="sclf">
    <div class="sclf__float">
      <div class="bg sclf__sprite"></div>
      <div class="toy sclf__sprite--contain"></div>
    </div>
  </div>
</body>
```

### Snapping

You can enable snapping to the edges of containers by adding the `sclf--snap`
class to `<html>`:

```html
<html class="sclf--snap"></html>
```

However, while it works fine in Firefox and Safari, that looks broken in Chrome.
(Yeah, I know that’s not good.)

### Make the whole page the container

You can! Just set the `sclf` class on `<body>`:

```html
<body class="sclf"></body>
```

### Make sprites animate but without the floater

The floater is optional. If you want to put sprites all over the page and just
have them animate in place, just omit it. For example:

```html
<div class="sclf">
  <div class="bg sclf__sprite"></div>
  <div class="toy sclf__sprite--contain"></div>
</div>
```

### Animating the `<body>` itself.

You can animate the `<body>` itself by adding the `sclf__sprite` class thus
turning it into a sprite:

```html
<body class="sclf__sprite"></body>
```

```css
.sclf--enabled body {
  animation-name: bg;
}

/* Ensure the <html> has a proper flexible height. */
html {
  min-height: 100%;
}
```

[Back to top](#scrollerful)

## Contributing

Contributions are what make the open source community such an amazing place to
learn, inspire, and create. Any contributions you make are **greatly
appreciated**.

If you have a suggestion that would make this better, please fork the repo and
create a pull request. You can also simply open an issue with the tag
"enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

[Back to top](#scrollerful)

## License

Distributed under the ISC License. See `LICENSE.txt` for more information.

[Back to top](#scrollerful)

## Contact

Rémino Rem https://remino.net/

[Back to top](#scrollerful)
