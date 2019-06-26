import { parseHashRate, localeNumberString } from '../src/utils/number'

describe('Number methods tests', () => {

  it('parse hash rate', async () => {
    expect(parseHashRate(1234546698945)).toBe("1.23 TH/s")
    expect(parseHashRate(100003439)).toBe("100.00 MH/s")
  })

  it('parse number', async () => {
    expect(localeNumberString('222333')).toBe('222,333')
    expect(localeNumberString('2223333')).toBe('2,223,333')
    expect(localeNumberString('22223333')).toBe('22,223,333')
    expect(localeNumberString('2223333.0')).toBe('2,223,333')
    expect(localeNumberString('223.33')).toBe('223.33')
    expect(localeNumberString('777777223.33454')).toBe('777,777,223.33454')
    expect(localeNumberString('0x66ccff', 16)).toBe('6,737,151')
    expect(localeNumberString('aswqda')).toBe('NaN')
    expect(localeNumberString(false)).toBe('NaN')
  })
})
