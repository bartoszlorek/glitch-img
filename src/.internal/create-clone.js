import createElement, { NS_SVG, NS_XLINK, NS_XMLNS } from '../.utils/create-element'

function createClone(spec = {}) {
    const svg = createElement('svg', {
        'xmlns:xlink': [NS_XMLNS, NS_XLINK],
        'preserveAspectRatio': [null, 'none'],
        'viewBox': `0 0 ${spec.width} ${spec.height}`,
        'class': spec.class
    }, NS_SVG)

    const image = createElement('image', {
        'clip-path': `url(#${spec.id})`,
        'href': [NS_XLINK, spec.src],
        'width': [null, '100%'],
        'height': [null, '100%']
    }, NS_SVG)

    svg.appendChild(image)
    return svg
}

export default createClone
