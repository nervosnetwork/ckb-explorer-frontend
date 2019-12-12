import { formatData, parseTime, parseTimeNoSecond, parseSimpleDate, parseSimpleDateNoSecond, parseDateNoTime } from '../src/utils/date'

describe('Date methods tests', () => {
  it('format date data', async () => {
    expect(formatData(2)).toBe('02')
    expect(formatData(10)).toBe(10)
  })

  it('parse time', async () => {
    expect(parseTime(5500000)).toBe('1 h 31 m 40 s')
    expect(parseTime(1000000)).toBe('16 m 40 s')
    expect(parseTime(60000)).toBe('1 m 0 s')
    expect(parseTime(12233)).toBe('12.23 s')
  })

  it('parse time with second', async () => {
    expect(parseTimeNoSecond(13465691)).toBe('04 h 28 m')
    expect(parseTimeNoSecond(19895691)).toBe('14 h 34 m')
  })

  it('parse simple date', async () => {
    expect(parseSimpleDate(1576157854000)).toBe('2019/12/12 21:37:34')
  })

  it('parse simple date no second', async () => {
    expect(parseSimpleDateNoSecond(1576157854000)).toBe('2019-12-12 21:37')
  })

  it('parse date no time', async () => {
    expect(parseDateNoTime(1576157854)).toBe('2019/12/12')
  })
})
