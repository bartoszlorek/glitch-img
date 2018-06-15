import parseNode from './.utils/parse-node'
import loadImage from './.utils/load-image'
import BaseImage from './.internal/base-image'
import createDefs from './.internal/create-defs'

const defs = createDefs({
    wrapper: 'gi-wrapper',
    image: 'gi-image',
    clone: 'gi-clone'
})

function createGlitchImg(element) {
    let images = []

    parseNode(element).forEach(elem => {
        loadImage(elem, () => images.push(
            new BaseImage(elem, defs)
        ))
    })

    const self = {
        destroy: () => {
            images.forEach(image => image.destroy())
            images = null
            return null
        },

        update: () => {
            if (images != null) {
                let index = -1
                const length = images.length
                while (++index < length) {
                    images[index].update()
                }
            }
            return self
        }
    }

    return self
}

createGlitchImg.options = defs.options
export default createGlitchImg
