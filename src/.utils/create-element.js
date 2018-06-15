export const NS_SVG = 'http://www.w3.org/2000/svg'
export const NS_XLINK = 'http://www.w3.org/1999/xlink'
export const NS_XMLNS = 'http://www.w3.org/2000/xmlns/'

function createElement(tagName, attrs, namespace) {
    const element = namespace !== undefined
        ? document.createElementNS(namespace, tagName)
        : document.createElement(tagName)

    if (attrs != null) {
        let name, value
        for (name in attrs) {
            value = attrs[name]

            if (Array.isArray(value)) {
                element.setAttributeNS(value[0] || null, name, value[1])
            } else {
                element.setAttribute(name, value)
            }
        }
    }
    return element
}

export default createElement
