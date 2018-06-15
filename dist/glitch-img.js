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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var md5 = createCommonjsModule(function (module) {
(function ($) {

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xffff) + (y & 0xffff);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32);
    x[((len + 64) >>> 9 << 4) + 14] = len;

    var i;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (i = 0; i < x.length; i += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;

      a = md5ff(a, b, c, d, x[i], 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = md5ii(a, b, c, d, x[i], 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i;
    var output = '';
    var length32 = input.length * 32;
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i;
    var output = [];
    output[(input.length >> 2) - 1] = undefined;
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0;
    }
    var length8 = input.length * 8;
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i;
    var bkey = rstr2binl(key);
    var ipad = [];
    var opad = [];
    var hash;
    ipad[15] = opad[15] = undefined;
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8);
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef';
    var output = '';
    var x;
    var i;
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (typeof undefined === 'function' && undefined.amd) {
    undefined(function () {
      return md5
    });
  } else if (module.exports) {
    module.exports = md5;
  } else {
    $.md5 = md5;
  }
})(commonjsGlobal);
});

function hash() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

    return md5(value, Date.now()).slice(0, length);
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
