## Make any element respond to scroll!

Install [Scrollerful from npm](https://www.npmjs.com/package/scrollerful) or use
it from CDN like below, add the `.sclf` structure to your markup, then start it.
Scrollerful supplies the progress values that drive your CSS animations.

```html
<section class="sclf">
    <div class="sclf__float">
        <output class="progress">0%</output>
    </div>
</section>

<script
    defer
    src="https://unpkg.com/scrollerful@1.2.1/dist/scrollerful-auto.min.js"></script>

<script>
    const scene = document.querySelector('.sclf')
    const progress = document.querySelector('.progress')

    scene.addEventListener('sclf:scroll', ({ detail }) => {
        progress.textContent = `${Math.round(detail.progress.contain * 100)}%`
    })
</script>
```

See the [README on GitHub](https://github.com/remino/scrollerful) for markup,
CSS animation, and CDN examples.
