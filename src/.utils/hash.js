function hash(string = '', length = 8, seed) {
    const strLength = string != null ? string.length : 0
    let hval = typeof seed === 'number' ? seed : Date.now(),
        hstr = '',
        factor = 1

    for (let index = 0; index < strLength; index++) {
        hval ^= string.charCodeAt(index)
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
    }

    hval = hval >>> 0
    while (hstr.length < length) {
        hstr += (hval * factor).toString(16)
        factor += 1
    }

    return hstr.substr(0, length)
}

export default hash
