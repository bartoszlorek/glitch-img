import createElement, { NS_SVG } from '../.utils/create-element'
import hash from '../.utils/hash'
import injectRules from '../inject-rules'

function createDefs(classes = {}) {
    let id = 0
    const root = createElement('svg', { xmlns: NS_SVG }, NS_SVG)
    const defs = createElement('defs', null, NS_SVG)

    root.appendChild(defs)
    document.body.appendChild(root)
    let injected = injectRules(classes)

    return {
        classes,
        element: defs,

        hashId: () => {
            return 'gi-' + hash('glitch' + id++, 10)
        },

        options: spec => {
            if (spec == null) {
                return
            }
            let changes = 0
            Object.keys(spec).forEach(prop => {
                if (classes[prop] && spec[prop] !== classes[prop]) {
                    classes[prop] = spec[prop]
                    changes++
                }
            })
            if (changes > 0) {
                document.head.removeChild(injected)
                injected = injectRules(classes)
            }
        }
    }
}

export default createDefs
