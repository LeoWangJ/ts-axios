import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should read cookie', () => {
    document.cookie = 'foo=123'
    expect(cookie.read('foo')).toBe('123')
  })
  test('should return null if cookie name is not exist', () => {
    expect(cookie.read('bar')).toBeNull()
  })
})
