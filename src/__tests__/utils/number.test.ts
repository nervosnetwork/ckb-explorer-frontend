import {
  localeNumberString,
  handleHashRate,
  handleDifficulty,
  parseIndicator,
  parseEpochNumber,
  parseUDTAmount,
} from '../../utils/number'

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
    expect(localeNumberString(-222333)).toBe('-222,333')
    expect(localeNumberString(-2223333)).toBe('-2,223,333')
    expect(localeNumberString(-22223333)).toBe('-22,223,333')
    expect(localeNumberString(-2223333.0)).toBe('-2,223,333')
    expect(localeNumberString(-223.33)).toBe('-223.33')
    expect(localeNumberString('777777223.33454')).toBe('777,777,223.33454')
    expect(localeNumberString('0x66ccff')).toBe('6,737,151')
    expect(localeNumberString('aswqda')).toBe('0')
    expect(localeNumberString('false')).toBe('0')
    expect(localeNumberString('#￥@#￥@')).toBe('0')
  })

  it('parse hash rate', async () => {
    expect(handleHashRate(123)).toBe('123 H/s')
    expect(handleHashRate(12345)).toBe('12.35 KH/s')
    expect(handleHashRate(123454669)).toBe('123.45 MH/s')
    expect(handleHashRate(1234546698945)).toBe('1.23 TH/s')
    expect(handleHashRate(100003439)).toBe('100 MH/s')
    expect(handleHashRate(100000)).toBe('100 KH/s')
    expect(handleHashRate(1000000)).toBe('1 MH/s')
    expect(handleHashRate('0x66ccff')).toBe('6.74 MH/s')
    expect(handleHashRate('aswqda')).toBe('0 H/s')
    expect(handleHashRate('false')).toBe('0 H/s')
    expect(handleHashRate('#￥@#￥@')).toBe('0 H/s')
  })

  it('parse difficulty', async () => {
    expect(handleDifficulty(123)).toBe('123 H')
    expect(handleDifficulty(12345)).toBe('12.35 KH')
    expect(handleDifficulty(123454669)).toBe('123.45 MH')
    expect(handleDifficulty(1234546698945)).toBe('1.23 TH')
    expect(handleDifficulty(100003439)).toBe('100 MH')
    expect(handleDifficulty('0x66ccff')).toBe('6.74 MH')
    expect(handleDifficulty('aswqda')).toBe('0 H')
    expect(handleDifficulty('false')).toBe('0 H')
    expect(handleDifficulty('#￥@#￥@')).toBe('0 H')
  })

  it('parse indicator', async () => {
    expect(parseIndicator('1')).toBe('st')
    expect(parseIndicator('2')).toBe('nd')
    expect(parseIndicator('3')).toBe('rd')
    expect(parseIndicator('6')).toBe('th')
    expect(parseIndicator('11')).toBe('th')
    expect(parseIndicator('12')).toBe('th')
    expect(parseIndicator('13')).toBe('th')
    expect(parseIndicator('17')).toBe('th')
    expect(parseIndicator('231')).toBe('st')
    expect(parseIndicator('632')).toBe('nd')
    expect(parseIndicator('123')).toBe('rd')
    expect(parseIndicator('636')).toBe('th')
    expect(parseIndicator('129')).toBe('th')
  })

  it('parse epoch number', async () => {
    expect(parseEpochNumber('1')).toBe('1st')
    expect(parseEpochNumber('2')).toBe('2nd')
    expect(parseEpochNumber('3')).toBe('3rd')
    expect(parseEpochNumber('6')).toBe('6th')
    expect(parseEpochNumber('11')).toBe('11th')
    expect(parseEpochNumber('12')).toBe('12th')
    expect(parseEpochNumber('13')).toBe('13th')
    expect(parseEpochNumber('17')).toBe('17th')
    expect(parseEpochNumber('231')).toBe('231st')
    expect(parseEpochNumber('632')).toBe('632nd')
    expect(parseEpochNumber('123')).toBe('123rd')
    expect(parseEpochNumber('636')).toBe('636th')
    expect(parseEpochNumber('129')).toBe('129th')
  })

  it('parse udt amount', async () => {
    expect(parseUDTAmount('10000023598667', '5')).toBe('100,000,235.9866')
    expect(parseUDTAmount('10000000000000', '5')).toBe('100,000,000')
    expect(parseUDTAmount('10000000000001', '5')).toBe('100,000,000')
    expect(parseUDTAmount('10000000000021', '5')).toBe('100,000,000.0002')
    expect(parseUDTAmount('10000', '6')).toBe('0.01')
    expect(parseUDTAmount('10000', '7')).toBe('0.001')
    expect(parseUDTAmount('2132435', '3')).toBe('2,132.435')
    expect(parseUDTAmount('123456789', '4')).toBe('12,345.6789')
    expect(parseUDTAmount('123456789828456789', '11')).toBe('1,234,567.8982')
    expect(parseUDTAmount('efd4567898234abc6789', '11')).toBe('0')
  })
})
