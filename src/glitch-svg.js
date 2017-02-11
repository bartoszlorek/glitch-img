
define( [], function () {

    function getArgument(args, type, index, failure) {
        var value, temp;

        if (typeof type !== 'string' && type !== '') {
            throw 'getArgument function needs type!';
        }
        if (typeof index === 'number') {
            temp = index < 0
                ? args[args.length + index]
                : args[index];
            if (typeof temp === type)
                value = temp;

        } else if (index.constructor === Array) {
            temp = args
                .slice(index)
                .filter(function(arg) {
                    return typeof arg === type;
                });
            if (temp.length > 0)
                value = temp[0];

        } else throw 'getArgument function needs index!';
        return typeof value === 'undefined'
            ? failure
            : value;
    }

    function randomBiased(bias, influence) {
        var mix = Math.random() * (influence || 1);
        return Math.random() * (1 - mix) + bias * mix;
    }

    function appendChild(parent, childTag, childAttrs) {
        var child = document.createElementNS('http://www.w3.org/2000/svg', childTag),
            key, value;

        for (key in childAttrs) {
            value = childAttrs[key];
            if (value.constructor === Array)
                 child.setAttributeNS(value[0], key, value[1]);
            else child.setAttribute(key, value);
        }
        parent.appendChild(child);
        return child;
    }

    function removeChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    var lastId = -1;

    function GlitchSVG() {
        this.images = {};
        this.clip();
        return this;
    }

    GlitchSVG.prototype = {
        clip: function() {
            if (typeof this.clipPath !== 'undefined') {
                return this;
            }
            var svg = appendChild(document.body, 'svg', {
                'class': 'glitch-svg-clip',
                'xmlns': 'http://www.w3.org/2000/svg'
            }),
                defs = appendChild(svg, 'defs');
            this.clipPath = appendChild(defs, 'clipPath', {
                id: 'glitch-svg-clip-' + (lastId+1)
            });
            this.update();
        },

        update: function() {
            this.clip();
            var glitchWidth = 100,
                glitchHeight = 100,
                rectMaxHeight = glitchHeight * .3,
                rect,
                rectOffset = 0,
                rectHeight = 0;

            removeChildren(this.clipPath);
            while ( rectOffset <= glitchHeight ) {
                rectHeight = Math.round(randomBiased(.01) * rectMaxHeight);
                rectOffset += Math.round(randomBiased(.01) * rectMaxHeight) + rectHeight;
                appendChild(this.clipPath, 'rect', {
                    x: [null, '0'],
                    y: [null, rectOffset],
                    height: [null, rectHeight],
                    width: [null, glitchWidth]
                });
            }
            console.log('update', this);
        },

        add: function(element) {
            var svg = typeof element === 'string'
                    ? document.getElementById(element)
                    : element,
                img,
                lines;

            if (! (svg
                && svg.tagName
                && svg.tagName.toLowerCase() === 'svg')) {
                return this;
            }

            console.log(svg);
        }
    }

    return GlitchSVG;

});