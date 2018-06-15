import createClone from '../src/.internal/create-clone'

const clone = createClone({
    src: 'path',
    width: 800,
    height: 600,
    class: 'clone',
    id: 'hashId'
})

it('should return svg element', () => {
    expect(clone.tagName.toLowerCase()).toBe('svg')
    expect(clone.getAttribute('class')).toBe('clone')
    expect(clone.getAttribute('viewBox')).toBe('0 0 800 600')
})

it('svg should contain image', () => {
    expect(clone.firstChild.tagName.toLowerCase()).toBe('image')
    expect(clone.firstChild.getAttribute('href')).toBe('path')
    expect(clone.firstChild.getAttribute('clip-path')).toBe('url(#hashId)')
})
