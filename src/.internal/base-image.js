import randomBiased from '../.utils/random-biased'
import createElement, { NS_SVG } from '../.utils/create-element'
import { hasClass, addClass, removeClass } from '../.utils/class-polyfill'
import { removeChildren } from '../.utils/dom-manipulation'
import createClone from './create-clone'

function BaseImage(element, defs) {
    if (!(element && element.src) || hasClass(element, defs.classes.image)) {
        return (this.element = null)
    }

    const id = defs.hashId()
    this.element = element
    this.width = element.naturalWidth || 100
    this.height = element.naturalHeight || 100
    this.defs = defs

    addClass(element, defs.classes.image)
    const wrapper = createElement('div', {
        class: defs.classes.wrapper
    })
    const clone = createClone({
        src: element.src,
        width: this.width,
        height: this.height,
        class: defs.classes.clone,
        id
    })

    element.parentElement.insertBefore(wrapper, element)
    wrapper.appendChild(element)
    wrapper.appendChild(clone)

    this.clipPath = createElement('clipPath', { id }, NS_SVG)
    defs.element.appendChild(this.clipPath)
    this.update()
}

BaseImage.prototype = {
    destroy: function() {
        if (this.element != null) {
            removeClass(this.element, this.defs.classes.image)
            const wrapper = this.element.parentElement

            wrapper.parentElement.insertBefore(this.element, wrapper)
            wrapper.parentElement.removeChild(wrapper)
            this.defs.element.removeChild(this.clipPath)

            this.element = null
            this.clipPath = null
            this.defs = null
        }
        return null
    },

    update: function() {
        if (this.element == null) {
            return this
        }
        let rectMaxHeight = this.height * 0.3,
            rectOffset = 0,
            rectHeight,
            rects

        removeChildren(this.clipPath)
        rects = document.createDocumentFragment()

        while (rectOffset <= this.height) {
            rectHeight = Math.round(randomBiased(0.01) * rectMaxHeight)
            rectOffset += Math.round(randomBiased(0.01) * rectMaxHeight)
                + rectHeight

            rects.appendChild(
                createElement('rect', {
                    x: [null, '0'],
                    y: [null, rectOffset],
                    height: [null, rectHeight],
                    width: [null, this.width]
                }, NS_SVG)
            )
        }
        this.clipPath.appendChild(rects)
        return this
    }
}

export default BaseImage
