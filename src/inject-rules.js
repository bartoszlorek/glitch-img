const STYLE_ATTR = 'data-glitch-img'

const makeRules = spec => [
    `.${spec.wrapper}{
        position: relative;
        overflow: hidden;
        display: inline-block;
        vertical-align: top;
    }`,
    `.${spec.image}{
        display: block;
    }`,
    `.${spec.clone}{
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        -webkit-transform: translate(-2%, 0);
                transform: translate(-2%, 0);
    }`
]

function insertRules(sheet, rules) {
    rules.forEach((rule, index) => {
        sheet.insertRule(rule, index)
    })
}

function injectRules(spec) {
    const elem = document.createElement('style')
    document.head.appendChild(elem)

    insertRules(elem.sheet, makeRules(spec))
    elem.setAttribute(STYLE_ATTR, '')
    return elem
}

export default injectRules
