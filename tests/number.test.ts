import { localeNumberString, handleHashRate, handleDifficulty } from '../src/utils/number'

describe('Number methods tests', () => {

  it('local number string', async () => {
    expect(localeNumberString('0')).toBe('0')
    expect(localeNumberString('0.00000004')).toBe('0.00000004')
    expect(localeNumberString('0.00034')).toBe('0.00034')
    expect(localeNumberString('222333')).toBe('222,333')
    expect(localeNumberString('2223333')).toBe('2,223,333')
    expect(localeNumberString('22223333')).toBe('22,223,333')
    expect(localeNumberString('2223333.0')).toBe('2,223,333')
    expect(localeNumberString('223.33')).toBe('223.33')
    expect(localeNumberString('777777223.33454')).toBe('777,777,223.33454')
    expect(localeNumberString('0x66ccff')).toBe('6,737,151')
    expect(localeNumberString('aswqda')).toBe('0')
    expect(localeNumberString('false')).toBe('0')
    expect(localeNumberString('#￥@#￥@')).toBe('0')
  })

  it('parse hash rate', async () => {
    expect(handleHashRate(123)).toBe("123 H/s")
    expect(handleHashRate(12345)).toBe("12,345 H/s")
    expect(handleHashRate(123454669)).toBe("123,454.67 KH/s")
    expect(handleHashRate(1234546698945)).toBe("1,234.55 GH/s")
    expect(handleHashRate(100003439)).toBe("100,003.44 KH/s")
    expect(handleHashRate(100000)).toBe("100,000 H/s")
    expect(handleHashRate(1000000)).toBe("1,000 KH/s")
    expect(handleHashRate('0x66ccff')).toBe('6,737.15 KH/s')
    expect(handleHashRate('aswqda')).toBe("0 H/s")
    expect(handleHashRate('false')).toBe("0 H/s")
    expect(handleHashRate('#￥@#￥@')).toBe("0 H/s")
  })

  it('parse difficulty', async () => {
      expect(handleDifficulty(123)).toBe("123 H")
      expect(handleDifficulty(12345)).toBe("12,345 H")
      expect(handleDifficulty(123454669)).toBe("123,454.67 KH")
      expect(handleDifficulty(1234546698945)).toBe("1,234.55 GH")
      expect(handleDifficulty(100003439)).toBe("100,003.44 KH")
      expect(handleDifficulty('0x66ccff')).toBe('6,737.15 KH')
      expect(handleDifficulty('aswqda')).toBe('0 H')
      expect(handleDifficulty('false')).toBe('0 H')
      expect(handleDifficulty('#￥@#￥@')).toBe('0 H')
    })
})
