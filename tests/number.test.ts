import { parseNumber, localeNumberString, handleHashRate } from '../src/utils/number'

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

  it('parse hash rate', async () => {
    expect(handleHashRate(123)).toBe("123.00 H/s")
    expect(handleHashRate(12345)).toBe("12.35 KH/s")
    expect(handleHashRate(123454669)).toBe("123.45 MH/s")
    expect(handleHashRate(1234546698945)).toBe("1.23 TH/s")
    expect(handleHashRate(100003439)).toBe("100.00 MH/s")
  })

})
