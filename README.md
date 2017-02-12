# Glitch Image

Glitch Image with random generated SVG clipPath and CSS Animation. By default hover on element plays css animation, but this effect can be override by another style.

## Usage
Single instance of `GlitchImg` can handle multiple images, but it's important to remember that density of clipPath is as big as biggest image's width and height. Small images sharing one instance with big can suffer from to oversized clippings paths. To achieve multiple images with different clipping pattern (generated randomly) use multiple instances.

Images passing as `selector` are added after initialize, but aren't required. It can be `id`, `class` or event html elements.

```
new GlitchImg( [selector] )
```

Basic method to add more images, accepts similar parameters like `selector` above.

```
.add( [selector] )
```

Randomly regenerate clipping paths. Call inside `interval` function to animate glitch effect.

```
.update()
```

Basically refresh images and assign their dimensions to other elements. Passing `img` element or index of `.images` can refresh only specific image, but leaving undefined works on all.

```
.refresh( [image] )
```

## Examples

Simple convert images to static glitched images.

```javascript
// multiple images with different clipPaths
var glitch1 = new GlitchImg('#glitch1'),
    glitch2 = new GlitchImg('#glitch2'),
    glitch2 = new GlitchImg('#glitch3');
    
// multiple images with same clipPath
var glitches = new GlitchImg('.glitch');
```

Add images after while.

```javascript
var glitches = new GlitchImg();

// could be instance's parameter
glitches.add('#glitch1');

// 2 seconds and we have the rest
setTimeout(function() {
    glitch
        .add('#glitch2')
        .add('#glitch3');
}, 2000);
```

Generate clipping paths every 100 ms to achieve effect of animation.

```javascript
var glitch = new GlitchImg('#glitch1');

setInterval(function() {
    glitch.update();
}, 100);
```
