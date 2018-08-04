import hash from '../src/.utils/hash'

global.Date = {
    now: jest.fn(() => 1533396218412)
}

it('should return string', () => {
    expect(typeof hash()).toBe('string')
    expect(typeof hash(null)).toBe('string')
    expect(typeof hash('')).toBe('string')
    expect(typeof hash('sdf')).toBe('string')
})

it('should return hashed string with 8 chars (default)', () => {
    expect(hash()).toBe('589722cb')
    expect(hash(null)).toBe('589722cb')
    expect(hash('')).toBe('589722cb')
    expect(hash('sdf')).toBe('87abd571')
    expect(hash('sidoi7sdjfnsdc98ydsf86hidng')).toBe('4761aae3')
    expect(hash('hello world!')).toBe('59d326f3')
})

it('should return hashed string with 4 chars', () => {
    expect(hash(null, 4)).toBe('5897')
    expect(hash('', 4)).toBe('5897')
    expect(hash('', 4, 0)).toBe('0000')
    expect(hash('sdf', 4)).toBe('87ab')
    expect(hash('sidoi7sdjfnsdc98ydsf86hidng', 4)).toBe('4761')
    expect(hash('hello world!', 4)).toBe('59d3')
})

it('should accept hash seed', () => {
    const string = 'hello world!'
    const hashed = hash(string, 8)
    const seeded = hash(string, 8, 1234)
    expect(hashed).toBe('59d326f3')
    expect(seeded).toBe('2fe8e919')
    expect(hashed).not.toBe(seeded)
})
