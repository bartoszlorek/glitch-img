'use strict';

function parseNode(node) {
    if (node == null) {
        return [];
    }
    if (node.length !== undefined) {
        return Array.prototype.slice.call(node);
    }
    return [node];
}

function loadImage(source, callback) {
    if (source == null || callback == null) {
        return;
    }
    if (source.complete) {
        callback(source, source.naturalWidth, source.naturalHeight);
    } else {
        var path = source.src || source;
        if (typeof path !== 'string') {
            return;
        }
        var image = new Image();
        image.onload = function () {
            callback(source, image.naturalWidth, image.naturalHeight);
        };
        image.src = path;
    }
}

function randomBiased(bias, influence) {
    var mix = Math.random() * (influence || 1);
    return Math.random() * (1 - mix) + bias * mix;
}

var NS_SVG = 'http://www.w3.org/2000/svg';
var NS_XLINK = 'http://www.w3.org/1999/xlink';
var NS_XMLNS = 'http://www.w3.org/2000/xmlns/';

function createElement(tagName, attrs, namespace) {
    var element = namespace !== undefined ? document.createElementNS(namespace, tagName) : document.createElement(tagName);

    if (attrs != null) {
        var name = void 0,
            value = void 0;
        for (name in attrs) {
            value = attrs[name];

            if (Array.isArray(value)) {
                element.setAttributeNS(value[0] || null, name, value[1]);
            } else {
                element.setAttribute(name, value);
            }
        }
    }
    return element;
}

var classToArray = function classToArray(value) {
    return typeof value === 'string' ? value.split(/\s+/) : value || [];
};

function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    } else {
        return !!(element.className.indexOf(className) > -1);
    }
}

function addClass(element, className) {
    var classes = classToArray(className);
    if (element.classList) {
        element.classList.add.apply(element.classList, classes);
    } else {
        var result = element.className;
        for (var i = 0; i < classes.length; i++) {
            if (result.indexOf(classes[i]) < 0) {
                result += ' ' + classes[i];
            }
        }
        element.className = result;
    }
}

function removeClass(element, className) {
    var classes = classToArray(className);
    if (element.classList) {
        element.classList.remove.apply(element.classList, classes);
    } else {
        var current = classToArray(element.className),
            result = '';
        for (var i = 0; i < current.length; i++) {
            if (classes.indexOf(current[i]) < 0) {
                result += ' ' + current[i];
            }
        }
        element.className = result.substring(1);
    }
}

function removeChildren(elem) {
    if (elem == null) {
        return null;
    }
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
    return elem;
}

function createClone() {
    var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var svg = createElement('svg', {
        'xmlns:xlink': [NS_XMLNS, NS_XLINK],
        'preserveAspectRatio': [null, 'none'],
        'viewBox': '0 0 ' + spec.width + ' ' + spec.height,
        'class': spec.class
    }, NS_SVG);

    var image = createElement('image', {
        'clip-path': 'url(#' + spec.id + ')',
        'href': [NS_XLINK, spec.src],
        'width': [null, '100%'],
        'height': [null, '100%']
    }, NS_SVG);

    svg.appendChild(image);
    return svg;
}

function BaseImage(element, defs) {
    if (!(element && element.src) || hasClass(element, defs.classes.image)) {
        return this.element = null;
    }

    var id = defs.hashId();
    this.element = element;
    this.width = element.naturalWidth || 100;
    this.height = element.naturalHeight || 100;
    this.defs = defs;

    addClass(element, defs.classes.image);
    var wrapper = createElement('div', {
        class: defs.classes.wrapper
    });
    var clone = createClone({
        src: element.src,
        width: this.width,
        height: this.height,
        class: defs.classes.clone,
        id: id
    });

    element.parentElement.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    wrapper.appendChild(clone);

    this.clipPath = createElement('clipPath', { id: id }, NS_SVG);
    defs.element.appendChild(this.clipPath);
    this.update();
}

