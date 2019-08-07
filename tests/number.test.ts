import { parseHashRate, parseNumber, localeNumberString } from '../src/utils/number'

describe('Number methods tests', () => {

  it('parse number', async () => {
    expect(parseNumber('222333')).toBe(222333)
    expect(parseNumber('222333', 16)).toBe(2237235)
    expect(parseNumber('2223333.0')).toBe(2223333)
    expect(parseNumber('223.33')).toBe(223.33)
    expect(parseNumber('223.33', 10)).toBe(223)
    expect(parseNumber('0x66ccff', 16)).toBe(6737151)
    expect(parseNumber('aswqda')).toBe(0)
  })

  it('local number string', async () => {
    expect(localeNumberString('222333')).toBe('222,333')
    expect(localeNumberString('2223333')).toBe('2,223,333')
    expect(localeNumberString('22223333')).toBe('22,223,333')
    expect(localeNumberString('2223333.0')).toBe('2,223,333')
    expect(localeNumberString('223.33')).toBe('223.33')
    expect(localeNumberString('777777223.33454')).toBe('777,777,223.33454')
    expect(localeNumberString('0x66ccff', 16)).toBe('6,737,151')
    expect(localeNumberString('aswqda')).toBe('0')
    expect(localeNumberString('false')).toBe('0')
  })
})
