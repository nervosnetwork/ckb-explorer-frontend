import { formatData, parseTime, parseTimeNoSecond, parseDateNoTime, parseDiffDate } from '../src/utils/date'

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

  it('parse time no second', async () => {
    expect(parseTimeNoSecond(13465691)).toBe('3 h 44 m')
    expect(parseTimeNoSecond(19895691)).toBe('5 h 31 m')
  })

  it('parse date no time', async () => {
    expect(parseDateNoTime(1576157854)).toBe('2019/12/12')
  })

  it('parse diff date', async () => {
    expect(parseDiffDate(1577110366093, 1579568429375)).toBe('28 days 10 hrs')
    expect(() => {
      parseDiffDate(1579568429375, 1577110366093)
    }).toThrow('End timestamp must be bigger than start timestamp')
  })
})
