import BaseImage from '../src/.internal/base-image'
import { randomness } from './.test-utils'

let defs
beforeEach(() => {
    defs = {
        classes: {
            wrapper: 'wrapper',
            image: 'image',
            clone: 'clone'
        },
        element: document.createElement('defs'),
        hashId: () => 'hashId'
    }

    global.Math.random = randomness(20)
})

it('should create new instance with methods', () => {
    document.body.innerHTML = `<div><img src="path"/></div>`
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)

    expect(instance).toEqual(
        expect.objectContaining({
            element: expect.any(HTMLImageElement),
            clipPath: expect.any(SVGElement),
            width: 100,
            height: 100,
            defs,
            // prototype
            destroy: expect.any(Function),
            update: expect.any(Function)
        })
    )
})

it('should wrap new div around image', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)
    const parent = image.parentElement

    expect(parent.tagName.toLowerCase()).toBe('div')
    expect(parent.className).toBe('wrapper')
})

it('should clone image as svg-image', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)
    const sibling = image.nextSibling

    expect(sibling.tagName.toLowerCase()).toBe('svg')
    expect(sibling.firstChild.tagName.toLowerCase()).toBe('image')
    expect(sibling.firstChild.getAttribute('href')).toBe('path')
})

it('should create own clipPath', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)

    expect(defs.element.firstChild).toBe(instance.clipPath)
})

it('should add clipping reacts to the own clipPath', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)

    expect(instance.clipPath.children.length).toBe(9)
    expect(instance.clipPath.firstChild.tagName.toLowerCase()).toBe('rect')
})

it('should update own clipping reacts', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const image = document.querySelector('img')

    global.Math.random = randomness(12)
    const instance = new BaseImage(image, defs)
    expect(instance.clipPath.children.length).toBe(8)

    global.Math.random = randomness(34)
    instance.update()
    expect(instance.clipPath.children.length).toBe(10)
})

it('should be able to self destroy', () => {
    document.body.innerHTML = `<main><img src="path"/></main>`
    const main = document.querySelector('main')
    const image = document.querySelector('img')
    const instance = new BaseImage(image, defs)

    expect(instance.element).toBe(image)
    expect(main.firstChild.className).toBe('wrapper')

    instance.destroy()
    expect(instance.element).toBe(null)
    expect(main.firstChild).toBe(image)
})