BaseImage.prototype = {
    destroy: function destroy() {
        if (this.element != null) {
            removeClass(this.element, this.defs.classes.image);
            var wrapper = this.element.parentElement;

            wrapper.parentElement.insertBefore(this.element, wrapper);
            wrapper.parentElement.removeChild(wrapper);
            this.defs.element.removeChild(this.clipPath);

            this.element = null;
            this.clipPath = null;
            this.defs = null;
        }
        return null;
    },

    update: function update() {
        if (this.element == null) {
            return this;
        }
        var rectMaxHeight = this.height * 0.3,
            rectOffset = 0,
            rectHeight = void 0,
            rects = void 0;

        removeChildren(this.clipPath);
        rects = document.createDocumentFragment();

        while (rectOffset <= this.height) {
            rectHeight = Math.round(randomBiased(0.01) * rectMaxHeight);
            rectOffset += Math.round(randomBiased(0.01) * rectMaxHeight) + rectHeight;

            rects.appendChild(createElement('rect', {
                x: [null, '0'],
                y: [null, rectOffset],
                height: [null, rectHeight],
                width: [null, this.width]
            }, NS_SVG));
        }
        this.clipPath.appendChild(rects);
        return this;
    }
};

function hash() {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
    var seed = arguments[2];

    var strLength = string != null ? string.length : 0;
    var hval = typeof seed === 'number' ? seed : Date.now(),
        hstr = '',
        multiplicand = 1;

    for (var index = 0; index < strLength; index++) {
        hval ^= string.charCodeAt(index);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }

    hval = hval >>> 0;
    while (hstr.length < length) {
        hstr += (hval * multiplicand++).toString(16);
    }

    return hstr.substr(0, length);
}

var STYLE_ATTR = 'data-glitch-img';

var makeRules = function makeRules(spec) {
    return ['.' + spec.wrapper + '{\n        position: relative;\n        overflow: hidden;\n        display: inline-block;\n        vertical-align: top;\n    }', '.' + spec.image + '{\n        display: block;\n    }', '.' + spec.clone + '{\n        position: absolute;\n        top: 0; left: 0;\n        width: 100%; height: 100%;\n        -webkit-transform: translate(-2%, 0);\n                transform: translate(-2%, 0);\n    }'];
};

function insertRules(sheet, rules) {
    rules.forEach(function (rule, index) {
        sheet.insertRule(rule, index);
    });
}

function injectRules(spec) {
    var elem = document.createElement('style');
    document.head.appendChild(elem);

    insertRules(elem.sheet, makeRules(spec));
    elem.setAttribute(STYLE_ATTR, '');
    return elem;
}

function createDefs() {
    var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var id = 0;
    var root = createElement('svg', { xmlns: NS_SVG }, NS_SVG);
    var defs = createElement('defs', null, NS_SVG);

    root.appendChild(defs);
    document.body.appendChild(root);
    var injected = injectRules(classes);

    return {
        classes: classes,
        element: defs,

        hashId: function hashId() {
            return 'gi-' + hash('glitch' + id++, 10);
        },

        options: function options(spec) {
            if (spec == null) {
                return;
            }
            var changes = 0;
            Object.keys(spec).forEach(function (prop) {
                if (classes[prop] && spec[prop] !== classes[prop]) {
                    classes[prop] = spec[prop];
                    changes++;
                }
            });
            if (changes > 0) {
                document.head.removeChild(injected);
                injected = injectRules(classes);
            }
        }
    };
}

var defs = createDefs({
    wrapper: 'gi-wrapper',
    image: 'gi-image',
    clone: 'gi-clone'
});

function createGlitchImg(element) {
    var images = [];

    parseNode(element).forEach(function (elem) {
        loadImage(elem, function () {
            return images.push(new BaseImage(elem, defs));
        });
    });

    var self = {
        destroy: function destroy() {
            images.forEach(function (image) {
                return image.destroy();
            });
            images = null;
            return null;
        },

        update: function update() {
            if (images != null) {
                var index = -1;
                var length = images.length;
                while (++index < length) {
                    images[index].update();
                }
            }
            return self;
        }
    };

    return self;
}

createGlitchImg.options = defs.options;

module.exports = createGlitchImg;
