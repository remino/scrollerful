# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-04-14

If you were using any version before 1.0.0, there are numerous breaking changes:

- The `scrollerful` prefix has been shortened to `sclf`. This affects CSS class names, JavaScript functions and events. See below for a list.
- The top element wrapping all containers is no longer needed.
- Nomenclature of `inner` and `outer` sprites has been changed to `contain` and `cover`, respectively, matching upcoming CSS standards.
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
const { detail: { progress: { inner, outer } } } = event;

/* ✅ Now */
const { detail: { progress: { contain, cover } } } = event;
```

### Changed

- Upgrade dependencies: Ruby 3.2.1, Middleman, etc.

### Removed

- Unused normalize.css file.
- Identical links assigned in each translation file.
- Duplicate index file for the english version.

## 0.6.4 - 2023-04-09

See git commit history for details on this release and previous ones.

[1.0.0]: https://github.com/remino/scrollerful/compare/v1.0.0...v0.6.4
[0.6.4]: https://github.com/remino/scrollerful/releases/tag/v0.6.4
