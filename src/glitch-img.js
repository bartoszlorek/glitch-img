
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
        if (!( parent && parent.nodeType))
            return false;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function createClip(clipId) {
        var clips = document.getElementById('glitch-img-clips'),
            clipPath,
            defs;

        if (clips === null) {
            clips = createElement('svg', {
                xmlns: 'ns:svg',
                id: 'glitch-img-clips'
            }, 'ns:svg');

            defs = createElement('defs', null, 'ns:svg');
            clips.appendChild(defs);
            document.body.appendChild(clips);

        } else {
            defs = clips.childNodes[0];
        }
        for (var i=0, currentClip; i<defs.childNodes.length; i++) {
            currentClip = defs.childNodes[i];
            if (parseInt(currentClip.id.split('-').pop()) === clipId)
                return currentClip;
        }
        clipPath = createElement('clipPath', {
            id: 'glitch-img-clip-' + clipId
        }, 'ns:svg');
        defs.appendChild(clipPath);
        return clipPath;
    }

    function wrapImage(img, clipId, classes) {
        var wrap, svg, imgSvg;

        if (img.className.indexOf('glitch-img-src') !== -1) {
            imgSvg = img.nextSibling.childNodes[0];
            imgSvg.setAttribute('clip-path',
                'url(#glitch-img-clip-'+ clipId +')');
            return imgSvg;
        }

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

        svg.appendChild(imgSvg);
        wrap.appendChild(svg);

        img.className += ' glitch-img-src';
        img.parentNode.insertBefore(wrap, img);
        wrap.insertBefore(img, svg);
        return imgSvg;
    }

    var lastId = 0;
    function GlitchImg(image) {
        this.clipId = lastId++;
        this.images = [];
        this.add(image);
        return this;
    }

    GlitchImg.prototype = {
        add: function(element) {
            var newImages = selector(element),
                lastIndex = this.images.length,
                index, img, imgSvg;

            for (var i=0; i<newImages.length; i++) {
                img = newImages[i];
                imgSvg = wrapImage(img, this.clipId);
                index = lastIndex + i;

                this.images[index] = {
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
                })(this, index, img);
            }
            return this;
        },

        remove: function() {
            // don't change order or images items
            // instead set null or something
        },

        clip: function() {
            if (typeof this.clipPath !== 'undefined') {
                return this;
            }
            this.clipPath = createClip(this.clipId);
            this.update();
            return this;
        },

        refresh: function(element) {
            var toRefresh,
                clipWidth = 100,
                clipHeight = 100,
                image;

            for (i=0; i<this.images.length; i++) {
                if (this.images[i].img === element ||
                   (typeof element === 'number' && element === i)) {
                    toRefresh = [this.images[i]];
                    break;
                }
            }
            if (typeof toRefresh === 'undefined') {
                toRefresh = this.images;
            }
            for (var i=0; i<toRefresh.length; i++) {
                toRefresh[i]
                    .imgSvg
                    .parentNode
                    .setAttribute(
                        'viewBox', '0 0 '+
                        toRefresh[i].width +' '+
                        toRefresh[i].height
                    );
            }
            for (var i=0; i<this.images.length; i++) {
                image = this.images[i];
                clipWidth = Math.max(image.width, clipWidth);
                clipHeight = Math.max(image.height, clipHeight); 
            }
            this.clipWidth = clipWidth;
            this.clipHeight = clipHeight;
            this.update();
            return this;
        },

        update: function() {
            this.clip();
            var clipWidth = this.clipWidth || 100,
                clipHeight = this.clipHeight || 100,
                rectMaxHeight = clipHeight * .3,
                rectOffset = 0,
                rectHeight,
                rects;

            if (! this.images.length) {
                return this;
            }
            removeChildren(this.clipPath);
            rects = document.createDocumentFragment();

            while ( rectOffset <= clipHeight ) {
                rectHeight = Math.round(randomBiased(.01) * rectMaxHeight);
                rectOffset += Math.round(randomBiased(.01) * rectMaxHeight) + rectHeight;
                rects.appendChild(
                    createElement('rect', {
                        x: [null, '0'],
                        y: [null, rectOffset],
                        height: [null, rectHeight],
                        width: [null, clipWidth]
                    }, 'ns:svg')
                );
            }
            this.clipPath.appendChild(rects);
            return this;
        }
    }

    return GlitchImg;

});