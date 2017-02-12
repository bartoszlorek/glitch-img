
define( [], function () {

    function randomBiased(bias, influence) {
        var mix = Math.random() * (influence || 1);
        return Math.random() * (1 - mix) + bias * mix;
    }

    function selector(element) {
        var output = [];

        if (! (typeof element === 'string'
            || typeof element === 'object' && element !== null)) {
            return output;
        }
        if (typeof element === 'string') {
            if (element[0] === '.') {
                element = document.getElementsByClassName(element.slice(1));
                if (element.length) output = Array.prototype.slice.call(element);

            } else if (element[0] === '#') {
                element = document.getElementById(element.slice(1));
                if (element !== null) output = [element];
            }
            return output;
        } 
        if (element.nodeType) {
            return [element];
        }
        return Array.prototype.slice.call(element);
    }

    function applyNamespace(name) {
        var namespaces = {
            'ns:svg': 'http://www.w3.org/2000/svg',
            'ns:xlink': 'http://www.w3.org/1999/xlink',
            'ns:xmlns': 'http://www.w3.org/2000/xmlns/'
        };
        if (typeof name === 'string'
        &&  name.substring(0, 3) === 'ns:') {
            name = namespaces[name];
        }
        return name;
    }

    function createElement(tag, attrs, namespace) {
        var element = typeof namespace === 'undefined'
                ? document.createElement(tag)
                : document.createElementNS(
                    applyNamespace(namespace), tag),
            key, value;

        for (key in attrs) {
            value = attrs[key];
            if (value.constructor === Array) {
                element.setAttributeNS(
                    applyNamespace(value[0]), key,
                    applyNamespace(value[1])
                );
            } else element.setAttribute(key,
                applyNamespace(value));
        }
        return element;
    }

    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function wrapImage(img, clipId, classes) {
        var wrap, svg, imgSvg;
        
        classes = classes && ' ' + classes || '';
        wrap = createElement('div', {
            'class': 'glitch-img-wrap' + classes
        });

        svg = createElement('svg', {
            'class': 'glitch-img-svg',
            'preserveAspectRatio': [null, 'none'],
            'xmlns:xlink': ['ns:xmlns', 'ns:xlink']
        }, 'ns:svg');

        imgSvg = createElement('image', {
            'xlink:href': ['ns:xlink', img.src],
            'clip-path': 'url(#glitch-img-clip-'+ clipId +')',
            'width': [null, '100%'],
            'height': [null, '100%']
        }, 'ns:svg');

        img.parentNode.insertBefore(wrap, img);
        img.className += ' glitch-img-src';

        svg.appendChild(imgSvg);
        wrap.appendChild(img);
        wrap.appendChild(svg);
        return imgSvg;
    }

    var lastId = 0;
    function GlitchImg(image) {
        this.clipId = (lastId++);
        this.images = [];
        this.add(image);
        return this;
    }

    GlitchImg.prototype = {
        refresh: function(img) {
            var current,
                image, i,
                svg;

            for (i=0; i<this.images.length; i++) {
                if (this.images[i].img === img ||
                   (typeof img === 'number' && img === i)) {
                    current = [this.images[i]];
                    break;
                }
            }
            if (typeof current === 'undefined') {
                current = this.images;
            }
            for (i=0; i<current.length; i++) {
                svg = current[i].imgSvg.parentNode;
                svg.setAttribute('viewBox', '0 0 '+
                    current[i].width +' '+
                    current[i].height
                );
            }
            this.update();
        },

        add: function(element) {
            var newImages = selector(element),
                img, imgSvg;

            for (var i=0; i<newImages.length; i++) {
                img = newImages[i];
                imgSvg = wrapImage(img, this.clipId);
                
                this.images[i] = {
                    img: img,
                    imgSvg: imgSvg,
                    width: 0,
                    height: 0
                };
                (function(self, index, img) {
                    var temp = new Image();
                    temp.onload = function() {
                        self.images[index].width = temp.width;
                        self.images[index].height = temp.height;
                        self.refresh(img);
                    };
                    temp.src = img.src;
                })(this, i, img);
            }
            return this;
        },

        clip: function() {
            var clips, defs;

            if (typeof this.clipPath !== 'undefined') {
                return this;
            }
            if ((clips = document.getElementById('glitch-img-clips')) === null) {
                clips = createElement('svg', {
                    xmlns: 'ns:svg',
                    id: 'glitch-img-clips'
                }, 'ns:svg');

                defs = createElement('defs', null, 'ns:svg');
                document.body.appendChild(clips);
                clips.appendChild(defs);
                
            } else {
                defs = clips.children[0];
            }
            this.clipPath = createElement('clipPath', {
                id: 'glitch-img-clip-' + this.clipId
            }, 'ns:svg');
            defs.appendChild(this.clipPath);
            this.update();
        },

        update: function() {
            this.clip();
            var imageWidth = 100,
                imageHeight = 100,
                rectOffset = 0,
                rectHeight,
                rectMaxHeight,
                rect,
                image;

            if (! this.images.length) {
                return this;
            }
            for (var i=0; i<this.images.length; i++) {
                image = this.images[i];
                imageWidth = Math.max(image.width, imageWidth);
                imageHeight = Math.max(image.height, imageHeight); 
            }
            removeChildren(this.clipPath);
            rectMaxHeight = imageHeight * .3;

            while ( rectOffset <= imageHeight ) {
                rectHeight = Math.round(randomBiased(.01) * rectMaxHeight);
                rectOffset += Math.round(randomBiased(.01) * rectMaxHeight) + rectHeight;
                rect = createElement('rect', {
                    x: [null, '0'],
                    y: [null, rectOffset],
                    height: [null, rectHeight],
                    width: [null, imageWidth]
                }, 'ns:svg');
                this.clipPath.appendChild(rect);
            }
            console.log(this);
        }
    }

    return GlitchImg;

});