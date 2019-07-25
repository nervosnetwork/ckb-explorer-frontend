import { lastPathOfUrl } from '../src/utils/uri'

describe('Uri methods tests', () => {

  it('last path of uri', async () => {
    expect(lastPathOfUrl('https://explorer.nervos.org/address/ckt1q9gry5zgfg6x29ak0zpfm44kfduhz9l9c0d7guwrmp9dy3?page=2&size=10'))
      .toBe('ckt1q9gry5zgfg6x29ak0zpfm44kfduhz9l9c0d7guwrmp9dy3')
  })

  it('last path of uri', async () => {
    expect(lastPathOfUrl('https://explorer.nervos.org/address/ckt1q9gry5zgfg6x29ak0zpfm44kfduhz9l9c0d7guwrmp9dy3'))
      .toBe('ckt1q9gry5zgfg6x29ak0zpfm44kfduhz9l9c0d7guwrmp9dy3')
  })

  it('last path of uri', async () => {
    expect(lastPathOfUrl('https://explorer.nervos.org'))
      .toBe(undefined)
  })

  it('last path of uri', async () => {
    expect(lastPathOfUrl('https://explorer.nervos.org/'))
      .toBe("")
  })

})
