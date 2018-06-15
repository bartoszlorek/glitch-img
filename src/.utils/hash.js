import md5 from 'blueimp-md5'

function hash(value = '', length = 8) {
    return md5(value, Date.now()).slice(0, length)
}

export default hash
