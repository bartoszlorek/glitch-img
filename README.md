# glitch-img
Glitch image with random generated SVG clipping paths.

[demo](http://bartoszlorek.pl/run/glitch-img/)

## Initialization
```javascript
glitchImg(image)  // one element or an array of them
```

## Methods
```javascript
.update()   // regenerate clipping paths of given instance
.destroy()  // destroy instance by removing created elements and classes
```

## Example
```javascript
// convert all images to static glitch images
let glitch = glitchImg(document.querySelectorAll('img'))

// regenerate all clips every 100 ms to achieve animation effect
setInterval(() => glitch.update(), 100)
```
