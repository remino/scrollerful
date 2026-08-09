# CHANGELOG

<!-- mtoc-start -->

- [HEAD](#head)
- [v1.2.2](#v122)
- [v1.0.0](#v100)
- [v0.6.4](#v064)

<!-- mtoc-end -->

## HEAD

## v1.2.2

- Fixed
    - Measure the document’s full scroll size so horizontal page scrolling has
      accurate animation progress.

## v1.0.0

If you were using any version before 1.0.0, there are numerous breaking changes:

- The `scrollerful` prefix has been shortened to `sclf`. This affects CSS class
  names, JavaScript functions and events. See below for a list.
- The top element wrapping all containers is no longer needed.
- Nomenclature of `inner` and `outer` sprites has been changed to `contain` and
  `cover`, respectively, matching upcoming CSS standards.
- Event names have been changed to match the new prefix and have colons in them.
- Addition of rudimentary `animation-timeline` support.

### Updated CSS classes

```
.scrollerful                -> (Removed. No longer necessary.)
.scrollerful__tray          -> .sclf
.scrollerful__plate         -> .sclf__float
.scrollerful__sprite--inner -> .sclf__sprite--contain
.scrollerful__sprite--outer -> .sclf__sprite--cover
.scrollerful--enabled       -> .sclf--enabled
```

### Updated JS events names

```
scrollerfulinnerenter -> sclf:contain:enter
scrollerfulouterexit  -> sclf:contain:exit
scrollerfulinnerenter -> sclf:cover:enter
scrollerfulouterexit  -> sclf:cover:exit
scrollerfulscroll     -> sclf:scroll
```

### Updated JS event details

```js
/* 🚫 Before */
const {
    detail: {
        progress: { inner, outer },
    },
} = event

/* ✅ Now */
const {
    detail: {
        progress: { contain, cover },
    },
} = event
```

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version.

## v0.6.4

See git commit history for details on this release and previous ones.
