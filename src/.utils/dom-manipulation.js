export function removeChildren(elem) {
    if (elem == null) {
        return null
    }
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
    return elem
}
