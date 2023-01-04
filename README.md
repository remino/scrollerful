Scrollerful
===========

By Rémino Rem <https://remino.net>

JavaScript library using CSS variables to animate elements while user scrolls.

[Demo](https://remino.github.io/scrollerful/)
| [Code](https://github.com/remino/scrollerful/)

- [About](#about)
	- [Built With](#built-with)
- [Getting Started](#getting-started)
	- [Installation](#installation)
- [Usage](#usage)
	- [Add scroll snapping](#add-scroll-snapping)
	- [Apply on full body](#apply-on-full-body)
- [To Do](#to-do)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)



## About

**Scrollerful** is a lightweight, dependency-free JavaScript library which uses CSS variables to help animate elements on a page as the user scrolls.

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

### Installation

Grab the bundled JavaScript file from the latest [release](https://github.com/remino/scrollerful/releases).

[Back to top](#scrollerful)



## Usage

**Step 1.** Add the JavaScript bundle file to your page.

Note only adding the file will start it automatically.

**Step 2.** Section your page and specify sprites to animate as below:

```html
<div class="scrollerful">
	<div class="scrollerful__tray">
		<div class="scrollerful__plate">
			<p class="scrollerful__sprite">Section 1</p>
		</div>
	</div>
	<div class="scrollerful__tray">
		<div class="scrollerful__plate">
			<p class="scrollerful__sprite">Section 2</p>
		</div>
	</div>
	<div class="scrollerful__tray">
		<div class="scrollerful__plate">
			<p class="scrollerful__sprite">Section 3</p>
		</div>
	</div>
</div>
```

**Step 3.** Define CSS animations for your sprites:

```css
@keyframes section-1 {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes section-2 {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(2);
	}
}

@keyframes section-3 {
	from {
		color: red;
	}
	to {
		color: blue;
	}
}

.scrollerful__tray:nth-child(1) > .scrollerful__plate > .scrollerful__sprite {
	animation-name: section-1;
}

.scrollerful__tray:nth-child(3) > .scrollerful__plate > .scrollerful__sprite {
	animation-name: section-2;
}

.scrollerful__tray:nth-child(3) > .scrollerful__plate > .scrollerful__sprite {
	animation-name: section-3;
}
```

**Step 4.** Enjoy the animations while your scroll!

### Add scroll snapping

On the `.scrollerful` element, adding the `.scrollerful--snap` class to it will snap scrolling to the next section.

### Apply on full body

If you want to add scroll snapping and use the entire page body as the main container, you can do so by adding the `.scrollerful` CSS class to `<body>` and add `.scrollerful__snap--page` to the `<html>` element. For example:

```html
<html class="scrollerful__snap--page">
	<head>
		<title>Scrollerful Example</title>
		<script src="scrollerful.js"></script>
	</head>
	<body class="scrollerful">
		<div class="scrollerful__tray">
			<div class="scrollerful__plate">
				<p class="scrollerful__sprite">Section 1</p>
			</div>
		</div>
		<div class="scrollerful__tray">
			<div class="scrollerful__plate">
				<p class="scrollerful__sprite">Section 2</p>
			</div>
		</div>
	</body>
</html>
```

[Back to top](#scrollerful)



## To Do

This library is mainly for personal purposes at the moment, but I'd like to expand on it for others to enjoy its benefits until browsers adopt standards to animate elements on scroll using CSS on its own. 

For others to feel more confident in using this, here are a few things to do:

- Add automated tests. (Not sure how to do that yet.)
- Add better documentation. (There are a few features this library does that is not documented here yet.)
- Add more examples.



## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

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

Rémino Rem
https://remino.net/

[Back to top](#scrollerful)



