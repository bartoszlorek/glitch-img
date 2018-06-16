# glitch-img

Glitch image with random generated SVG clipping slices.

[demo](http://bartoszlorek.pl/run/glitch-img/)

## Initialization
```javascript
glitchImg(nodes)
```

## Methods
### update
```javascript
.update()
```
Regenerate clipping slices of `glitch-img` instance.

### destroy
```javascript
.destroy()
```
Remove all created elements and classes of `glitch-img` instance and destroy it.

## Examples
Convert all images to static glitch images...
```javascript
let glitch = glitchImg(document.querySelectorAll('img'))
```

then regenerate all clipping paths every 100 ms to achieve animation effect.
```javascript
setInterval(() => glitch.update(), 100)
```
